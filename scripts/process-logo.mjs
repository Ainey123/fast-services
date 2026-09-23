import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function processLogo() {
  const inputPath = path.resolve('public/fes-logo.jpg');
  const metadata = await sharp(inputPath).metadata();
  console.log('Original image dimensions:', metadata.width, metadata.height);

  // Trim excess white space
  const trimmed = await sharp(inputPath)
    .trim({ background: '#ffffff', threshold: 10 })
    .toBuffer();

  const trimmedMeta = await sharp(trimmed).metadata();
  console.log('Trimmed dimensions:', trimmedMeta.width, trimmedMeta.height);

  // Make it a clean square with small padding
  const size = Math.max(trimmedMeta.width, trimmedMeta.height);
  const paddedSize = Math.round(size * 1.08); // 8% padding

  const squareBuffer = await sharp(trimmed)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: Math.round((paddedSize - size) / 2),
      bottom: Math.round((paddedSize - size) / 2),
      left: Math.round((paddedSize - size) / 2),
      right: Math.round((paddedSize - size) / 2),
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toBuffer();

  // 1. High-Res Logo PNG
  await sharp(squareBuffer)
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile('public/fes-logo.png');
  console.log('Created public/fes-logo.png');

  // 2. Icon 512x512
  await sharp(squareBuffer)
    .resize(512, 512)
    .png({ quality: 95 })
    .toFile('public/icon-512.png');
  console.log('Created public/icon-512.png');

  // 3. Icon 192x192
  await sharp(squareBuffer)
    .resize(192, 192)
    .png({ quality: 95 })
    .toFile('public/icon-192.png');
  console.log('Created public/icon-192.png');

  // 4. Favicon / Apple Touch Icon
  await sharp(squareBuffer)
    .resize(180, 180)
    .png({ quality: 95 })
    .toFile('public/apple-touch-icon.png');

  await sharp(squareBuffer)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.ico');
  console.log('Updated public/favicon.ico');
}

processLogo().catch(console.error);
