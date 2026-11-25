/* Membuat ikon PNG aplikasi (tanpa dependensi): latar navy, lingkaran oranye, tanda centang putih.
   Jalankan: node tools/buat-ikon.cjs */
const fs = require("fs"), zlib = require("zlib"), path = require("path");
const NAVY = [29, 59, 99], ORANGE = [247, 148, 29], WHITE = [255, 255, 255];
function crc32(buf) { let c, crc = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, c]); }
function distSeg(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - ax - t * dx, py - ay - t * dy); }
function ikon(size, maskable) {
  const raw = Buffer.alloc((size * 4 + 1) * size), c = size / 2, r = size * (maskable ? 0.30 : 0.42), w = size * (maskable ? 0.045 : 0.06);
  const A = [c - r * 0.45, c + r * 0.02], B = [c - r * 0.1, c + r * 0.38], C = [c + r * 0.5, c - r * 0.35];
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const px = x + 0.5, py = y + 0.5, d = Math.hypot(px - c, py - c);
      let col = NAVY;
      if (d <= r) col = ORANGE;
      if (d <= r && Math.min(distSeg(px, py, A[0], A[1], B[0], B[1]), distSeg(px, py, B[0], B[1], C[0], C[1])) <= w) col = WHITE;
      const o = y * (size * 4 + 1) + 1 + x * 4; raw[o] = col[0]; raw[o + 1] = col[1]; raw[o + 2] = col[2]; raw[o + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
const root = path.join(__dirname, "..");
fs.writeFileSync(path.join(root, "icon-192.png"), ikon(192));
fs.writeFileSync(path.join(root, "icon-512.png"), ikon(512));
fs.writeFileSync(path.join(root, "icon-maskable-512.png"), ikon(512, true));
console.log("ikon dibuat");
