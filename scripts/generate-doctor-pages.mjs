import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const templateHtml = readFileSync(path.join(distDir, "index.html"), "utf-8");
const doctors = JSON.parse(
  readFileSync(path.join(rootDir, "src", "data", "doctors.json"), "utf-8")
);

function escapeHtmlAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

for (const doctor of doctors) {
  const pageTitle = `${doctor.name} | ${doctor.role} | دندانپزشکی نن‌دخدون`;
  const description = escapeHtmlAttr(doctor.seoDescription);

  let html = templateHtml.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtmlAttr(pageTitle)}</title>`
  );

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`
  );

  const doctorDir = path.join(distDir, "doctors", doctor.slug);
  mkdirSync(doctorDir, { recursive: true });
  writeFileSync(path.join(doctorDir, "index.html"), html, "utf-8");
}

console.log(`Generated ${doctors.length} static doctor pages in dist/doctors/`);
