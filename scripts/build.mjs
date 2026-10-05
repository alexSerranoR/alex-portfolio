import { existsSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildDirectory = join(projectRoot, ".next");

// OneDrive directories can be Windows reparse points, which Next's recursive
// Node cleanup may mistake for files. Native PowerShell understands them.
// Only this repository's generated .next output is eligible for cleanup.
if (process.platform === "win32" && existsSync(buildDirectory)) {
  if (
    realpathSync(buildDirectory) !== join(realpathSync(projectRoot), ".next")
  ) {
    throw new Error(
      "Refusing to clean a build directory outside the repository.",
    );
  }
  const cleanup = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "$ErrorActionPreference = 'Stop'; $buildTarget = [IO.Path]::GetFullPath($env:PORTFOLIO_BUILD_DIR); $buildRoot = [IO.Path]::GetFullPath($env:PORTFOLIO_PROJECT_ROOT); if ($buildTarget -ne [IO.Path]::Combine($buildRoot, '.next')) { throw 'Invalid build directory' }; Remove-Item -LiteralPath $buildTarget -Recurse -Force",
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PORTFOLIO_BUILD_DIR: buildDirectory,
        PORTFOLIO_PROJECT_ROOT: projectRoot,
      },
    },
  );
  if (cleanup.error) throw cleanup.error;
  if (cleanup.status !== 0) process.exit(cleanup.status ?? 1);
}

const build = spawnSync(
  process.execPath,
  [join(projectRoot, "node_modules", "next", "dist", "bin", "next"), "build"],
  { cwd: projectRoot, stdio: "inherit", env: process.env },
);
if (build.error) throw build.error;
process.exit(build.status ?? 1);
