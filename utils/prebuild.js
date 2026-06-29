import { copyFile, mkdir } from "node:fs/promises";

const SOURCE_FOLDER = "src";
const BUILD_FOLDER = "build";
const file = process.argv[2];

if (/\.(woff|txt|ico|avif|xml|md|json)/.test(file)) {
  await copyFileWithDir(file);
  console.log(`finished handling ${file}`);
}

async function copyFileWithDir(file) {
  const buildFile = toBuildFile(file);
  const dir = buildFile.split("/").slice(0, -1).join("/");

  await mkdir(dir, { recursive: true });
  await copyFile(file, buildFile);
}

function toBuildFile(file) {
  return file.replace(`${SOURCE_FOLDER}/`, `${BUILD_FOLDER}/`);
}
