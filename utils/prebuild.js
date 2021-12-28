import fs from "fs";
import sharp from "sharp";

const SOURCE_FOLDER = "src";
const BUILD_FOLDER = "build";
const file = process.argv[2];

if (file === "src/_headers" || /\.(woff|txt|ico)/.test(file)) {
  copyFile(file);
} else if (file.endsWith(".jpg")) {
  sharp(file)
    .jpeg({
      quality: 80,
    })
    .toFile(toBuildFile(file))
    .catch((err) => {
      console.error(err);
    });
} else if (file.endsWith(".webp")) {
  sharp(file)
    .webp({
      quality: 80,
    })
    .toFile(toBuildFile(file))
    .catch((err) => {
      console.error(err);
    });
}

console.log(`finished handling ${file}`);

function copyFile(file) {
  const buildFile = toBuildFile(file);
  const dir = buildFile.split("/").slice(0, -1).join("/");

  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(file, buildFile);
}

function toBuildFile(file) {
  return file.replace(`${SOURCE_FOLDER}/`, `${BUILD_FOLDER}/`);
}
