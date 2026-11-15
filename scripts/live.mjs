/* Live panels: stats.svg (stars, repos, forks, followers, top languages) and
   streak.svg (total contributions, current + longest streak).
   Runs on a schedule in GitHub Actions (GITHUB_TOKEN is provided there).
   No dependencies — Node 20+ fetch only. On any API failure the existing
   SVG is left untouched rather than overwritten with bad numbers. */

import fs from "node:fs";

const USER = "parthpawarsnap11-create";
const TOKEN = process.env.GITHUB_TOKEN;

const PAPER = "#f7e7c8", P_EDGE = "#e6c78f", FLAME = "#e8451c", INK = "#16305e";
const INK_D = "#0d2148", INK_S = "#45568a", INK_F = "#8794b4";
const LANG = [FLAME, INK, "#c8390f", INK_S, "#f5411a"];
const MONO = "font-family=\"'SFMono-Regular','SF Mono',Menlo,Consolas,'Liberation Mono',monospace\"";

const headers = { "User-Agent": "profile-readme", Accept: "application/vnd.github+json", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) };

async function rest(path) {
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

async function graphql(query, variables) {
  if (!TOKEN) throw new Error("GITHUB_TOKEN is required for contribution data");
  const r = await fetch("https://api.github.com/graphql", { method: "POST", headers, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (!r.ok || j.errors) throw new Error(JSON.stringify(j.errors ?? r.status));
  return j.data;
}

function frame(w, h, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<radialGradient id="fl" cx="92%" cy="8%" r="70%"><stop offset="0%" stop-color="${FLAME}" stop-opacity="0.16"/><stop offset="60%" stop-color="${FLAME}" stop-opacity="0"/></radialGradient>
<radialGradient id="in" cx="4%" cy="96%" r="72%"><stop offset="0%" stop-color="${INK}" stop-opacity="0.12"/><stop offset="64%" stop-color="${INK}" stop-opacity="0"/></radialGradient>
<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="saturate" values="0"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="${PAPER}"/><rect width="${w}" height="${h}" fill="url(#fl)"/><rect width="${w}" height="${h}" fill="url(#in)"/>
<rect width="${w}" height="${h}" filter="url(#gr)" opacity="0.22" style="mix-blend-mode:multiply"/>
<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" fill="none" stroke="${INK}" stroke-opacity="0.14" stroke-width="1.5"/>
<g ${MONO}>${inner}</g>
</svg>`;
}

const snow = `<g transform="translate(28,30) scale(0.72)" fill="none" stroke="${FLAME}" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5 L12 21.5 M3.77 7.25 L20.23 16.75 M20.23 7.25 L3.77 16.75 M12 2.5 l-1.9 2 M12 2.5 l1.9 2 M12 21.5 l-1.9 -2 M12 21.5 l1.9 -2 M20.23 7.25 l-2.7 -0.3 M20.23 7.25 l-0.3 2.7 M3.77 16.75 l2.7 0.3 M3.77 16.75 l0.3 -2.7 M3.77 7.25 l2.7 -0.3 M3.77 7.25 l0.3 2.7 M20.23 16.75 l-2.7 0.3 M20.23 16.75 l-0.3 -2.7"/></g>`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function stats() {
  const user = await rest(`/users/${USER}`);
  const repos = (await rest(`/users/${USER}/repos?per_page=100`)).filter((r) => !r.fork);
  const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const forks = repos.reduce((a, r) => a + r.forks_count, 0);
  const langs = {};
  for (const r of repos) if (r.language) langs[r.language] = (langs[r.language] ?? 0) + 1;
  const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = top.reduce((a, [, c]) => a + c, 0) || 1;

  let left = "";
  [["Total stars", stars], ["Public repos", user.public_repos], ["Total forks", forks], ["Followers", user.followers]].forEach(([label, v], i) => {
    const y = 84 + i * 33;
    left += `<circle cx="30" cy="${y - 6}" r="3" fill="${FLAME}"/><text x="44" y="${y}" fill="${INK_S}" font-size="13.5">${label}</text><text x="250" y="${y}" fill="${INK_D}" font-size="21" font-weight="600" text-anchor="end">${v}</text>`;
  });
  let right = "";
  top.forEach(([lang, c], i) => {
    const pct = (c / total) * 100, y = 86 + i * 26;
    right += `<text x="320" y="${y - 6}" fill="${INK}" font-size="12.5">${esc(lang)}</text><text x="560" y="${y - 6}" fill="${INK_F}" font-size="11" text-anchor="end">${pct.toFixed(0)}%</text>`
      + `<rect x="320" y="${y}" width="240" height="4" rx="2" fill="${P_EDGE}"/><rect x="320" y="${y}" width="${(240 * pct / 100).toFixed(1)}" height="4" rx="2" fill="${LANG[i % LANG.length]}"/>`;
  });
  const inner = `${snow}<text x="48" y="42" fill="${FLAME}" font-size="13" letter-spacing="2.4" font-weight="600">GITHUB · STATS</text>`
    + `<text x="320" y="60" fill="${INK_F}" font-size="12" letter-spacing="2">TOP LANGUAGES</text>${left}${right}`;
  fs.writeFileSync("stats.svg", frame(600, 210, inner));
  console.log(`stats.svg  stars=${stars} repos=${user.public_repos} forks=${forks} followers=${user.followers}`);
}

async function streak() {
  const data = await graphql(
    `query($login:String!){ user(login:$login){ createdAt contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount } } } } } }`,
    { login: USER },
  );
  const cal = data.user.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap((w) => w.contributionDays).sort((a, b) => a.date.localeCompare(b.date));
  const fmt = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });

  // longest
  let longest = 0, lStart = null, lEnd = null, run = 0, runStart = null;
  for (const d of days) {
    if (d.contributionCount > 0) {
      if (run === 0) runStart = d.date;
      run++;
      if (run > longest) { longest = run; lStart = runStart; lEnd = d.date; }
    } else run = 0;
  }
  // current: today may still be empty without breaking the streak
  let i = days.length - 1;
  if (i >= 0 && days[i].contributionCount === 0) i--;
  let current = 0, cEnd = i >= 0 ? days[i].date : null, cStart = cEnd;
  for (; i >= 0 && days[i].contributionCount > 0; i--) { current++; cStart = days[i].date; }

  const range = (a, b) => (a && b ? `${fmt(a)} – ${fmt(b)}` : "—");
  const col = (x, num, label, sub, numColor) =>
    `<text x="${x}" y="98" fill="${numColor}" font-size="34" font-weight="600" text-anchor="middle">${num}</text>`
    + `<text x="${x}" y="134" fill="${INK_S}" font-size="13" letter-spacing="2" text-anchor="middle">${label}</text>`
    + `<text x="${x}" y="158" fill="${INK_F}" font-size="11.5" text-anchor="middle">${sub}</text>`;
  const inner =
    `<line x1="200" y1="40" x2="200" y2="170" stroke="${INK}" stroke-opacity="0.15" stroke-width="1.5"/>`
    + `<line x1="400" y1="40" x2="400" y2="170" stroke="${INK}" stroke-opacity="0.15" stroke-width="1.5"/>`
    + col(100, cal.totalContributions, "TOTAL CONTRIBUTIONS", "last 12 months", INK_D)
    + `<circle cx="300" cy="86" r="44" fill="none" stroke="${FLAME}" stroke-width="5"/>`
    + `<text x="300" y="98" fill="${FLAME}" font-size="34" font-weight="600" text-anchor="middle">${current}</text>`
    + `<text x="300" y="158" fill="${INK_S}" font-size="13" letter-spacing="2" text-anchor="middle">CURRENT STREAK</text>`
    + `<text x="300" y="180" fill="${INK_F}" font-size="11.5" text-anchor="middle">${current ? range(cStart, cEnd) : "start one today"}</text>`
    + col(500, longest, "LONGEST STREAK", range(lStart, lEnd), INK_D);
  fs.writeFileSync("streak.svg", frame(600, 210, inner));
  console.log(`streak.svg total=${cal.totalContributions} current=${current} longest=${longest}`);
}

let failed = false;
for (const job of [stats, streak]) {
  try { await job(); } catch (e) { failed = true; console.error(`${job.name} failed: ${e.message}`); }
}
if (failed) process.exitCode = 1;
