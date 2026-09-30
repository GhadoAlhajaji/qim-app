import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const files = ['raya', 'himma', 'lina', 'widad', 'itqan', 'bashayer', 'mizan', 'nizam', 'azoum'];
const srcDir = 'C:/Users/ghada/.cursor/projects/c-Users-ghada-Desktop-qem/assets';
const outDir = 'C:/Users/ghada/Desktop/qem/src/assets/characters';
mkdirSync(outDir, { recursive: true });

function isBackdrop(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max >= 248 && max - min <= 14;
}

for (const name of files) {
  const decoded = jpeg.decode(readFileSync(`${srcDir}/${name}.png`), { useTArray: true, formatAsRGBA: true });
  const { width, height, data } = decoded;
  const seen = new Uint8Array(width * height);
  const stack = [];

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (seen[p]) return;
    const i = p * 4;
    if (!isBackdrop(data[i], data[i + 1], data[i + 2])) return;
    seen[p] = 1;
    stack.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (stack.length) {
    const p = stack.pop();
    const i = p * 4;
    data[i + 3] = 0;
    const x = p % width;
    const y = Math.floor(p / width);
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] < 12) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  const pad = 12;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const out = new PNG({ width: cropW, height: cropH });
  for (let y = 0; y < cropH; y += 1) {
    for (let x = 0; x < cropW; x += 1) {
      const si = ((y + minY) * width + (x + minX)) * 4;
      const di = (y * cropW + x) * 4;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }
  const floor = Math.floor(cropH * 0.07);
  for (let y = cropH - floor; y < cropH; y += 1) {
    for (let x = 0; x < cropW; x += 1) {
      const di = (y * cropW + x) * 4;
      const max = Math.max(out.data[di], out.data[di + 1], out.data[di + 2]);
      const min = Math.min(out.data[di], out.data[di + 1], out.data[di + 2]);
      if (max > 244 && max - min < 18) out.data[di + 3] = 0;
    }
  }
  writeFileSync(`${outDir}/${name}.png`, PNG.sync.write(out));
  console.log(name, cropW, cropH);
}
