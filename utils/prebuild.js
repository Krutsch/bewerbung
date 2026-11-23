import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const sourceFile = process.argv[2];
const buildFile = join("build", relative("src", sourceFile));

await mkdir(dirname(buildFile), { recursive: true });
await copyFile(sourceFile, buildFile);
