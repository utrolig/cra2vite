import { promises as fs } from "fs";
import path from "path";

export const errFilename = "cra2vite.error.log";

export async function appendToErrorFile(err: Error) {
  const content = err?.message || err.toString();
  const filepath = path.resolve(process.cwd(), errFilename);

  const timestamp = new Date().toISOString();

  const msg = [
    `Time: ${timestamp}`,
    content,
    "--------------------",
    "\n",
  ].join("\n");

  await fs.appendFile(filepath, msg);
}
