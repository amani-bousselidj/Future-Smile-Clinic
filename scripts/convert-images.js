const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convert() {
  const root = path.resolve(__dirname, '..', 'public', 'images');
  const targets = ['background.png', 'tooth.png', 'clinic-hero.png'];

  for (const name of targets) {
    const src = path.join(root, name);
    if (!fs.existsSync(src)) {
      console.warn(`skip, missing: ${name}`);
      continue;
    }

    const outName = name.replace(/\.png$/i, '.webp');
    const out = path.join(root, outName);

    try {
      await sharp(src)
        .webp({ quality: 80, effort: 6 })
        .toFile(out);
      console.log(`converted ${name} → ${outName}`);
    } catch (err) {
      console.error(`failed ${name}:`, err.message || err);
    }
  }
}

convert().catch((e) => { console.error(e); process.exit(1); });
