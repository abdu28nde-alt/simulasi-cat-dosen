/* Memeriksa sintaks skrip utama di index.html dan seluruh berkas soal. */
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
inline.forEach((src, i) => { new Function(src); });
[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].forEach(m => new Function(fs.readFileSync(path.join(root, m[1]), "utf8")));
console.log("sintaks OK:", inline.length, "skrip inline");
