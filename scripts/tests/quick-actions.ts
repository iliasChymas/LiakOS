function check(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

function command(argv: string[], userInstalledApp = true): Promise<CommandResult> {
  return new Promise(resolve => runCommand(argv, resolve, { userInstalledApp }))
}

const loop = new GLib.MainLoop(null, false)
let failed = false
async function test() {
  const originalPath = GLib.getenv("PATH")
  const baseline = await command(["lsettings", "--probe"], false)
  check(!baseline.ok && baseline.stderr.includes("lsettings"), "Original bare command must reproduce spawn failure")
  for (const app of ["lsettings", "ldisplays", "lkeybinds", "lautostart", "lpaper"]) {
    const result = await command([app, "argument with spaces"])
    check(result.ok && result.stdout === `${app}|argument with spaces\n`, `Could not launch installed ${app}: ${result.stderr}`)
  }
  const child = await command(["lsettings", "--child-probe"])
  check(child.ok && child.stdout === "lpaper|--child\n", "Child app did not inherit the user bin PATH")
  const fallback = await command(["path-only"])
  check(fallback.ok && fallback.stdout === "fallback\n", "Executable on PATH was not used as fallback")
  const missing = await command(["liakos-no-such-test-app"])
  check(!missing.ok && missing.stderr.includes("liakos-no-such-test-app"), "Missing app did not report spawn error")
  const failure = await command(["failing-app"])
  check(!failure.ok && failure.stderr === "fixture failure\n", "Nonzero exit and stderr were not reported")
  check(GLib.getenv("PATH") === originalPath, "The bar's own PATH changed")
  print("PASS: reproduced original failure; all five quick actions, child launch, PATH fallback, and error reporting")
}
test().catch(error => {
  failed = true
  printerr(String(error))
}).finally(() => loop.quit())
loop.run()
if (failed) throw new Error("Quick-action regression checks failed")
