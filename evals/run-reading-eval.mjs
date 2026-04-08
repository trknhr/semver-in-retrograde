import { spawn } from "node:child_process";

const forwardedArgs = process.argv.slice(2);
const hasExplicitGrader = forwardedArgs.includes("--grader");
const promptfooCommand = [
  "promptfoo",
  "eval",
  "-c",
  "promptfooconfig.yaml",
  "--env-file",
  ".env.local",
  ...(!hasExplicitGrader
    ? ["--grader", "google:gemini-3.1-flash-lite-preview"]
    : []),
  ...forwardedArgs,
].join(" ");

const child = spawn(
  "npx",
  [
    "start-server-and-test",
    "dev",
    "http://127.0.0.1:3000",
    promptfooCommand,
  ],
  {
    stdio: "inherit",
    shell: false,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
