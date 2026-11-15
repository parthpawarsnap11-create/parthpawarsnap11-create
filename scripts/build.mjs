/* Builds every static README panel in ./assets as a self-contained SVG.
   All text is converted to vector paths (fonts baked in), so the panels
   render identically on GitHub, mobile, and dark mode.

   Run:  npm install && npm run build
   Edit the CONTENT block below; nothing else needs to change. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "assets");
fs.mkdirSync(out, { recursive: true });

/* ------------------------------------------------------------------ CONTENT */
const PORTFOLIO = "https://portfolio-chi-inky-84.vercel.app";
const GITHUB = "https://github.com/parthpawarsnap11-create";

const C = {
  eyebrow: ["ENGINEER", "BUILDER", "ENTREPRENEUR"],
  first: "Parth",
  last: "Pawar",
  tagline:
    "I build intelligent products and turn ideas into impact — machine learning, practical products, and technology that solves real problems.",
  role: "AI/ML engineering student",

  aboutHead: "I turn ideas into impact.",
  about: [
    "I like understanding the problem before reaching for a tool. Then I build, test, learn from what breaks, and keep improving — across machine learning, HCI research, and engineering.",
    "I co-founded FundNexus, run operations for a campus D2C venture, and invented AdvanceMask, which represented India at Jigyasa 2022.",
  ],
  currently: [
    { role: "Co-Founder & CMO", org: "FundNexus Pvt. Ltd.", when: "2025 – now" },
    { role: "Head of Operations", org: "D2C Operations", when: "2025 – now" },
    { role: "Inventor", org: "AdvanceMask", when: "2020 – now" },
    { role: "Based in", org: "Pune, India", when: "" },
  ],

  workHead: "Systems I built.",
  workSub: "Machine learning, HCI research, security, and engineering — each card links to its source.",

  projects: [
    {
      slug: "eeg",
      kind: "MACHINE LEARNING · RESEARCH",
      year: "2025–26",
      name: "EEG Data Analysis",
      blurb: "Agglomerative hierarchical clustering from scratch on the Bangalore EEG Epilepsy Dataset, explained by a decision-tree surrogate.",
      chips: ["Python", "NumPy", "Clustering"],
      cta: "View on GitHub",
    },
    {
      slug: "campusfix",
      kind: "HCI · UX RESEARCH",
      year: "2025–26",
      name: "CampusFix",
      blurb: "Hostel complaints understood from the student's side, then shaped into a clear information architecture.",
      chips: ["HCI research", "Information architecture", "UX"],
      cta: "View repository",
    },
    {
      slug: "totp",
      kind: "SECURITY · PYTHON",
      year: "2025–26",
      name: "TOTP Authenticator",
      blurb: "A command-line project generating time-based one-time passwords with RFC 6238, inspired by familiar 2FA apps.",
      chips: ["Python", "TOTP", "RFC 6238"],
      cta: "View on GitHub",
    },
    {
      slug: "libraiq",
      kind: "MACHINE LEARNING · STREAMLIT",
      year: "2025–26",
      name: "LibraIQ",
      blurb: "A demand classifier for university library books — compares models and serves High, Medium, or Low predictions.",
      chips: ["Scikit-learn", "Pandas", "Streamlit"],
      cta: "View repository",
    },
    {
      slug: "advancemask",
      kind: "ENGINEERING · INNOVATION",
      year: "2020",
      name: "AdvanceMask",
      blurb: "A protective mask with a brushless motor and filtration system. Patent filed; 2nd internationally at Jigyasa 2022.",
      chips: ["Product design", "Engineering", "Filtration"],
      cta: "View on GitHub",
    },
    {
      slug: "more",
      kind: "OPEN SOURCE",
      year: "",
      name: "More on GitHub",
      blurb: "Experiments, event sites, and coursework — everything else I've been building lives in my repositories.",
      chips: ["Python", "HTML", "Design"],
      cta: "Browse repositories",
    },
  ],

  moreHead: "Ventures & experiments.",
  more: [
    { name: "FundNexus", blurb: "Startup–investor platform: 60+ startups and 30+ investors." },
    { name: "Campus D2C", blurb: "Direct-to-room delivery: 100+ orders a month, 100% fulfilment." },
    { name: "Website Security Auditor", blurb: "A Python auditor for website security." },
    { name: "Smart Study Planner", blurb: "A planner for students to analyse their academics." },
    { name: "FundNexus Event", blurb: "Event site built for FundNexus." },
    { name: "Portfolio", blurb: "A risograph portfolio built with Next.js and Motion." },
  ],

  stackHead: "The toolkit.",
  stackSub: "Skills grow through practice — here's what I've been learning and applying.",
  stack: [
    { group: "Programming & data", note: "working with information", items: ["Python", "Pandas", "NumPy", "Data analysis"] },
    { group: "Machine learning", note: "modeling and evaluation", items: ["Scikit-learn", "Classification", "Clustering", "Model evaluation", "Predictive analytics"] },
    { group: "Development", note: "building and sharing", items: ["Streamlit", "Git", "GitHub", "Jupyter Notebook"] },
    { group: "Product & UX", note: "learning from people", items: ["User research", "Information architecture", "Usability testing", "Product research"] },
  ],

  contactHead: "Let's build something meaningful.",
  contactSub: "Always up for thoughtful projects, new ideas, and conversations about what's next.",
  email: "parthpawarsnap11@gmail.com",
  location: "Pune, India",

  buttons: [
    { file: "btn_portfolio", label: "Portfolio" },
    { file: "btn_linkedin", label: "LinkedIn" },
    { file: "btn_instagram", label: "Instagram" },
    { file: "btn_email", label: "Email" },
  ],
};

/* ------------------------------------------------------------------ PALETTE */
const PAPER = "#f7e7c8";
const P_EDGE = "#e6c78f";
const CHIP = "#f3d9a4";
const FLAME = "#e8451c";
const INK = "#16305e";
const INK_D = "#0d2148";
const INK_S = "#45568a";
const INK_F = "#8794b4";

/* -------------------------------------------------------------------- FONTS */
const toAB = (f) => { const b = fs.readFileSync(path.join(here, "fonts", f)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const load = (f) => opentype.parse(toAB(f));
const F = {
  d700: load("bricolage-grotesque-latin-700-normal.woff"),
  d800: load("bricolage-grotesque-latin-800-normal.woff"),
  s400: load("Geist-Regular.ttf"),
  s500: load("Geist-Medium.ttf"),
  s600: load("Geist-SemiBold.ttf"),
  m400: load("GeistMono-Regular.ttf"),
  m500: load("GeistMono-Medium.ttf"),
  m600: load("GeistMono-SemiBold.ttf"),
};

function width(s, f, size, ls = 0) {
  return f.getAdvanceWidth(s, size, { kerning: true }) + ls * Math.max(0, [...s].length - 1);
}

/* Text → one <path>. anchor: start | middle | end. */
function T(s, f, size, x, y, { fill = INK, ls = 0, anchor = "start", opacity } = {}) {
  const w = width(s, f, size, ls);
  let cx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  let d = "";
  if (!ls) {
    d = f.getPath(s, cx, y, size, { kerning: true }).toPathData(2);
  } else {
    for (const ch of s) {
      d += f.getPath(ch, cx, y, size).toPathData(2);
      cx += f.getAdvanceWidth(ch, size) + ls;
    }
  }
  const op = opacity != null ? ` fill-opacity="${opacity}"` : "";
  return `<path d="${d}" fill="${fill}"${op}/>`;
}

function wrap(s, f, size, maxW) {
  const words = s.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (width(test, f, size) > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function para(s, f, size, x, y, maxW, lh, opts) {
  const lines = wrap(s, f, size, maxW);
  return { svg: lines.map((l, i) => T(l, f, size, x, y + i * lh, opts)).join(""), h: lines.length * lh, lines: lines.length };
}

/* ------------------------------------------------------------- PRIMITIVES */
let uid = 0;
function bg(w, h, { flame = [88, 6], ink = [6, 96], halftone = null, border = false } = {}) {
  const id = `p${uid++}`;
  return {
    defs: `<radialGradient id="f${id}" cx="${flame[0]}%" cy="${flame[1]}%" r="62%"><stop offset="0%" stop-color="${FLAME}" stop-opacity="0.20"/><stop offset="62%" stop-color="${FLAME}" stop-opacity="0"/></radialGradient>
<radialGradient id="i${id}" cx="${ink[0]}%" cy="${ink[1]}%" r="70%"><stop offset="0%" stop-color="${INK}" stop-opacity="0.16"/><stop offset="66%" stop-color="${INK}" stop-opacity="0"/></radialGradient>
<filter id="g${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="saturate" values="0"/></filter>
<pattern id="h${id}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.9" fill="${FLAME}"/></pattern>`,
    body: `<rect width="${w}" height="${h}" fill="${PAPER}"/><rect width="${w}" height="${h}" fill="url(#f${id})"/><rect width="${w}" height="${h}" fill="url(#i${id})"/>${
      halftone ? `<rect x="${halftone[0]}" y="${halftone[1]}" width="${halftone[2]}" height="${halftone[3]}" fill="url(#h${id})" opacity="0.5"/>` : ""
    }<rect width="${w}" height="${h}" filter="url(#g${id})" opacity="0.225" style="mix-blend-mode:multiply"/>${
      border ? `<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" fill="none" stroke="${INK}" stroke-opacity="0.14" stroke-width="1.5"/>` : ""
    }`,
  };
}

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function svg(w, h, defs, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}"><defs>${defs}</defs>${body}</svg>`;
}

function snowflake(x, y, size, color = FLAME, sw = 1.7) {
  const s = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"><path d="M12 2.5 L12 21.5 M3.77 7.25 L20.23 16.75 M20.23 7.25 L3.77 16.75 M12 2.5 l-1.9 2 M12 2.5 l1.9 2 M12 21.5 l-1.9 -2 M12 21.5 l1.9 -2 M20.23 7.25 l-2.7 -0.3 M20.23 7.25 l-0.3 2.7 M3.77 16.75 l2.7 0.3 M3.77 16.75 l0.3 -2.7 M3.77 7.25 l2.7 -0.3 M3.77 7.25 l0.3 2.7 M20.23 16.75 l-2.7 0.3 M20.23 16.75 l-0.3 -2.7"/></g>`;
}

/* "01  /  ABOUT" section label */
function kicker(n, label, x, y) {
  return T(n, F.m600, 13, x, y, { fill: FLAME, ls: 2 }) + T("/", F.m400, 13, x + 38, y, { fill: INK_F }) + T(label, F.m400, 13, x + 65, y, { fill: INK_F, ls: 2.4 });
}

function chip(label, x, y, { h = 26, size = 12.5, fill = CHIP, stroke = P_EDGE } = {}) {
  const w = width(label, F.m400, size) + 26;
  return {
    w,
    svg: `<rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>` + T(label, F.m400, size, x + 13, y + h / 2 + size * 0.36, { fill: INK }),
  };
}

function chipRow(items, x, y, maxW, opts = {}) {
  let cx = x, cy = y, s = "";
  const gap = 8, rowH = (opts.h ?? 26) + 9;
  for (const it of items) {
    const c = chip(it, 0, 0, opts);
    if (cx + c.w > x + maxW && cx > x) { cx = x; cy += rowH; }
    s += chip(it, cx, cy, opts).svg;
    cx += c.w + gap;
  }
  return { svg: s, h: cy - y + rowH };
}

function arrow(x, y, color) {
  return `<path d="M${x} ${y} h11 M${x + 6} ${y - 5} l5 5 l-5 5" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function write(name, content) {
  fs.writeFileSync(path.join(out, `${name}.svg`), content);
  console.log(`${name}.svg  ${(content.length / 1024).toFixed(0)} KB`);
}

/* ------------------------------------------------------------------- HERO */
async function portraitRects(x0, y0, w, h, cell = 5) {
  const src = path.join(here, "portrait.png");
  const meta = await sharp(src).metadata();
  const cropTop = Math.round(meta.height * 0.2);
  const cropH = meta.height - cropTop;
  const scale = h / cropH;
  const W = Math.round(meta.width * scale);
  const { data } = await sharp(src)
    .extract({ left: 0, top: cropTop, width: meta.width, height: cropH })
    .resize(W, h)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = 3;
  let s = "";
  const left = x0 + w - W;
  for (let y = 0; y + cell <= h; y += cell) {
    for (let x = 0; x + cell <= W; x += cell) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let yy = y; yy < y + cell; yy++) for (let xx = x; xx < x + cell; xx++) {
        const i = (yy * W + xx) * ch; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
      r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      if (lum > 185 && sat < 0.45) continue; // cream paper keyed out
      // a light, deterministic dropout keeps the grain feel of the site
      if ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 100 < 6) continue;
      const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      s += `<rect x="${(left + x + 0.4).toFixed(1)}" y="${(y0 + y + 0.4).toFixed(1)}" width="4.1" height="4.1" fill="${hex}"/>`;
    }
  }
  return s;
}

async function hero() {
  const w = 1200, h = 470;
  const b = bg(w, h, { flame: [88, 6], ink: [6, 96], halftone: [1050, 320, 150, 150] });
  let s = b.body;
  s += await portraitRects(800, 0, 400, h);
  // eyebrow
  s += snowflake(76, 66, 24);
  let ex = 110;
  C.eyebrow.forEach((word, i) => {
    s += T(word, F.m500, 15, ex, 86, { fill: FLAME, ls: 3 });
    ex += width(word, F.m500, 15, 3) + 12;
    if (i < C.eyebrow.length - 1) { s += `<circle cx="${ex}" cy="81" r="2.4" fill="${FLAME}"/>`; ex += 14; }
  });
  // name, with a riso misregistration echo
  const size = 112;
  s += T(C.first, F.d800, size, 79, 229, { fill: FLAME, opacity: 0.35 });
  s += T(C.first, F.d800, size, 74, 224, { fill: INK_D });
  s += T(C.last, F.d800, size, 79, 329, { fill: INK, opacity: 0.22 });
  s += T(C.last, F.d800, size, 74, 324, { fill: FLAME });
  // tagline + role
  s += para(C.tagline, F.s400, 19, 74, 376, 640, 29, { fill: INK_S }).svg;
  s += `<rect x="74" y="439" width="52" height="4" rx="2" fill="${FLAME}"/>`;
  s += T(C.role, F.s500, 16, 142, 447, { fill: INK_D });
  write("hero", svg(w, h, b.defs, s, `${C.first} ${C.last} — ${C.role}. ${C.tagline}`));
}

/* ------------------------------------------------------------------ ABOUT */
function about() {
  const w = 1200, h = 344;
  const b = bg(w, h, { flame: [96, 4], ink: [4, 100] });
  let s = b.body;
  s += kicker("01", "ABOUT", 74, 68);
  s += T(C.aboutHead, F.d700, 40, 72, 122, { fill: INK_D });
  let y = 163;
  for (const p of C.about) {
    const r = para(p, F.s400, 16.5, 74, y, 660, 25, { fill: INK_S });
    s += r.svg; y += r.h + 16;
  }
  // currently
  s += `<line x1="778" y1="60" x2="778" y2="292" stroke="${INK}" stroke-opacity="0.15" stroke-width="1.5"/>`;
  s += T("CURRENTLY", F.m500, 12.5, 812, 70, { fill: FLAME, ls: 3 });
  C.currently.forEach((c, i) => {
    const cy = 108 + i * 58;
    s += T(c.role, F.s600, 16, 812, cy, { fill: INK_D });
    s += T(c.org, F.s400, 14.5, 812, cy + 22, { fill: INK_S });
    if (c.when) s += T(c.when, F.m400, 12, 1142, cy, { fill: INK_F, anchor: "end" });
  });
  write("about", svg(w, h, b.defs, s, `About — ${C.aboutHead} ${C.about.join(" ")}`));
}

/* --------------------------------------------------------------- SECTIONS */
function sectionHead(name, n, label, head, sub, h = 158) {
  const w = 1200;
  const b = bg(w, h, { flame: [86, 0], ink: [2, 100] });
  let s = b.body;
  s += kicker(n, label, 74, 62);
  s += T(head, F.d700, 40, 72, 112, { fill: INK_D });
  s += T(sub, F.s400, 16, 74, 141, { fill: INK_S });
  s += snowflake(1078, 54, 34, FLAME, 1.8);
  write(name, svg(w, h, b.defs, s, `${head} ${sub}`));
}

/* ---------------------------------------------------------------- CARDS */
function card(p, i) {
  const w = 592, h = 298;
  const corners = [[4, 4], [92, 6], [8, 96], [94, 92]];
  const b = bg(w, h, { flame: corners[i % 4], ink: corners[(i + 2) % 4], border: true });
  let s = b.body;
  s += `<rect x="${w - 96}" y="0" width="96" height="7" fill="${i % 2 ? FLAME : INK}"/>`;
  s += T(p.kind, F.m500, 12.5, 34, 52, { fill: FLAME, ls: 2.2 });
  if (p.year) s += T(p.year, F.m400, 12.5, w - 34, 52, { fill: INK_F, anchor: "end" });
  s += T(p.name, F.d700, 34, 33, 98, { fill: INK_D });
  s += para(p.blurb, F.s400, 15.5, 34, 133, w - 76, 23.5, { fill: INK_S }).svg;
  s += chipRow(p.chips, 34, 196, w - 68).svg;
  s += T(p.cta, F.s500, 15.5, 34, 271, { fill: INK_D });
  s += arrow(34 + width(p.cta, F.s500, 15.5) + 12, 266, i % 2 ? FLAME : INK_D);
  write(`proj_${p.slug}`, svg(w, h, b.defs, s, `${p.name} — ${p.kind.toLowerCase()}. ${p.blurb}`));
}

/* --------------------------------------------------------------- ALSO BUILT */
function more() {
  const w = 1200, h = 300;
  const b = bg(w, h, { flame: [96, 100], ink: [2, 100] });
  let s = b.body;
  s += kicker("03", "ALSO BUILT", 74, 60);
  s += T(C.moreHead, F.d700, 40, 72, 106, { fill: INK_D });
  C.more.forEach((m, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = col ? 620 : 74, y = 150 + row * 50;
    s += `<circle cx="${x + 4}" cy="${y - 5}" r="3.4" fill="${FLAME}"/>`;
    s += T(m.name, F.s600, 16.5, x + 18, y, { fill: INK_D });
    s += T(m.blurb, F.s400, 14, x + 18, y + 21, { fill: INK_S });
  });
  write("more", svg(w, h, b.defs, s, `Also built — ${C.more.map((m) => m.name).join(", ")}.`));
}

/* -------------------------------------------------------------------- STACK */
function stack() {
  const w = 1200;
  const colW = 500;
  // lay out first to know the height
  const cols = [[], []];
  C.stack.forEach((g, i) => cols[i % 2].push(g));
  const parts = [];
  let maxY = 0;
  cols.forEach((groups, ci) => {
    const x = ci ? 630 : 74;
    let y = 196;
    for (const g of groups) {
      let p = T(g.group, F.s600, 19, x, y, { fill: INK_D });
      p += T(g.note, F.m400, 12.5, x, y + 22, { fill: FLAME, ls: 0.6 });
      const row = chipRow(g.items, x, y + 38, colW, { h: 28, size: 13, fill: "none", stroke: P_EDGE });
      p += row.svg;
      parts.push(p);
      y += 38 + row.h + 30;
    }
    maxY = Math.max(maxY, y);
  });
  const h = Math.round(maxY);
  const b = bg(w, h, { flame: [90, 0], ink: [0, 100], halftone: [1050, 44, 108, 108] });
  let s = b.body;
  s += kicker("04", "STACK", 74, 62);
  s += T(C.stackHead, F.d700, 40, 72, 112, { fill: INK_D });
  s += T(C.stackSub, F.s400, 16, 74, 141, { fill: INK_S });
  s += parts.join("");
  write("stack", svg(w, h, b.defs, s, `Stack — ${C.stack.map((g) => `${g.group}: ${g.items.join(", ")}`).join("; ")}.`));
}

/* ------------------------------------------------------------------ CONTACT */
function contact() {
  const w = 1200, h = 272;
  const b = bg(w, h, { flame: [8, 0], ink: [2, 100] });
  let s = b.body;
  s += kicker("05", "CONTACT", 74, 62);
  s += T(C.contactHead, F.d700, 40, 72, 118, { fill: INK_D });
  s += T(C.contactSub, F.s400, 16, 74, 157, { fill: INK_S });
  s += T(C.email, F.s600, 24, 74, 210, { fill: FLAME });
  s += T(C.location, F.m400, 13, 74, 240, { fill: INK_F, ls: 1.4 });
  s += snowflake(1078, 54, 34, FLAME, 1.8);
  s += `<path d="M840 200 C 880 170 920 170 960 200 S 1040 230 1080 200 S 1160 170 1176 190" fill="none" stroke="${FLAME}" stroke-opacity="0.7" stroke-width="2.5" stroke-linecap="round"/>`;
  write("contact", svg(w, h, b.defs, s, `Contact — ${C.contactHead} ${C.email}, ${C.location}.`));
}

/* ------------------------------------------------------------------ BUTTONS */
function buttons() {
  for (const btn of C.buttons) {
    const tw = width(btn.label, F.s600, 17);
    const w = Math.round(tw + 82), h = 54;
    const s = `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${(h - 2) / 2}" fill="${PAPER}" stroke="${INK}" stroke-opacity="0.18" stroke-width="1.5"/>`
      + `<circle cx="28" cy="${h / 2}" r="5" fill="${FLAME}"/>`
      + T(btn.label, F.s600, 17, 44, h / 2 + 6, { fill: INK_D })
      + arrow(44 + tw + 9, h / 2 - 1, FLAME).replace('stroke-width="2"', 'stroke-width="1.8"');
    write(btn.file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(btn.label)}">${s}</svg>`);
  }
}

await hero();
about();
sectionHead("work_head", "02", "SELECTED WORK", C.workHead, C.workSub);
C.projects.forEach(card);
more();
stack();
contact();
buttons();
console.log(`\nPortfolio: ${PORTFOLIO}\nGitHub: ${GITHUB}`);
