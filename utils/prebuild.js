import { copyFile, mkdir } from "fs/promises";

const SOURCE_FOLDER = "src";
const BUILD_FOLDER = "build";
const file = process.argv[2];

if (
  file === `${SOURCE_FOLDER}/_headers` ||
  /\.(woff|txt|ico)/.test(file) ||
  file === `${SOURCE_FOLDER}/netlify.toml` ||
  file.endsWith(".webp") ||
  file.endsWith(".avif")
) {
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
