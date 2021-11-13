import fs from "fs";
import glob from "glob";
import sharp from "sharp";

const SOURCE_FOLDER = "src";
const BUILD_FOLDER = "build";

// Remove old build folder
fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });

copyFiles(["src/_headers"]);
glob("src/**/*.!(js|ts|html|css)", {}, (err, files) => {
  if (err) throw err;

  copyFiles(files.filter((f) => /\.(woff|txt|ico)/.test(f)));
  jpegHandler(files.filter((f) => f.endsWith(".jpg")));
  webpHandler(files.filter((f) => f.endsWith(".webp")));

  console.log(`🛠️  Pre-build finished.`);
});

function copyFiles(files) {
  files.forEach(copyFile);
}

function jpegHandler(files) {
  files.forEach((file) => {
    sharp(file)
      .jpeg({
        quality: 80,
      })
      .toFile(toBuildFile(file))
      .catch((err) => {
        console.error(err);
      });
  });
}

function webpHandler(files) {
  files.forEach((file) => {
    sharp(file)
      .webp({
        quality: 80,
      })
      .toFile(toBuildFile(file))
      .catch((err) => {
        console.error(err);
      });
  });
}

function copyFile(file) {
  const buildFile = toBuildFile(file);
  const dir = buildFile.split("/").slice(0, -1).join("/");

  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(file, buildFile);
}

function toBuildFile(file) {
  return file.replace(`${SOURCE_FOLDER}/`, `${BUILD_FOLDER}/`);
}
