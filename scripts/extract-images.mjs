import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const html = readFileSync(join(root, 'portfolio.html'), 'utf8');
mkdirSync(join(root, 'public/images'), { recursive: true });

// Each card has 2 images (front + back-blur, same source).
// Extract all base64 data URIs in document order.
const regex = /src="data:image\/([^;]+);base64,([A-Za-z0-9+/=\r\n]+?)"/g;
const all = [];
let m;
while ((m = regex.exec(html)) !== null) {
  all.push({ ext: m[1], data: m[2].replace(/\s/g, '') });
}

// Take every other image (index 0, 2, 4 … = the card-front images)
const fronts = all.filter((_, i) => i % 2 === 0);

const filenames = [
  'Crippled.webp', 'Hekate.webp', 'KikagakuFramed.webp', 'SuspendedJPG.webp', 'tmtShirt.jpg',
  'EverCosmic.webp', 'IMG_0668.webp', 'LetitBe.webp', 'Threads.webp', 'KeepGrading.jpg',
  'Floater.webp', 'IMG_1039.webp', 'Primo.webp', 'tmtNewsprint.webp', 'AA.png',
];

fronts.forEach(({ data }, i) => {
  const name = filenames[i];
  if (!name) return;
  const buf = Buffer.from(data, 'base64');
  writeFileSync(join(root, 'public/images', name), buf);
  console.log(`✓ ${name} (${(buf.length / 1024).toFixed(0)} KB)`);
});
console.log(`Done — ${fronts.length} images extracted.`);
