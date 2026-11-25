/* Service worker Simulasi CAT Dosen — agar dapat dipasang dan dipakai offline.
   Strategi: berkas aplikasi disimpan saat pemasangan; permintaan berikutnya disajikan dari cache
   lalu diperbarui di latar belakang (stale-while-revalidate). Naikkan VERSI setiap rilis. */
const VERSI = "cat-dosen-v2026-11-26";
const INTI = [
  "./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png",
  "soal/soal.js", "soal/generator.js", "soal/soal-twk.js", "soal/soal-tiu.js", "soal/soal-tkp.js", "soal/soal-skb.js",
  "soal/soal-twk2.js", "soal/soal-tkp2.js", "soal/soal-skb-etika2.js", "soal/soal-skb-ing2.js", "soal/soal-skb-psi2.js",
  "soal/soal-moderasi.js", "soal/soal-dakwah-komunikasi.js", "soal/perbaikan-mutu.js",
  "soal/materi.js", "soal/materi-kemenag-fdk.js", "soal/noncat-fdk.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(INTI)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin, font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !font) return;
  e.respondWith(caches.open(VERSI).then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: sameOrigin });
    const jaringan = fetch(req).then(res => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; }).catch(() => cached);
    return cached || jaringan;
  }));
});
