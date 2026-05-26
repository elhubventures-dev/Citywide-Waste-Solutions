import { spawnSync } from "node:child_process";

const result = spawnSync("next", ["build"], {
  env: { ...process.env, ANALYZE: "true" },
  shell: true,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
