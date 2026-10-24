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
}

const childProcess = process.getBuiltinModule("node:child_process") as ChildProcessApi
const defaultTimeoutMs = 3000
const maxOutputBytes = 1024 * 1024

export type WfIpcliCommand = "active-window" | "config" | "kb-layout" | "touch-state"
export type WayfireView = Record<string, unknown>

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

function isInvokedDirectly() {
  return /(?:^|[/\\])wayfire-ipc\.ts$/.test(process.argv[1] ?? "")
}

if (isInvokedDirectly()) {
  const command = (process.argv[2] || "active-window") as WfIpcliCommand
  const args = process.argv.slice(3)

  runWfIpcli(command, args)
    .then((result) => {
      process.stdout.write(`${typeof result === "string" ? result : JSON.stringify(result, null, 2)}\n`)
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error)
      process.stderr.write(`${message}\n`)
      process.exitCode = 1
    })
}
