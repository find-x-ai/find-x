import { spawn } from "child_process";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

function startProcess(command, args, cwd, name) {
  const options = {
    cwd: join(rootDir, cwd),
    shell: true,
    stdio: "pipe",
    env: {
      ...globalThis.process.env,
      PYTHONIOENCODING: "utf-8",
      PYTHONUTF8: "1",
    },
  };

  const process = spawn(command, args, options);

  process.stdout.setEncoding("utf-8");
  process.stderr.setEncoding("utf-8");

  process.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(`[${name}] ${output}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`[${name}] ${data.toString()}`);
  });

  process.on("error", (error) => {
    console.error(`[${name}] Failed to start:`, error);
  });

  return process;
}

// Start website process
console.log("Starting website development server...");

const process = startProcess("pnpm", ["dev"], "website", "website");

// Handle script termination
process.on("SIGINT", () => {
  console.log("\nShutting down process...");
  process.kill();
  process.exit(0);
});
