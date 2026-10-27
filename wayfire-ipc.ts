#!/usr/bin/env node

/**
 * Small Node wrapper around wf-ipcli.
 *
 * Examples:
 *   node wayfire-ipc.ts active-window
 *   node wayfire-ipc.ts config
 *   node wayfire-ipc.ts kb-layout
 *   node wayfire-ipc.ts touch-state enabled
 *
 * Set WF_IPCLI_BIN if wf-ipcli is not available under that name in PATH.
 */

type NodeProcess = {
  argv: string[]
  env: Record<string, string | undefined>
  getBuiltinModule(name: string): unknown
  stdout: { write(value: string): unknown }
  stderr: { write(value: string): unknown }
  exitCode?: number
}

declare const process: NodeProcess

type ChildProcessError = Error & {
  code?: string | number
  killed?: boolean
}

type ExecFileOptions = {
  encoding: "utf8"
  timeout: number
  maxBuffer: number
}

type ChildProcessApi = {
  execFile(
    file: string,
    args: string[],
    options: ExecFileOptions,
    callback: (error: ChildProcessError | null, stdout: string, stderr: string) => void,
  ): unknown
  spawn(file: string, args: string[], options: SpawnOptions): SpawnedProcess
}

type SpawnOptions = {
  detached: boolean
  stdio: "ignore"
  env: Record<string, string | undefined>
  cwd?: string
}

interface SpawnedProcess {
  pid?: number
  unref(): void
  once(event: "spawn", callback: () => void): this
  once(event: "error", callback: (error: Error) => void): this
}

interface IpcSocket {
  write(value: Uint8Array): boolean
  destroy(error?: Error): this
  setTimeout(milliseconds: number, callback: () => void): this
  on(event: "data", callback: (value: Uint8Array) => void): this
  on(event: "error", callback: (error: Error) => void): this
}

type NetApi = {
  createConnection(options: { path: string }): IpcSocket
}

type TextEncoderLike = { encode(value?: string): Uint8Array }
type TextDecoderLike = { decode(value?: Uint8Array): string }
type TextCodecApi = {
  TextEncoder: new () => TextEncoderLike
  TextDecoder: new () => TextDecoderLike
}

const childProcess = process.getBuiltinModule("node:child_process") as ChildProcessApi
const net = process.getBuiltinModule("node:net") as NetApi
const textCodec = process.getBuiltinModule("node:util") as TextCodecApi
const defaultTimeoutMs = 3000
const maxOutputBytes = 1024 * 1024
const encoder = new textCodec.TextEncoder()
const decoder = new textCodec.TextDecoder()

export type WfIpcliCommand = "active-window" | "config" | "kb-layout" | "touch-state"
export type WayfireView = Record<string, any> & {
  id: number
  pid?: number
  "app-id"?: string
  title?: string
  geometry?: { x: number; y: number; width: number; height: number }
  "output-id"?: number
}
export type WayfireOutput = Record<string, any> & {
  id: number
  name: string
  workspace?: {
    x?: number
    y?: number
    grid_width?: number
    grid_height?: number
    [key: string]: unknown
  }
}
export type WorkspacePosition = { x: number; y: number }
export type WayfireEvent = Record<string, any> & { event: string }

const validGridSlots = new Set([
  "slot_tl", "slot_t", "slot_tr", "slot_l", "slot_c", "slot_r",
  "slot_bl", "slot_b", "slot_br",
])

function executablePath() {
  return process.env.WF_IPCLI_BIN?.trim() || "wf-ipcli"
}

function parseResponse(stdout: string): unknown {
  const output = stdout.trim()
  if (!output) return ""

  try {
    return JSON.parse(output) as unknown
  } catch {
    // Some wf-ipcli commands print plain text rather than JSON.
    return output
  }
}

/** Run one wf-ipcli command and return parsed JSON or trimmed plain text. */
export function runWfIpcli(
  command: WfIpcliCommand,
  args: string[] = [],
  timeoutMs = defaultTimeoutMs,
): Promise<unknown> {
  if (command === "touch-state" && args.length > 0 && !["enabled", "disabled"].includes(args[0])) {
    return Promise.reject(new Error('touch-state accepts only "enabled" or "disabled"'))
  }

  return new Promise((resolve, reject) => {
    childProcess.execFile(
      executablePath(),
      [command, ...args],
      { encoding: "utf8", timeout: timeoutMs, maxBuffer: maxOutputBytes },
      (error, stdout, stderr) => {
        if (error) {
          const details = stderr.trim() || error.message
          reject(new Error(`wf-ipcli ${command} failed: ${details}`, { cause: error }))
          return
        }

        resolve(parseResponse(stdout))
      },
    )
  })
}

/** Return the focused Wayfire view, or null if no view is focused. */
export async function getFocusedView(): Promise<WayfireView | null> {
  const result = await runWfIpcli("active-window")
  if (result === null) return null
  if (typeof result !== "object" || Array.isArray(result)) {
    throw new Error("wf-ipcli active-window returned an unexpected response")
  }

  return result as WayfireView
}

/** Return Wayfire's current configuration response. */
export function getWayfireConfiguration(): Promise<unknown> {
  return runWfIpcli("config")
}

function socketPath(): string {
  const path = process.env.WAYFIRE_SOCKET?.trim()
  if (!path) {
    throw new Error("WAYFIRE_SOCKET is not set; Wayfire IPC is only available inside a Wayfire session")
  }
  return path
}

/** Send one JSON request directly to Wayfire's framed Unix-socket IPC. */
export function callWayfire(method: string, data?: Record<string, unknown>, timeoutMs = defaultTimeoutMs): Promise<any> {
  if (!method.trim()) return Promise.reject(new Error("Wayfire IPC method cannot be empty"))

  return new Promise((resolve, reject) => {
    let socket: IpcSocket
    try {
      socket = net.createConnection({ path: socketPath() })
    } catch (error) {
      reject(error)
      return
    }

    let settled = false
    let responseBuffer = new Uint8Array(0)
    const fail = (error: Error) => {
      if (settled) return
      settled = true
      socket.destroy()
      reject(error)
    }
    socket.setTimeout(timeoutMs, () => fail(new Error(`Wayfire IPC timed out calling ${method}`)))
    socket.on("error", (error) => fail(new Error(`Wayfire IPC ${method} failed: ${error.message}`, { cause: error })))
    socket.on("data", (chunk) => {
      const merged = new Uint8Array(responseBuffer.length + chunk.length)
      merged.set(responseBuffer)
      merged.set(chunk, responseBuffer.length)
      responseBuffer = merged

      while (responseBuffer.length >= 4) {
        const frameLength = new DataView(responseBuffer.buffer, responseBuffer.byteOffset, 4).getUint32(0, true)
        if (frameLength > maxOutputBytes) {
          fail(new Error(`Wayfire IPC response exceeded ${maxOutputBytes} bytes`))
          return
        }
        if (responseBuffer.length < frameLength + 4) return

        const frame = responseBuffer.slice(4, frameLength + 4)
        responseBuffer = responseBuffer.slice(frameLength + 4)
        let response: any
        try {
          response = JSON.parse(decoder.decode(frame))
        } catch (error) {
          fail(new Error(`Wayfire IPC returned invalid JSON for ${method}`, { cause: error }))
          return
        }
        if (response?.event) continue
        if (response?.error) {
          fail(new Error(`Wayfire IPC ${method}: ${response.error}`))
          return
        }
        if (!settled) {
          settled = true
          socket.destroy()
          resolve(response)
        }
        return
      }
    })

    // The 4-byte little-endian length prefix is part of Wayfire's IPC wire format.
    const payload = encoder.encode(JSON.stringify({ method, ...(data ? { data } : {}) }))
    const request = new Uint8Array(payload.length + 4)
    new DataView(request.buffer).setUint32(0, payload.length, true)
    request.set(payload, 4)
    socket.write(request)
  })
}

function requireArray<T>(value: unknown, description: string): T[] {
  if (!Array.isArray(value)) throw new Error(`Wayfire returned an unexpected ${description} response`)
  return value as T[]
}

/** Return connected outputs, including each output's current workspace and grid size. */
export async function listWayfireOutputs(): Promise<WayfireOutput[]> {
  return requireArray<WayfireOutput>(await callWayfire("window-rules/list-outputs"), "outputs")
}

/** Return windows known to Wayfire. */
export async function listWayfireViews(): Promise<WayfireView[]> {
  return requireArray<WayfireView>(await callWayfire("window-rules/list-views"), "views")
}

export async function getWayfireOutput(name: string): Promise<WayfireOutput> {
  const output = (await listWayfireOutputs()).find((candidate) => candidate.name === name)
  if (!output) throw new Error(`Wayfire output not found: ${name}`)
  return output
}

/** Switch one output to a workspace without changing the focused output. */
export async function setOutputWorkspace(outputName: string, position: WorkspacePosition): Promise<unknown> {
  const output = await getWayfireOutput(outputName)
  return callWayfire("vswitch/set-workspace", {
    x: position.x,
    y: position.y,
    "output-id": output.id,
  })
}

/** Move a window to a workspace on its current output. Workspace coordinates are zero-based. */
export function moveViewToWorkspace(viewId: number, position: WorkspacePosition): Promise<unknown> {
  return callWayfire("vswitch/send-view", {
    x: position.x,
    y: position.y,
    "view-id": viewId,
  })
}

/** Move a window to a named output and workspace while preserving its current geometry. */
export async function moveViewToOutputWorkspace(
  viewId: number,
  outputName: string,
  position: WorkspacePosition,
): Promise<unknown> {
  const [output, viewResponse] = await Promise.all([
    getWayfireOutput(outputName),
    callWayfire("window-rules/view-info", { id: viewId }),
  ])
  const view = viewResponse?.info as WayfireView | undefined
  const geometry = view?.geometry
  if (!geometry || ![geometry.x, geometry.y, geometry.width, geometry.height].every(Number.isFinite)) {
    throw new Error(`Wayfire did not return usable geometry for view ${viewId}`)
  }

  if (view?.["output-id"] !== output.id) {
    await callWayfire("window-rules/configure-view", {
      id: viewId,
      geometry,
      output_id: output.id,
    })
  }
  return moveViewToWorkspace(viewId, position)
}

export function setViewFullscreen(viewId: number, fullscreen: boolean): Promise<unknown> {
  return callWayfire("wm-actions/set-fullscreen", { view_id: viewId, state: fullscreen })
}

/** Apply one of Wayfire's simple-tile grid slots to a view. */
export function tileView(viewId: number, slot: string): Promise<unknown> {
  if (!validGridSlots.has(slot)) {
    return Promise.reject(new Error(`Unknown Wayfire grid slot: ${slot}`))
  }
  return callWayfire(`grid/${slot}`, { view_id: viewId })
}

/** Launch an argv command without a shell. Use TOML arrays, e.g. ["firefox", "youtube.com"]. */
export function launchApplication(command: readonly string[], cwd?: string): Promise<number> {
  if (!command.length || !command[0]?.trim()) return Promise.reject(new Error("Application command must include an executable"))
  return new Promise((resolve, reject) => {
    const child = childProcess.spawn(command[0], [...command.slice(1)], {
      detached: true,
      stdio: "ignore",
      env: process.env,
      ...(cwd ? { cwd } : {}),
    })
    child.once("error", (error) => reject(new Error(`Could not start application ${command[0]}: ${error.message}`, { cause: error })))
    child.once("spawn", () => {
      if (!child.pid) {
        reject(new Error(`Could not get a process ID for application: ${command[0]}`))
        return
      }
      child.unref()
      resolve(child.pid)
    })
  })
}

/** Subscribe to selected Wayfire IPC events; call the returned function to close the subscription. */
export function watchWayfireEvents(
  events: string[],
  onEvent: (event: WayfireEvent) => void,
  timeoutMs = defaultTimeoutMs,
): Promise<() => void> {
  if (!events.length) return Promise.reject(new Error("At least one Wayfire event is required"))

  return new Promise((resolve, reject) => {
    let socket: IpcSocket
    try {
      socket = net.createConnection({ path: socketPath() })
    } catch (error) {
      reject(error)
      return
    }
    let buffer = new Uint8Array(0)
    let subscribed = false
    let closed = false
    const close = () => {
      if (closed) return
      closed = true
      socket.destroy()
    }
    const fail = (error: Error) => {
      close()
      if (!subscribed) reject(error)
    }
    socket.setTimeout(timeoutMs, () => fail(new Error("Wayfire event subscription timed out")))
    socket.on("error", (error) => fail(new Error(`Wayfire event subscription failed: ${error.message}`, { cause: error })))
    socket.on("data", (chunk) => {
      const merged = new Uint8Array(buffer.length + chunk.length)
      merged.set(buffer)
      merged.set(chunk, buffer.length)
      buffer = merged
      while (buffer.length >= 4) {
        const frameLength = new DataView(buffer.buffer, buffer.byteOffset, 4).getUint32(0, true)
        if (frameLength > maxOutputBytes) return fail(new Error("Wayfire event frame is too large"))
        if (buffer.length < frameLength + 4) return
        const frame = buffer.slice(4, frameLength + 4)
        buffer = buffer.slice(frameLength + 4)
        let message: any
        try {
          message = JSON.parse(decoder.decode(frame))
        } catch (error) {
          return fail(new Error("Wayfire returned invalid JSON in an event stream", { cause: error }))
        }
        if (message?.error) return fail(new Error(`Wayfire event subscription: ${message.error}`))
        if (message?.event) {
          if (subscribed) onEvent(message as WayfireEvent)
        } else if (!subscribed) {
          subscribed = true
          socket.setTimeout(0, () => undefined)
          resolve(close)
        }
      }
    })

    const payload = encoder.encode(JSON.stringify({
      method: "window-rules/events/watch",
      data: { events },
    }))
    const request = new Uint8Array(payload.length + 4)
    new DataView(request.buffer).setUint32(0, payload.length, true)
    request.set(payload, 4)
    socket.write(request)
  })
}

type WrapperCommand = WfIpcliCommand | "outputs" | "views" | "workspace" | "move-view" | "fullscreen" | "tile" | "launch"

function parseInteger(value: string | undefined, label: string): number {
  if (!value || !/^-?\d+$/.test(value)) throw new Error(`${label} must be an integer`)
  return Number(value)
}

function parseBoolean(value: string | undefined, label: string): boolean {
  if (value === "true") return true
  if (value === "false") return false
  throw new Error(`${label} must be true or false`)
}

async function runWrapperCommand(command: WrapperCommand, args: string[]): Promise<unknown> {
  switch (command) {
    case "outputs":
      return listWayfireOutputs()
    case "views":
      return listWayfireViews()
    case "workspace":
      if (args.length !== 3) throw new Error("Usage: workspace <output-name> <x> <y>")
      return setOutputWorkspace(args[0], { x: parseInteger(args[1], "workspace x"), y: parseInteger(args[2], "workspace y") })
    case "move-view":
      if (args.length !== 4) throw new Error("Usage: move-view <view-id> <output-name> <x> <y>")
      return moveViewToOutputWorkspace(
        parseInteger(args[0], "view ID"),
        args[1],
        { x: parseInteger(args[2], "workspace x"), y: parseInteger(args[3], "workspace y") },
      )
    case "fullscreen":
      if (args.length !== 2) throw new Error("Usage: fullscreen <view-id> <true|false>")
      return setViewFullscreen(parseInteger(args[0], "view ID"), parseBoolean(args[1], "fullscreen state"))
    case "tile":
      if (args.length !== 2) throw new Error("Usage: tile <view-id> <slot>")
      return tileView(parseInteger(args[0], "view ID"), args[1])
    case "launch": {
      const commandArgs = args[0] === "--" ? args.slice(1) : args
      return { pid: await launchApplication(commandArgs) }
    }
    default:
      return runWfIpcli(command, args)
  }
}

function isInvokedDirectly() {
  return /(?:^|[/\\])wayfire-ipc\.ts$/.test(process.argv[1] ?? "")
}

if (isInvokedDirectly()) {
  const command = (process.argv[2] || "active-window") as WrapperCommand
  const args = process.argv.slice(3)

  runWrapperCommand(command, args)
    .then((result) => {
      process.stdout.write(`${typeof result === "string" ? result : JSON.stringify(result, null, 2)}\n`)
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error)
      process.stderr.write(`${message}\n`)
      process.exitCode = 1
    })
}
