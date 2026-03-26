import { chromium } from "@playwright/test";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const HERO_BASE_WIDTH = 2560;
const HERO_BASE_HEIGHT = 1365;
const CASE_CARD_RATIO = 16 / 10;

const heroWidths = [640, 768, 960, 1280, 1536, 1920, 2560];
const caseCardWidths = [320, 420, 535];

const heroInputs = ["1", "2", "3", "4", "5", "6"].map((name) => ({
  inputPath: path.join(ROOT_DIR, "public", "images", "hero", `${name}.avif`),
  outputs: heroWidths.map((width) => ({
    outputPath: path.join(ROOT_DIR, "public", "images", "hero", "responsive", `${name}-${width}.webp`),
    width,
    height: Math.round((width / HERO_BASE_WIDTH) * HERO_BASE_HEIGHT),
    fit: "contain",
    quality: width >= 1920 ? 0.8 : 0.82
  }))
}));

const caseInputs = [
  ["cofe", ["1", "2", "3"]],
  ["game", ["game"]],
  ["retail", ["retail", "retail2"]]
].flatMap(([folder, names]) =>
  names.map((name) => ({
    inputPath: path.join(ROOT_DIR, "public", "images", "cases", folder, `${name}.avif`),
    outputs: caseCardWidths.map((width) => ({
      outputPath: path.join(ROOT_DIR, "public", "images", "cases", folder, "responsive", `${name}-card-${width}.webp`),
      width,
      height: Math.round(width / CASE_CARD_RATIO),
      fit: "cover",
      quality: 0.84
    }))
  }))
);

async function ensureDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function readFileAsDataUrl(filePath) {
  const buffer = await fs.readFile(filePath);
  const extension = path.extname(filePath).slice(1).toLowerCase();

  return `data:image/${extension};base64,${buffer.toString("base64")}`;
}

async function writeWebpVariant(page, dataUrl, output) {
  const encodedImage = await page.evaluate(
    async ({ imageUrl, width, height, fit, quality }) => {
      const image = await new Promise((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error(`Unable to decode image: ${imageUrl.slice(0, 48)}...`));
        element.src = imageUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { alpha: false });

      if (!context) {
        throw new Error("Canvas 2D context is unavailable.");
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;

      if (fit === "cover") {
        const sourceAspectRatio = image.naturalWidth / image.naturalHeight;
        const targetAspectRatio = width / height;

        if (sourceAspectRatio > targetAspectRatio) {
          sourceWidth = Math.round(image.naturalHeight * targetAspectRatio);
          sourceX = Math.round((image.naturalWidth - sourceWidth) / 2);
        } else if (sourceAspectRatio < targetAspectRatio) {
          sourceHeight = Math.round(image.naturalWidth / targetAspectRatio);
          sourceY = Math.round((image.naturalHeight - sourceHeight) / 2);
        }
      }

      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/webp", quality);
      });

      if (!blob || blob.type !== "image/webp") {
        throw new Error("WebP export failed.");
      }

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error ?? new Error("Unable to read WebP output."));
        reader.readAsDataURL(blob);
      });

      if (typeof dataUrl !== "string") {
        throw new Error("Unexpected output while reading WebP data URL.");
      }

      return dataUrl;
    },
    {
      imageUrl: dataUrl,
      width: output.width,
      height: output.height,
      fit: output.fit,
      quality: output.quality
    }
  );

  const base64Payload = encodedImage.replace(/^data:image\/webp;base64,/, "");
  await ensureDirectory(output.outputPath);
  await fs.writeFile(output.outputPath, Buffer.from(base64Payload, "base64"));
}

async function generateSet(page, input) {
  const dataUrl = await readFileAsDataUrl(input.inputPath);

  for (const output of input.outputs) {
    await writeWebpVariant(page, dataUrl, output);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setContent("<!doctype html><html><body></body></html>");

    for (const input of [...heroInputs, ...caseInputs]) {
      await generateSet(page, input);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
