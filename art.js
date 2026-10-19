'use strict';
/* Race Passport artwork — city landmarks, passport stamps, badge emblems, PB crown.
   Everything is plain SVG built from strings, so it works offline and on any phone. */
(function (W) {
const r2 = n => Math.round(n * 100) / 100;
const escX = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hashS = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const circ = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
const poly = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'z';
const regular = (cx, cy, r, n, rot = -Math.PI / 2) => Array.from({ length: n }, (_, i) => [cx + Math.cos(rot + i * 2 * Math.PI / n) * r, cy + Math.sin(rot + i * 2 * Math.PI / n) * r]);
const starPts = (cx, cy, ro, ri, n, rot = -Math.PI / 2) => Array.from({ length: n * 2 }, (_, i) => { const a = rot + i * Math.PI / n, rr = i % 2 ? ri : ro; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; });
const crownD = (x, y, s) => { const p = [[0, 10], [0, 3], [3.2, 6], [6, 0], [8.8, 6], [12, 3], [12, 10]].map(([a, b]) => [x + a * s, y + b * s]); return poly(p); };
function gearD(cx, cy, r, teeth) {
  const pts = []; const ri = r * .78;
  for (let i = 0; i < teeth * 4; i++) { const a = i / (teeth * 4) * Math.PI * 2; const rr = (i % 4 === 0 || i % 4 === 1) ? r : ri; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  return poly(pts) + circ(cx, cy, r * .32);
}
function leafArc(cx, cy, rad, a0, a1, n, size, flip) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = a0 + (a1 - a0) * (i + .5) / n, x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
    const t = a + (flip ? -1 : 1) * Math.PI / 2 * .75, l = size, w = size * .42;
    const tx = x + Math.cos(t) * l, ty = y + Math.sin(t) * l, nx = Math.cos(t + Math.PI / 2) * w, ny = Math.sin(t + Math.PI / 2) * w;
    const mx = (x + tx) / 2, my = (y + ty) / 2;
    d += `M${r2(x)} ${r2(y)}Q${r2(mx + nx)} ${r2(my + ny)} ${r2(tx)} ${r2(ty)}Q${r2(mx - nx)} ${r2(my - ny)} ${r2(x)} ${r2(y)}z`;
  }
  return d;
}
const arches = (x0, y, w, h, n, gap) => { let d = ''; for (let i = 0; i < n; i++) { const x = x0 + i * (w + gap); d += `M${x} ${y}v${-h + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}`; } return d; };
const WAVES = (y, x0 = 2, x1 = 46, a = 2) => { let d = `M${x0} ${y}`; for (let x = x0; x < x1; x += 8) d += `c3 -${a} 5 -${a} 8 0`; return d; };

/* ---------- Landmarks (48×48 drawings). Item: ['s',d] stroke · ['f',d] fill · ['w',d,width] · ['t',x,y,size,text] ---------- */
const LM = {
  gediminas: { n: 'GEDIMINAS TOWER', g: [['s', 'M3 44c6-8 13-11 21-11s15 3 21 11M2 44h44'], ['s', 'M18 34V18h12v16M16.5 18v-4h3v2h3v-2h3v2h3v-2h3v4z'], ['f', 'M21 22h2.2v3.5H21zM24.8 22H27v3.5h-2.2z'], ['s', 'M22 34v-3a2 2 0 0 1 4 0v3M24 14V4'], ['f', 'M24 4h8v1.8h-8zM24 5.8h8v1.8h-8z'], ['s', 'M24 7.6h8v1.8h-8z']] },
  kaunascastle: { n: 'KAUNAS CASTLE', g: [['s', 'M2 41h44M4 41V29h3v-2.5h2.5V29H12v-2.5h2.5V29H17v12'], ['s', 'M19 41V22h12v19'], ['f', 'M17.5 22 25 8.5 32.5 22z'], ['f', 'M23.5 27h3v4.5h-3z'], ['s', 'M22 41v-4a3 3 0 0 1 6 0v4M31 41V31h11v10M31 31v-2.5h2.7V31h2.7v-2.5h2.7V31H42v-2.5']] },
  meridianas: { n: 'MERIDIANAS', g: [['f', 'M5 32h38l-4.5 7.5h-29z'], ['s', 'M15 32V10M24 32V5M33 32V10M11 12h8v6h-8zM11 21h8v7h-8zM20 8h8v7h-8zM20 18h8v9h-8zM29 12h8v6h-8zM29 21h8v7h-8z'], ['f', 'M24 5l4.5 1.6L24 8.2z'], ['s', WAVES(44)]] },
  trakai: { n: 'ISLAND CASTLE', g: [['s', 'M2 34h44M21 34V13h8v21'], ['f', 'M20 13l5-7 5 7z'], ['s', 'M12 34V23h9M29 23h7v11M12 23v-2h2.2v2h2.2v-2h2.2v2H21M29 23v-2h2.3v2h2.3v-2h2.4v2'], ['s', 'M6 34V19h6v15M36 34V19h6v15'], ['f', 'M5.5 19 9 13.5l3.5 5.5zM35.5 19l3.5-5.5 3.5 5.5zM23.6 18h2.8v4h-2.8z'], ['s', 'M7 38h34M11 41.5h26M16 45h16']] },
  nemunas: { n: 'NEMUNAS LOOPS', g: [['w', 'M3 41c9 0 12-6 8-12s-2-13 7-13 11 7 7 13-2 13 7 13 11-5 13-9', 4.2], ['f', 'M32 18l4.5-10 4.5 10zM34 24l3.5-8 3.5 8zM5 20l3.5-8 3.5 8z'], ['s', 'M36.5 18v3M37.5 24v3M8.5 20v3']] },
  palangapier: { n: 'PALANGA PIER', g: [['s', 'M13 26a11 11 0 0 1 22 0M24 9v3M12.5 14l2 2M35.5 14l-2 2M2 26h44'], ['s', 'M20 46l2.5-20M28 46l-2.5-20M21 40h6M21.6 34.5h4.8M22.2 30h3.6'], ['s', 'M4 31h9M35 31h9M6 36h6M36 36h6']] },
  parnidis: { n: 'PARNIDIS DUNE', g: [['s', 'M2 42c10-10 22-15 44-13'], ['f', 'M26 32V11l2.5-3 2.5 3v21z'], ['s', 'M21 34.5h15M23.5 32h10'], ['s', circ(10, 13, 3.5) + 'M10 6v2M3 13h2M5 8l1.4 1.4']] },
  hillofcrosses: { n: 'HILL OF CROSSES', g: [['s', 'M2 44c9-9 35-9 44 0'], ['w', 'M24 33V14M20 18.5h8', 2.6], ['s', 'M14 35V24M11 27h6M34 35V25M31 28h6M19 37v-7M17 32h4M29 37v-7M27 32h4M8 40v-6M6.3 36h3.4M40 40v-6M38.3 36h3.4']] },
  stpeters: { n: "ST PETER'S", g: [['s', 'M10 45V31h28v14M10 31l14-7 14 7'], ['s', 'M20 31V21h8v10M20 21l4-3 4 3M21.5 18v-3h5v3'], ['f', 'M22.6 15 24 7.5l1.4 7.5z'], ['s', 'M24 7.5V3'], ['f', 'M23 3.2c1.2-1.4 3.6-.6 3.6 1.2H23z'], ['s', circ(24, 26, 1.6) + 'M14.5 36v5M33.5 36v5M22 45v-4h4v4']] },
  jurmala: { n: 'BALTIC SHORE', g: [['f', 'M6 27l4.5-11 4.5 11zM14 27l3.8-8.5 3.8 8.5z'], ['s', 'M10.5 27v3M17.8 27v3M2 30h20c7 0 12 3 24 3'], ['s', WAVES(38) + WAVES(44)], ['s', circ(38, 13, 3.5)]] },
  oldthomas: { n: 'OLD THOMAS', g: [['s', 'M3 44h42M5 44V33h38v11'], ['s', 'M7.5 33V21h6v12'], ['f', 'M6.5 21l4-8.5 4 8.5z'], ['s', 'M21 33V18h6v15'], ['f', 'M20.5 18 24 7.5l3.5 10.5z'], ['s', 'M24 7.5V3.5M22 5.2c1.2 1 2.8 1 4 0'], ['s', 'M34.5 33V23h6v10'], ['f', 'M33.5 23l4-7 4 7z'], ['s', 'M22 44v-4.5a2 2 0 0 1 4 0V44M10.5 25v3M24 23v3M37.5 27v3']] },
  umbrella: { n: 'KISSING STUDENTS', g: [['f', 'M8 21C8 12 15 7 24 7s16 5 16 14c-2.6-2-5.4-2-8 0-2.6-2-5.4-2-8 0-2.6-2-5.4-2-8 0-2.6-2-5.4-2-8 0z'], ['s', 'M24 7V4M24 21v8'], ['s', circ(20.5, 29, 2.3) + circ(27.5, 29, 2.3) + 'M20.5 31.5v6M27.5 31.5v6M20.5 37.5l-2 7M20.5 37.5l2 7M27.5 37.5l-2 7M27.5 37.5l2 7M20.5 33.5l3.5 1.5 3.5-1.5'], ['s', 'M6 45h36']] },
  flamingo: { n: 'SALT LAKE', g: [['f', 'M15 23c0-4.5 4.5-7 10-6s9 5 6 9-11 3-16-3z'], ['w', 'M30 19c2.5-3.5 2.5-7 0-10s-6.5-2.5-6.5 1', 2.6], ['f', 'M22 9.2c-.6 1.4.2 2.6 1.7 2.8l-1 2.6c-1.6-.8-2.4-3.2-.7-5.4z'], ['s', 'M24 26v15M24 32l4.5 3.5-1.5 2.5M9 42h31M13 45.5h23']] },
  amphora: { n: 'COMMANDARIA', g: [['s', 'M19.5 5h9M21 5v4c-5.5 3.5-8 9.5-7 16s4.5 12 10 15c5.5-3 9-8.5 10-15s-1.5-12.5-7-16V5'], ['s', 'M21 10c-5 0-6.5 6-3.5 8.5M27 10c5 0 6.5 6 3.5 8.5M15.5 24h17M16.5 29h15'], ['f', 'M17 26h14v1.6H17z'], ['s', 'M24 40v3M19 45h10']] },
  aphrodite: { n: "APHRODITE'S ROCK", g: [['f', 'M11 35c0-9 3.5-15.5 9-17.5s10 4.5 10 11l1 6.5zM31 35c0-3.5 2.4-7 5.5-7s4.5 3.5 4.5 7z'], ['s', 'M2 35h44' + WAVES(40) + WAVES(45.5)], ['s', circ(38, 11, 3.5)]] },
  venetianwalls: { n: 'VENETIAN WALLS', g: [['s', poly(starPts(24, 24, 20, 14.5, 11))], ['s', circ(24, 24, 9)], ['f', circ(24, 24, 2.6)], ['s', 'M24 15V9M24 33v6M15 24H9M33 24h6']] },
  parthenon: { n: 'ACROPOLIS', g: [['s', 'M3 43h42M5 40h38M5 17h38L24 8.5z'], ['f', 'M5 17h38v3.4H5z'], ['w', 'M8.5 20.5v19M13.6 20.5v19M18.8 20.5v19M24 20.5v19M29.2 20.5v19M34.4 20.5v19M39.5 20.5v19', 2.6]] },
  colosseum: { n: 'COLOSSEUM', g: [['s', 'M4 42V17c6-4.5 13-6 20-6s14 1.5 20 6v25'], ['s', 'M4 42h40M4 21.5c6-4 13-5 20-5s14 1 20 5M4 30h40'], ['s', arches(7, 42, 4.4, 9, 6, 1.6) + arches(7, 30, 4.4, 6.5, 6, 1.6)], ['s', 'M8 21v-2M14 19.5v-2M20 18.6v-2M28 18.6v-2M34 19.5v-2M40 21v-2']] },
  gondola: { n: 'GONDOLA', g: [['s', 'M4 34c9 4.5 30 4 40-4M44 30c.5-4-1.5-6.5-4-7M4 34c-1.2-3 0-5 2-6M42 25.5h3M42 28h3'], ['s', circ(24, 9, 2.4) + 'M24 11.5v12M24 23.5l-3.5 7M24 23.5l3.5 7M24 15l-4 3.5M24 15l8 4.5M32 19.5l4 15'], ['f', 'M21.2 6.8h5.6v1.2h-5.6z'], ['s', WAVES(43)]] },
  duomofi: { n: 'IL DUOMO', g: [['s', 'M9 34c0-12 6.5-18.5 15-18.5S39 22 39 34M24 15.5V34M17 18.5c-2.2 4.5-3 9.5-3 15.5M31 18.5c2.2 4.5 3 9.5 3 15.5'], ['s', 'M21.5 15.5V11h5v4.5M24 11V6M7 34h34v9H7zM12 37v3M18 37v3M30 37v3M36 37v3'], ['f', 'M23.2 4.5h1.6V7h-1.6z']] },
  duomomi: { n: 'DUOMO DI MILANO', g: [['s', 'M7 44V25l17-8.5L41 25v19M20.5 44v-6.5a3.5 3.5 0 0 1 7 0V44'], ['s', 'M7 25V14M13 22V11.5M18.5 19V8.5M29.5 19V8.5M35 22V11.5M41 25V14'], ['w', 'M24 16.5V4', 2.4], ['f', 'M6 14l1-3 1 3zM12 11.5l1-3 1 3zM17.5 8.5l1-3 1 3zM28.5 8.5l1-3 1 3zM34 11.5l1-3 1 3zM40 14l1-3 1 3zM23 4l1-3 1 3z'], ['s', 'M11 30h26M12 36v3M36 36v3']] },
  eiffel: { n: 'TOUR EIFFEL', g: [['s', 'M24 2v4M21.8 6h4.4M22.5 6 18.8 22M25.5 6l3.7 16M17.3 22h13.4M18.4 22 11.5 44M29.6 22 36.5 44M15.4 33h17.2M17.5 44c1.2-5 3.4-7.5 6.5-7.5s5.3 2.5 6.5 7.5M9.5 44h29'], ['s', 'M20.5 14h7M21.2 10h5.6M19.7 18h8.6M20 22l4 5 4-5M16 33l4-5M32 33l-4-5']] },
  bigben: { n: 'BIG BEN', g: [['s', 'M19 45V20h10v25M18 20h12M19 20l1-4h8l1 4M20 16 24 3.5 28 16'], ['s', circ(24, 25.5, 3.6) + 'M24 25.5v-2.4M24 25.5l1.8 1'], ['s', 'M21.5 32v9M26.5 32v9M12 45h24M24 3.5V1.5']] },
  edincastle: { n: 'CASTLE ROCK', g: [['f', 'M2 45c2-6 6-10 10-11s6-4 10-4 7 2 10 3 8 3 14 12z'], ['s', 'M13 30V22h21v8M13 22v-2.5h3V22h3v-2.5h3V22h3v-2.5h3V22h3v-2.5h3V22'], ['s', 'M26 22V14h6v8M29 14V7'], ['f', 'M29 7l4.5 1.6L29 10.2z']] },
  harp: { n: 'CELTIC HARP', g: [['w', 'M12 43V10', 3], ['s', 'M12 10c8-5 18-5 26 2M38 12 18 42'], ['s', 'M15 11.3v28M19 10.2v28.8M23 9.6v23.5M27 9.7v17.7M31 10.3v11.8M35 11.3v5.4'], ['s', 'M9 43h11']] },
  brandenburg: { n: 'BRANDENBURGER TOR', g: [['s', 'M3 43h42M6 18h36v5H6zM14 18v-3h20v3'], ['w', 'M8.5 23v20M14.5 23v20M20.5 23v20M27.5 23v20M33.5 23v20M39.5 23v20', 2.6], ['f', 'M20 15c.6-2.8 2-4.2 4-4.2s3.4 1.4 4 4.2zM23.3 10.8V6.5h1.4v4.3z'], ['s', 'M19 15l-2-2.4M29 15l2-2.4']] },
  frauenkirche: { n: 'FRAUENKIRCHE', g: [['s', 'M11 45V18h9v27M28 45V18h9v27M20 45V28h8v17M20 28l4-3 4 3'], ['f', 'M10 18c0-5.2 3.4-6.4 5.5-9.5C17.6 11.6 21 12.8 21 18zM27 18c0-5.2 3.4-6.4 5.5-9.5C34.6 11.6 38 12.8 38 18z'], ['s', 'M15.5 8.5V5M32.5 8.5V5M15.5 24v5M32.5 24v5M15.5 34v5M32.5 34v5']] },
  elphi: { n: 'ELBPHILHARMONIE', g: [['s', 'M5 44V30h38v14M5 30v-8c4.5-4 6.5 0 9.5-4 3 4 6.5-2 9.5-6.5 3 4.5 6.5 10.5 9.5 6.5 3 4 5-0 9.5 4v8'], ['s', 'M5 26h38M9 34h4M16 34h4M23 34h4M30 34h4M37 34h3M9 39h4M16 39h4M23 39h4M30 39h4M37 39h3'], ['s', WAVES(47, 2, 46, 1.5)]] },
  skylinefra: { n: 'MAINHATTAN', g: [['s', 'M3 44h42M5 44V25h6v19M11 44V12h7v32M18 44V20h6v24M24 44V6l3.5-2.5L31 6v38M31 44V16h6v28M37 44V28h6v16'], ['s', 'M14 16h1M14 21h1M14 26h1M27.5 10v30M21 24h1M21 29h1M34 21h1M34 26h1']] },
  koelnerdom: { n: 'KÖLNER DOM', g: [['f', 'M11 45V21l4.5-16 4.5 16v24zM28 45V21l4.5-16 4.5 16v24z'], ['s', 'M20 45V29h8v16M20 29l4-4 4 4M24 33v6'], ['s', 'M2 45h44']] },
  canalhouses: { n: 'GRACHTENPANDEN', g: [['s', 'M3 45V22l4.5-6 4.5 6v23M12 45V18h1.5v-3H15v-2.5h4.5V15H21v3h1.5v27M22.5 45V20.5c0-3 2-5 4.5-6.5 2.5 1.5 4.5 3.5 4.5 6.5V45M31.5 45V22l6.5-6.5 6.5 6.5v23'], ['f', 'M6 27h3v3H6zM6 34h3v3H6zM15 22h5v3h-5zM15 29h5v3h-5zM25.5 25h3v3h-3zM25.5 32h3v3h-3zM36 27h4v3h-4zM36 34h4v3h-4z'], ['s', 'M2 45h44']] },
  erasmus: { n: 'ERASMUSBRUG', g: [['w', 'M30 34V8c-1.5 0-3 1.5-3 4', 3], ['s', 'M30 10 7 34M30 14 13 34M30 18 19 34M30 10l9 24M30 16l5 18M2 34h44'], ['s', WAVES(41)]] },
  atomium: { n: 'ATOMIUM', g: [['s', 'M24 7 12 14M24 7l12 7M12 14v14M36 14v14M12 28l12 7M36 28l-12 7M24 7v28M12 14l24 14M36 14 12 28'], ['f', circ(24, 7, 3.6) + circ(12, 14, 3.6) + circ(36, 14, 3.6) + circ(24, 21, 3.6) + circ(12, 28, 3.6) + circ(36, 28, 3.6) + circ(24, 35, 3.6)], ['s', 'M20 36l-6 9M28 36l6 9M24 38.5V45M10 45h28']] },
  charlesbridge: { n: 'CHARLES BRIDGE', g: [['s', 'M2 36h44M16 36V16h16v20'], ['f', 'M14.5 16 24 3.5 33.5 16z'], ['s', 'M21 36v-6a3 3 0 0 1 6 0v6M14 16v-3M34 16v-3M7 36v-4.5M41 36v-4.5M5 31.5h4M39 31.5h4'], ['s', 'M2 40c4 0 5 4 9 4s5-4 9-4 5 4 9 4 5-4 9-4 5 4 9 4']] },
  riesenrad: { n: 'RIESENRAD', g: [['s', circ(24, 19, 15) + circ(24, 19, 2.5)], ['s', regular(24, 19, 15, 10).map(([x, y]) => `M24 19L${r2(x)} ${r2(y)}`).join('')], ['f', regular(24, 19, 15, 10).map(([x, y]) => `M${r2(x - 2)} ${r2(y)}h4v3.2h-4z`).join('')], ['s', 'M24 19 14 45M24 19l10 26M8 45h32']] },
  parliamenthu: { n: 'PARLAMENT', g: [['s', 'M2 42V30h44v12'], ['f', 'M17 30c0-6.5 3-10.5 7-10.5s7 4 7 10.5z'], ['s', 'M24 19.5v-8M8 30v-6.5M12 30v-4.5M36 30v-4.5M40 30v-6.5M4 30v-3M44 30v-3'], ['s', 'M6 34v4.5M10 34v4.5M14 34v4.5M19 34v4.5M29 34v4.5M34 34v4.5M38 34v4.5M42 34v4.5' + WAVES(46, 2, 46, 1.5)]] },
  pkin: { n: 'PAŁAC KULTURY', g: [['s', 'M9 45V32h30v13M13.5 32v-8h21v8M18 24v-8h12v8M21 16v-6h6v6'], ['w', 'M24 10V1.5', 1.8], ['s', 'M24 26.5v4M19 35v7M29 35v7M14 36v7M34 36v7M24 35v7M5 45h38']] },
  mariacki: { n: "ST MARY'S", g: [['s', 'M11 45V17h9v28M28 45V23h8v22M20 45V29h8v16'], ['f', 'M10 17l5.5-13 5.5 13zM27.2 23c0-4.3 3-6.4 4.8-8.6 1.8 2.2 4.8 4.3 4.8 8.6z'], ['s', 'M9.5 17 8 14.5M21 17l1.5-2.5M15.5 23v5M15.5 33v5M32 28v4M23 45v-5a1 1 0 0 1 2 0v5M3 45h42']] },
  zuraw: { n: 'ŻURAW', g: [['s', 'M6 45V22h9v23M33 45V22h9v23M15 45V12h18v33'], ['s', 'M14 12l10-6.5L34 12M15 18h18M15 24h18M15 12l18 12M33 12 15 24'], ['f', 'M5.5 22c0-3 2-5 5-5s5 2 5 5zM32.5 22c0-3 2-5 5-5s5 2 5 5z'], ['s', 'M2 45h44']] },
  mermaid: { n: 'LITTLE MERMAID', g: [['f', 'M7 45c2-6 8.5-9 17-9s15 3 17 9z'], ['s', circ(21.5, 12.5, 2.8) + 'M21.5 15.5v6c0 3-2 4.5-2.5 7-.5 3 1.5 6 5 6.5M24 35c4 .3 8.5-.6 11.5 1.4-1.7 0-3 .8-3.8 2'], ['s', 'M21.5 18.5c2.5 1.5 4 4 3.5 7M21.5 18.5c-2 1-3 2.5-3 4.5']] },
  trekronor: { n: 'TRE KRONOR', g: [['f', crownD(7, 6, 1.15) + crownD(27.2, 6, 1.15) + crownD(17.1, 26, 1.15)], ['s', 'M7 20.5h13.8M27.2 20.5H41M17.1 40.5h13.8']] },
  tuomiokirkko: { n: 'TUOMIOKIRKKO', g: [['s', 'M7 45V30h34v15M11 30v-6h26v6M18 30l6-3 6 3M18 24v-6h12v6'], ['f', 'M18 18c0-5 2.7-8.2 6-8.2s6 3.2 6 8.2zM7.5 30c0-3.2 1.2-4.6 2.5-5.6 1.3 1 2.5 2.4 2.5 5.6zM35.5 30c0-3.2 1.2-4.6 2.5-5.6 1.3 1 2.5 2.4 2.5 5.6z'], ['s', 'M24 9.8V5.5M14 45V33M19 45V33M29 45V33M34 45V33M3 45h42']] },
  vikingship: { n: 'VIKING SHIP', g: [['s', 'M4 31c6 6.5 34 6.5 40 0M4 31c-2-6.5 2-12.5 6.5-10.5-2 0-3 2-2 4.3M44 31c2-6.5-2-12.5-6.5-10.5 2 0 3 2 2 4.3M24 34V5'], ['s', 'M14 7h20v16H14z'], ['f', 'M18 7h4v16h-4zM26 7h4v16h-4z'], ['s', circ(12, 32, 1.8) + circ(18, 33.5, 1.8) + circ(24, 34, 1.8) + circ(30, 33.5, 1.8) + circ(36, 32, 1.8)], ['s', WAVES(43)]] },
  hallgrims: { n: 'HALLGRÍMSKIRKJA', g: [['s', 'M21 45V10l3-6 3 6v35M21 16h-3v6h-3v6h-3v5h-3v4H6v8M27 16h3v6h3v6h3v5h3v4h3v8M18 22v23M15 28v17M12 33v12M9 37v8M30 22v23M33 28v17M36 33v12M39 37v8M3 45h42'], ['s', circ(24, 14, 1.3)]] },
  sagrada: { n: 'SAGRADA FAMÍLIA', g: [['s', 'M6 45V30h36v15M20 45v-6a4 4 0 0 1 8 0v6'], ['f', 'M8.5 30V22L10.5 9l2 13v8zM15.5 30V18l2-14 2 14v12zM22 30V14l2-12 2 12v16zM28.5 30V18l2-14 2 14v12zM35.5 30v-8l2-13 2 13v8z'], ['s', 'M2 45h44M10 34v6M38 34v6']] },
  alcala: { n: 'PUERTA DE ALCALÁ', g: [['s', 'M3 45V19h42v26M15 19v-4h18v4M19 15l5-5 5 5'], ['s', 'M12.5 45V32a3 3 0 0 1 6 0v13M21 45V30a3 3 0 0 1 6 0v15M29.5 45V32a3 3 0 0 1 6 0v13M5 45v-9h4v9M39 45v-9h4v9M3 24h42']] },
  hemisferic: { n: 'CIUTAT DE LES ARTS', g: [['s', 'M3 26c9-12 33-12 42 0-9 12-33 12-42 0z'], ['f', circ(24, 26, 6)], ['s', 'M6 26h-3M45 26h-3M12 33c4 2 8 3 12 3s8-1 12-3'], ['s', WAVES(42, 2, 46, 1.5) + WAVES(46, 6, 42, 1.2)]] },
  giralda: { n: 'LA GIRALDA', g: [['s', 'M18.5 45V15h11v30M19.5 15V9h9v6M21.5 9V5.5h5V9'], ['w', 'M24 5.5V1.5', 1.8], ['f', 'M22 18.5h4v4.5h-4zM22 27h4v4.5h-4zM22 35.5h4v4.5h-4zM21.3 10.5h1.6v3h-1.6zM25.1 10.5h1.6v3h-1.6z'], ['s', 'M10 45h28']] },
  tram28: { n: 'ELÉTRICO 28', g: [['s', 'M5 18h38v20H5zM7 18c0-3 2-4.5 4.5-4.5h25c2.5 0 4.5 1.5 4.5 4.5M30 13.5 38 4M28 4h17'], ['s', 'M8 22h6.5v6.5H8zM16.5 22H23v6.5h-6.5zM25 22h6.5v6.5H25zM33.5 22H40v6.5h-6.5z'], ['f', 'M5 31h38v2.2H5z'], ['s', circ(13, 41, 2.8) + circ(35, 41, 2.8) + 'M2 45h44']] },
  domluis: { n: 'PONTE LUÍS I', g: [['s', 'M2 12h44M6 45C10 18 38 18 42 45M2 33h44'], ['s', 'M11 12v12M17 12v7.5M24 12v5M31 12v7.5M37 12v12'], ['s', 'M4 12V9h3v3M41 12V9h3v3']] },
  jetdeau: { n: "JET D'EAU", g: [['s', 'M2 33l8-8 6 5 6-8 8 9 6-5 10 7'], ['w', 'M24 40V9', 2.2], ['s', 'M24 9c-3.5-4.5-1.5-8 0-8s3.5 3.5 0 8M21 13c-2 1-3 3-2.5 5M27 13c2 1 3 3 2.5 5'], ['s', WAVES(41) + WAVES(46, 6, 42, 1.4)]] },
  grossmunster: { n: 'GROSSMÜNSTER', g: [['s', 'M11 45V15h9v30M28 45V15h9v30M20 45V27h8v18'], ['f', 'M11 15c0-3.5 2-5.5 4.5-6.8 2.5 1.3 4.5 3.3 4.5 6.8zM28 15c0-3.5 2-5.5 4.5-6.8 2.5 1.3 4.5 3.3 4.5 6.8z'], ['s', 'M15.5 21v4M32.5 21v4M15.5 31v4M32.5 31v4M15.5 8.2V5M32.5 8.2V5' + WAVES(46.5, 2, 46, 1.2)]] },
  bluemosque: { n: 'BLUE MOSQUE', g: [['s', 'M8 45V32h32v13'], ['f', 'M14 32c0-7 4.3-11 10-11s10 4 10 11zM8 32c0-3 2-5 4.5-5s4.5 2 4.5 5zM31 32c0-3 2-5 4.5-5s4.5 2 4.5 5z'], ['s', 'M4 45V14M44 45V14M24 21v-4.5M21 45v-5a3 3 0 0 1 6 0v5'], ['f', 'M3 14l1-5.5 1 5.5zM43 14l1-5.5 1 5.5z'], ['s', 'M25 13.5a2 2 0 1 1-1.5-3']] },
  liberty: { n: 'LADY LIBERTY', g: [['s', circ(23, 14, 2.6) + 'M23 10.8V8M20 11.4l-1.5-2.3M26 11.4l1.5-2.3M18.5 13.5l-2.8-1M27.5 13.5l2.8-1'], ['w', 'M25 18l4.5-10.5', 2.4], ['f', 'M29.5 8c-1.2-2-.4-4.5 1-5.5 1.2 1 2 3.5 1 5.5zM19 18c-2 6-3 13.5-2 20h12c1-6.5 0-14-2-20z'], ['s', 'M18 22.5l-3.5 4 2.5 1.5M15 38h16v7H15zM12 45h22']] },
  bostonlight: { n: 'BOSTON LIGHT', g: [['s', 'M17 45l2.8-25h8.4L31 45M14 45h20M19 20h10M20.5 20v-5.5h7V20M24 14.5V11'], ['f', 'M22 11l2-3 2 3zM20.5 15.5h7v3h-7z'], ['s', 'M9 12l8 4M39 12l-8 4M9 21l8-1.5M39 21l-8-1.5M20.3 30h7.4M19.7 37h8.6']] },
  cloudgate: { n: 'CLOUD GATE', g: [['s', 'M2 31V19h5v12M7 31V11h6v20M13 31V17h5v14M30 31V13h5v18M35 31V21h5v10M40 31V9h5v22'], ['f', 'M7 41c0-6.5 6.5-10.5 17-10.5S41 34.5 41 41c-4 2-8.5 0-10.5-2-2.3-2.2-10.7-2.2-13 0-2 2-6.5 4-10.5 2z'], ['s', 'M2 45h44']] },
  goldengate: { n: 'GOLDEN GATE', g: [['w', 'M14 45V7M34 45V7', 2.8], ['s', 'M11.5 12h5M11.5 20h5M11.5 28h5M31.5 12h5M31.5 20h5M31.5 28h5M2 31c6-2 10-10 12-23 4 15 16 15 20 0 2 13 6 21 12 23M2 33h44'], ['s', 'M19 33v-8M24 33v-5.5M29 33v-8M8 33v-3.5M40 33v-3.5'], ['s', WAVES(42)]] },
  torii: { n: 'TORII', g: [['f', 'M3 9c7 2.5 35 2.5 42 0l-1.2 4.5c-7 1.2-32.6 1.2-39.6 0z'], ['w', 'M12 13.5V45M36 13.5V45', 3.4], ['w', 'M8 20h32', 2.8], ['s', 'M24 13.5V20M7 45h10M31 45h10']] },
  operahouse: { n: 'OPERA HOUSE', g: [['f', 'M6 33c2-10 8-16 14-18-1.2 6-2 12-2 18zM16.5 33c2-12 9-20 16-22-2 8-3 15-3 22zM28.5 33c2-9 8-14 13-15-1 5-2 10-2 15z'], ['s', 'M3 33h42v4H3z' + WAVES(43)]] },
  giza: { n: 'GIZA', g: [['f', 'M2 42 15 18l13 24zM22 42l11-19 11 19z'], ['s', 'M15 18l4 24M33 23l3 19'], ['s', circ(38, 10, 3.5) + 'M2 42h44M30 42l-2-3'], ['s', 'M4 46h40']] },
  burj: { n: 'BURJ KHALIFA', g: [['w', 'M24 1.5V8', 1.6], ['s', 'M22 8h4l3 36h-10zM22 8l-4 36M26 8l4 36M21 18h6M20 28h8M19.4 36h9.2M10 44h28']] },
  mbs: { n: 'MARINA BAY', g: [['f', 'M6 13h36c2.2 0 4 1 4 2.4H2c0-1.4 1.8-2.4 4-2.4z'], ['s', 'M9 15.5l1.5 29h6l-.5-29M21 15.5l.5 29h6l.5-29M32.5 15.5l-.5 29h6l1.5-29M3 44.5h42'], ['s', WAVES(47.5, 2, 46, 1.2)]] },
  maltesecross: { n: 'MALTESE CROSS', g: [['f', [0, 1, 2, 3].map(k => { const a = k * Math.PI / 2, rot = ([x, y]) => [24 + (x - 24) * Math.cos(a) - (y - 24) * Math.sin(a), 24 + (x - 24) * Math.sin(a) + (y - 24) * Math.cos(a)]; return poly([[24, 22], [17, 4], [24, 9.5], [31, 4]].map(rot)); }).join('')]] },
  pyramidmx: { n: 'PIRÁMIDE', g: [['s', 'M3 44h42M6 44l3-8h30l3 8M9 36l3-8h24l3 8M12 28l3-8h18l3 8M15 20l3-6h12l3 6'], ['f', 'M21 14h6V9h-6z'], ['s', 'M24 44V20M21.5 44v-3h5v3']] }
};
// city (normalised name) → landmark
const CITY_LM = {
  vilnius: 'gediminas', kaunas: 'kaunascastle', klaipeda: 'meridianas', trakai: 'trakai', birstonas: 'nemunas', palanga: 'palangapier', nida: 'parnidis', neringa: 'parnidis', siauliai: 'hillofcrosses',
  riga: 'stpeters', jurmala: 'jurmala', tallinn: 'oldthomas', tartu: 'umbrella',
  larnaka: 'flamingo', larnaca: 'flamingo', limassol: 'amphora', lemesos: 'amphora', paphos: 'aphrodite', pafos: 'aphrodite', nicosia: 'venetianwalls', lefkosia: 'venetianwalls',
  athens: 'parthenon', athina: 'parthenon', rome: 'colosseum', roma: 'colosseum', venice: 'gondola', venezia: 'gondola', florence: 'duomofi', firenze: 'duomofi', milan: 'duomomi', milano: 'duomomi',
  paris: 'eiffel', london: 'bigben', edinburgh: 'edincastle', dublin: 'harp',
  berlin: 'brandenburg', munich: 'frauenkirche', munchen: 'frauenkirche', hamburg: 'elphi', frankfurt: 'skylinefra', frankfurtammain: 'skylinefra', cologne: 'koelnerdom', koln: 'koelnerdom',
  amsterdam: 'canalhouses', rotterdam: 'erasmus', brussels: 'atomium', bruxelles: 'atomium', brussel: 'atomium',
  prague: 'charlesbridge', praha: 'charlesbridge', vienna: 'riesenrad', wien: 'riesenrad', budapest: 'parliamenthu', warsaw: 'pkin', warszawa: 'pkin', krakow: 'mariacki', gdansk: 'zuraw',
  copenhagen: 'mermaid', kobenhavn: 'mermaid', stockholm: 'trekronor', helsinki: 'tuomiokirkko', oslo: 'vikingship', reykjavik: 'hallgrims',
  barcelona: 'sagrada', madrid: 'alcala', valencia: 'hemisferic', seville: 'giralda', sevilla: 'giralda', lisbon: 'tram28', lisboa: 'tram28', porto: 'domluis',
  geneva: 'jetdeau', geneve: 'jetdeau', zurich: 'grossmunster', istanbul: 'bluemosque',
  newyork: 'liberty', newyorkcity: 'liberty', nyc: 'liberty', boston: 'bostonlight', chicago: 'cloudgate', sanfrancisco: 'goldengate',
  tokyo: 'torii', kyoto: 'torii', sydney: 'operahouse', cairo: 'giza', giza: 'giza', dubai: 'burj', singapore: 'mbs', valletta: 'maltesecross', mexicocity: 'pyramidmx', ciudaddemexico: 'pyramidmx'
};

/* ---------- inks: two flag-inspired inks per country, picked per city ---------- */
const FLAG_INK = {
  LT: ['#1d7a3b', '#b0252d'], LV: ['#8d1c2c', '#7a2a34'], EE: ['#1f5aa6', '#2a3440'], CY: ['#c0661a', '#3d7a3a'], GR: ['#1f58a8', '#2b6cc4'], IT: ['#1f7a40', '#b8282f'], FR: ['#1f3f99', '#c0262f'],
  GB: ['#1d2f7a', '#c0262f'], IE: ['#16804a', '#c86a12'], DE: ['#2b2b2b', '#b8242c'], NL: ['#c0391c', '#1f3f8c'], BE: ['#2b2b2b', '#c0262f'], CZ: ['#1f3f8c', '#c0262f'], AT: ['#c0262f', '#8c1f26'],
  HU: ['#b8282f', '#3b7a3a'], PL: ['#c0263a', '#8c1f2e'], DK: ['#c0262f', '#8c1f26'], SE: ['#1f5aa6', '#1b4f8a'], FI: ['#1f4fa0', '#173f80'], NO: ['#b8242c', '#1f3070'], IS: ['#1f4fa0', '#c0262f'],
  ES: ['#b8282f', '#b8730f'], PT: ['#16704a', '#b8282f'], CH: ['#c0262f', '#8c1f26'], TR: ['#c0262f', '#8c1f26'], US: ['#1f3070', '#b8242c'], JP: ['#bf1f3a', '#2b2b2b'], AU: ['#1f3070', '#b8242c'],
  EG: ['#a8761a', '#b8242c'], AE: ['#1f7a40', '#b8242c'], SG: ['#c0262f', '#8c1f26'], MT: ['#b8242c', '#5a5a5a'], MX: ['#16704a', '#b8282f'], UA: ['#1f5aa6', '#b38a0f'], BY: ['#b8242c', '#2f7a3a'],
  HR: ['#c0262f', '#1f3f8c'], SI: ['#1f3f8c', '#c0262f'], SK: ['#1f3f8c', '#c0262f'], RO: ['#1f3f8c', '#b8730f'], BG: ['#2f7a3a', '#b8242c'], RS: ['#b8242c', '#1f3f8c'], GE: ['#c0262f', '#8c1f26'], CA: ['#c0262f', '#8c1f26'], NZ: ['#1f3070', '#b8242c'], BR: ['#1f7a40', '#1f3f8c'], ZA: ['#1f7a40', '#1f3070'], KE: ['#1f7a40', '#b8242c'], MA: ['#b8242c', '#1f7a40']
};
const INKS = ['#1f5aa6', '#b0252d', '#1d7a3b', '#6c3fb5', '#0f7f81', '#a8520f', '#9a1f6a', '#2b3d8a', '#5f6b1d', '#b03a2e'];
function inkFor(country, cityKey) { const pair = FLAG_INK[country]; const h = hashS(cityKey + '|' + country); return pair ? pair[h % 2] : INKS[h % INKS.length]; }

/* ---------- distance art (fallback when a country outline is not available) ---------- */
const DIST_ART = {
  '5K': [['s', 'M8 34c2-2 6-3 10-3h4l6-8c1.5-2 4-2 5.5-.5L40 29c2 1.5 2 4-.5 5H8z' + 'M12 31v-3M18 31v-4'], ['t', 24, 44, 8, '5 KM']],
  '10K': [['s', circ(24, 24, 16) + 'M24 24V13M24 24l7 4M24 6v3M24 39v3M6 24h3M39 24h3']],
  HM: [['f', leafArc(24, 26, 15, Math.PI * .55, Math.PI * 1.35, 6, 6, false)], ['t', 27, 30, 12, '½']],
  M: [['f', leafArc(24, 26, 15, Math.PI * .5, Math.PI * 1.35, 6, 6, false) + leafArc(24, 26, 15, Math.PI * .5, -Math.PI * .35, 6, 6, true)], ['t', 24, 30, 11, '42']],
  ULTRA: [['s', 'M3 40 15 18l6 9 7-13 17 26z'], ['f', 'M24.8 18.5 28 14l3 4.6-3 1.5z']],
  OTHER: [['s', 'M6 38c4-10 8-20 18-20s10 12 18-2'], ['f', circ(6, 38, 2.5) + circ(42, 16, 2.5)]]
};

function drawItems(items, ink, x, y, size, sw = 2.2) {
  const s = size / 48;
  let out = `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})" stroke-linecap="round" stroke-linejoin="round">`;
  for (const it of items) {
    if (it[0] === 's') out += `<path d="${it[1]}" fill="none" stroke="${ink}" stroke-width="${sw}"/>`;
    else if (it[0] === 'w') out += `<path d="${it[1]}" fill="none" stroke="${ink}" stroke-width="${it[2] * sw / 2.2}"/>`;
    else if (it[0] === 'f') out += `<path d="${it[1]}" fill="${ink}" stroke="none"/>`;
    else if (it[0] === 't') out += `<text x="${it[1]}" y="${it[2]}" text-anchor="middle" font-family="'Barlow Condensed','Arial Narrow',Arial,sans-serif" font-weight="800" font-size="${it[3]}" fill="${ink}">${escX(it[4])}</text>`;
  }
  return out + '</g>';
}

/* ---------- stamp shapes ---------- */
const SHAPES = ['circle', 'scallop', 'octagon', 'hexagon', 'sun', 'ticket', 'postage', 'frame'];
function shapePath(kind, s = 1) {
  const c = 80;
  switch (kind) {
    case 'circle': return circ(c, c, 74 * s);
    case 'scallop': { const n = 30, R = 74 * s, a = 3.2 * s; let d = ''; for (let i = 0; i <= n * 4; i++) { const t = i / (n * 4) * Math.PI * 2, rr = R - a + a * Math.cos(t * n); d += (i ? 'L' : 'M') + r2(c + Math.cos(t) * rr) + ' ' + r2(c + Math.sin(t) * rr); } return d + 'z'; }
    case 'octagon': return poly(regular(c, c, 76 * s, 8, -Math.PI / 8));
    case 'hexagon': return poly(regular(c, c, 77 * s, 6, 0));
    case 'sun': return circ(c, c, 70 * s);
    case 'ticket': { const x0 = 80 - 72 * s, y0 = 80 - 62 * s, w = 144 * s, h = 124 * s, n = 9 * s; return `M${r2(x0 + n)} ${r2(y0)}h${r2(w - 2 * n)}a${r2(n)} ${r2(n)} 0 0 0 ${r2(n)} ${r2(n)}v${r2(h - 2 * n)}a${r2(n)} ${r2(n)} 0 0 0 ${r2(-n)} ${r2(n)}h${r2(-(w - 2 * n))}a${r2(n)} ${r2(n)} 0 0 0 ${r2(-n)} ${r2(-n)}v${r2(-(h - 2 * n))}a${r2(n)} ${r2(n)} 0 0 0 ${r2(n)} ${r2(-n)}z`; }
    case 'postage': { const x0 = 80 - 70 * s, y0 = 80 - 64 * s, w = 140 * s, h = 128 * s, k = 5.6 * s; let d = `M${r2(x0)} ${r2(y0)}`; const edge = (dx, dy, len) => { const n = Math.round(len / (k * 2)); const sx = dx * len / n / 2, sy = dy * len / n / 2; for (let i = 0; i < n; i++) d += `l${r2(sx + dy * k * .55)} ${r2(sy - dx * k * .55)}l${r2(sx - dy * k * .55)} ${r2(sy + dx * k * .55)}`; }; edge(1, 0, w); edge(0, 1, h); edge(-1, 0, w); edge(0, -1, h); return d + 'z'; }
    case 'frame': { const x0 = 80 - 70 * s, y0 = 80 - 64 * s; return `M${r2(x0)} ${r2(y0 + 10 * s)}q0 ${r2(-10 * s)} ${r2(10 * s)} ${r2(-10 * s)}h${r2(120 * s)}q${r2(10 * s)} 0 ${r2(10 * s)} ${r2(10 * s)}v${r2(108 * s)}q0 ${r2(10 * s)} ${r2(-10 * s)} ${r2(10 * s)}h${r2(-120 * s)}q${r2(-10 * s)} 0 ${r2(-10 * s)} ${r2(-10 * s)}z`; }
  }
}
const ROUND = new Set(['circle', 'scallop', 'octagon', 'hexagon', 'sun']);

function ringOrnament(dist, ink, R) {
  // inner ring style tells the distance at a glance
  const c = 80;
  if (dist === '5K') return `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${ink}" stroke-width="2.2" stroke-dasharray=".1 5.2" stroke-linecap="round"/>`;
  if (dist === '10K') { let d = ''; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, l = i % 5 ? 2.6 : 5; d += `M${r2(c + Math.cos(a) * R)} ${r2(c + Math.sin(a) * R)}L${r2(c + Math.cos(a) * (R - l))} ${r2(c + Math.sin(a) * (R - l))}`; } return `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${ink}" stroke-width="1.2"/><path d="${d}" stroke="${ink}" stroke-width="1"/>`; }
  if (dist === 'ULTRA') { let d = ''; const n = 36; for (let i = 0; i <= n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, rr = i % 2 ? R - 4 : R; d += (i ? 'L' : 'M') + r2(c + Math.cos(a) * rr) + ' ' + r2(c + Math.sin(a) * rr); } return `<path d="${d}z" fill="none" stroke="${ink}" stroke-width="1.2"/>`; }
  if (dist === 'OTHER') { let d = ''; for (let i = 0; i <= 240; i++) { const a = i / 240 * Math.PI * 2, rr = R - 1.5 + 1.5 * Math.sin(a * 24); d += (i ? 'L' : 'M') + r2(c + Math.cos(a) * rr) + ' ' + r2(c + Math.sin(a) * rr); } return `<path d="${d}z" fill="none" stroke="${ink}" stroke-width="1.2"/>`; }
  if (dist === 'M') return `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${ink}" stroke-width="1.2"/><circle cx="${c}" cy="${c}" r="${R - 3.5}" fill="none" stroke="${ink}" stroke-width=".8"/>`;
  return `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
}
function laurels(dist, ink, cx, cy, spread) {
  if (dist !== 'M' && dist !== 'HM') return '';
  const L = leafArc(cx, cy, spread, Math.PI * .62, Math.PI * 1.18, 5, 7.5, false);
  const R = dist === 'M' ? leafArc(cx, cy, spread, Math.PI * .38, -Math.PI * .18, 5, 7.5, true) : '';
  return `<path d="${L}${R}" fill="${ink}"/>`;
}
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
const F = "font-family=\"'Barlow Condensed','Arial Narrow',Arial,sans-serif\"";

/* stamp(o): o = { id, ink, dark, shape?, dist, city, countryName, top, date, label, big, sub, foot, upcoming, pb, edition, landmark (key), sil:{d, dot:[x,y]} } */
function stamp(o) {
  const h = hashS(o.id), seed = hashS(o.city + '|' + o.countryName);
  const kind = o.shape || SHAPES[seed % SHAPES.length];
  const ink = o.dark ? '#f6f2e9' : o.ink;
  const uid = 'k' + h.toString(36) + (o.k || '') + (o.dark ? 'd' : 'l');
  const rot = (h % 15) - 7;
  const dash = o.upcoming ? ' stroke-dasharray="8 5"' : '';
  const lm = o.landmark && LM[o.landmark];
  const tx = (x, y, size, txt, w = 800, ls = 1, anchor = 'middle', extra = '') => `<text x="${r2(x)}" y="${r2(y)}" text-anchor="${anchor}" ${F} font-weight="${w}" font-size="${r2(size)}" letter-spacing="${ls}" fill="${ink}"${extra}>${escX(txt)}</text>`;
  const fit = (txt, width, max, k = .6, ls = 1.2) => { const n = Math.max(1, String(txt).length); return Math.max(4.4, Math.min(max, (width / n - ls) / k)); };
  const art = (x, y, size) => {
    if (lm) return drawItems(lm.g, ink, x, y, size, 2.3);
    if (o.sil && o.sil.d) {
      const sc = size / 100;
      let s = `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(sc)})"><path d="${o.sil.d}" fill="${ink}" fill-opacity=".22" stroke="${ink}" stroke-width="${r2(2.4 / sc / 1.4)}" stroke-linejoin="round"/>`;
      if (o.sil.dot) s += `<circle cx="${r2(o.sil.dot[0])}" cy="${r2(o.sil.dot[1])}" r="${r2(7 / sc / 1.4)}" fill="none" stroke="${ink}" stroke-width="${r2(2 / sc / 1.4)}"/><circle cx="${r2(o.sil.dot[0])}" cy="${r2(o.sil.dot[1])}" r="${r2(3 / sc / 1.4)}" fill="${ink}"/>`;
      return s + '</g>';
    }
    return drawItems(DIST_ART[o.dist] || DIST_ART.OTHER, ink, x, y, size, 2.3);
  };
  const artName = lm ? lm.n : (o.sil && o.sil.d ? o.countryName.toUpperCase() : '');
  let body = '';
  if (ROUND.has(kind)) {
    body += `<path d="${shapePath(kind)}" fill="none" stroke="${ink}" stroke-width="3.6"${dash}/>`;
    if (kind === 'sun') { let d = ''; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; d += `M${r2(80 + Math.cos(a) * 73)} ${r2(80 + Math.sin(a) * 73)}L${r2(80 + Math.cos(a) * 78)} ${r2(80 + Math.sin(a) * 78)}`; } body += `<path d="${d}" stroke="${ink}" stroke-width="2"/>`; }
    if (kind === 'octagon' || kind === 'hexagon') body += `<path d="${shapePath(kind, .9)}" fill="none" stroke="${ink}" stroke-width="1"/>`;
    body += ringOrnament(o.dist, ink, 56);
    const topTxt = o.top, botTxt = o.date;
    body += `<path id="${uid}t" d="M17 80A63 63 0 0 1 143 80" fill="none"/><path id="${uid}b" d="M10 80A70 70 0 0 0 150 80" fill="none"/>`;
    body += `<text ${F} font-weight="700" font-size="${r2(fit(topTxt, 168, 12.5, .62, 1.6))}" letter-spacing="1.6" fill="${ink}" text-anchor="middle"><textPath href="#${uid}t" startOffset="50%">${escX(topTxt)}</textPath></text>`;
    body += `<text ${F} font-weight="700" font-size="10.5" letter-spacing="2" fill="${ink}" text-anchor="middle"><textPath href="#${uid}b" startOffset="50%">${escX(botTxt)}</textPath></text>`;
    body += tx(13, 84, 9, '★', 400, 0) + tx(147, 84, 9, '★', 400, 0);
    body += art(62, 28, 36);
    if (artName) body += tx(80, 72.5, fit(artName, 74, 7.5, .62, .9), artName, 700, .9);
    if (!o.upcoming) body += laurels(o.dist, ink, 80, 100, 41);
    body += tx(80, 85, fit(o.label, 80, 11.5, .62, 1.3), o.label, 800, 1.3);
    body += tx(80, 106, o.upcoming ? 15 : fit(o.big, 82, 26, .54, .5), o.big, 800, .5);
    if (o.sub) body += tx(80, 118, fit(o.sub, 76, 9.5, .62, 1.2), o.sub, 700, 1.2);
    if (o.foot) body += tx(80, 128.5, fit(o.foot, 60, 8.5, .62, 1), o.foot, 700, 1);
  } else {
    body += `<path d="${shapePath(kind)}" fill="none" stroke="${ink}" stroke-width="3.6"${dash}/>`;
    if (kind === 'ticket') body += `<path d="${shapePath(kind, .9)}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="3 2.4"/>`;
    else if (kind === 'postage') body += `<rect x="18" y="24" width="124" height="112" rx="3" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
    else body += `<path d="${shapePath(kind, .88)}" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
    const L = kind === 'postage' ? 24 : 20, Rr = 160 - L;
    body += tx(80, 37.5, fit(o.top, Rr - L - 10, 11.5, .62, 1.6), o.top, 700, 1.6);
    body += `<line x1="${L + 2}" y1="43.5" x2="${Rr - 2}" y2="43.5" stroke="${ink}" stroke-width="1"/>`;
    if (o.dist === '10K') { let d = ''; for (let x = L + 4; x < Rr - 2; x += 4) d += `M${x} 43.5v${(x / 4) % 5 ? 2.5 : 4.5}`; body += `<path d="${d}" stroke="${ink}" stroke-width=".9"/>`; }
    if (o.dist === 'ULTRA') { let d = `M${L + 2} 43.5`; for (let x = L + 2; x < Rr - 6; x += 8) d += 'l4 -4l4 4'; body += `<path d="${d}" fill="none" stroke="${ink}" stroke-width="1"/>`; }
    body += art(L + 3, 48, 38);
    if (artName) body += tx(L + 22, 95, fit(artName, 46, 6.6, .62, .5), artName, 700, .5);
    const tx0 = L + 49;
    body += tx(tx0, 59, fit(o.label, Rr - tx0 - 6, 12, .62, 1.2), o.label, 800, 1.2, 'start');
    if (o.sub) body += tx(tx0, 71.5, fit(o.sub, Rr - tx0 - 6, 9.5, .62, 1), o.sub, 700, 1, 'start');
    if (o.foot) body += tx(tx0, 83, fit(o.foot, Rr - tx0 - 6, 8.5, .62, 1), o.foot, 700, 1, 'start');
    if (!o.upcoming) body += laurels(o.dist, ink, 80, 110, 42);
    body += tx(80, 116.5, o.upcoming ? 16 : fit(o.big, 88, 24, .54, .5), o.big, 800, .5);
    body += `<line x1="${L + 2}" y1="122" x2="${Rr - 2}" y2="122" stroke="${ink}" stroke-width="1"${o.dist === '5K' ? ' stroke-dasharray=".1 4" stroke-linecap="round" stroke-width="2"' : ''}/>`;
    body += tx(80, 132, 9.5, o.date, 700, 1.8);
  }
  if (o.edition > 1 && !o.upcoming) {
    const ex = ROUND.has(kind) ? 21 : 141, ey = ROUND.has(kind) ? 114 : 139;
    body += `<g transform="rotate(-14 ${ex} ${ey})"><circle cx="${ex}" cy="${ey}" r="14" fill="none" stroke="${ink}" stroke-width="2"/><circle cx="${ex}" cy="${ey}" r="11" fill="none" stroke="${ink}" stroke-width=".8"/>` +
      tx(ex, ey + 3.2, ROMAN[o.edition] && ROMAN[o.edition].length > 3 ? 8 : 10.5, ROMAN[o.edition] || o.edition, 800, .3) + tx(ex, ey - 4.6, 4.8, 'EDITION', 700, .6) + '</g>';
  }
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 172 172"${o.size ? ` width="${o.size}" height="${o.size}"` : ''} role="img" aria-label="${escX(o.title || o.city)} stamp">`;
  svg += `<defs><filter id="${uid}f" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${h % 60}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.7" xChannelSelector="R" yChannelSelector="G" result="d"/><feComponentTransfer in="n" result="m"><feFuncA type="linear" slope="1.5" intercept="-0.1"/></feComponentTransfer><feComposite in="d" in2="m" operator="in"/></filter>`;
  if (o.pb && !o.upcoming) svg += `<linearGradient id="${uid}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".45" stop-color="#e9b530"/><stop offset="1" stop-color="#a26f0c"/></linearGradient>`;
  svg += `</defs><g transform="rotate(${rot} 80 80)" filter="url(#${uid}f)" opacity="${o.upcoming ? .6 : .95}">${body}</g>`;
  if (o.pb && !o.upcoming) svg += crownSeal(140, 18, 17, uid + 'g');
  return svg + '</svg>';
}
function crownSeal(cx, cy, r, gid) {
  return `<g transform="rotate(12 ${cx} ${cy})"><circle cx="${cx}" cy="${cy + 1.5}" r="${r}" fill="#000" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${gid})" stroke="#7a5306" stroke-width="1.4"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#7a5306" stroke-width=".8" stroke-dasharray="1.2 1.6"/>` +
    `<path d="${crownD(cx - 9, cy - 9, 1.5)}" fill="#4a3000"/><circle cx="${cx}" cy="${cy - 9.5}" r="1.4" fill="#4a3000"/><circle cx="${cx - 9}" cy="${cy - 5}" r="1.2" fill="#4a3000"/><circle cx="${cx + 9}" cy="${cy - 5}" r="1.2" fill="#4a3000"/>` +
    `<text x="${cx}" y="${cy + 12.2}" text-anchor="middle" ${F} font-weight="800" font-size="7.5" letter-spacing=".8" fill="#4a3000">PB</text></g>`;
}
const CROWN_ICON = '<svg class="crown" viewBox="0 0 24 20" aria-hidden="true"><path d="M2 17h20l1.4-11-6.4 4.6L12 2 7 10.6.6 6z" fill="currentColor"/><path d="M2.5 19h19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/* ---------- badge icons (48×48) ---------- */
const BI = {
  stamp: [['s', circ(24, 8, 4.5) + 'M21.5 12.5h5v6h-5zM11 18.5h26v6H11zM8 24.5h32v5H8z'], ['s', 'M10 36h28M14 41h20'], ['f', 'M18 35h12v2H18z']],
  hand: [['s', 'M15 44c-4-4-6.5-10-6.5-15l1.8-7c.8-2.4 4.4-2.2 4.4.8V27V10.5c0-2.6 4.6-2.6 4.6 0V25V8c0-2.6 4.6-2.6 4.6 0v17V10.5c0-2.6 4.6-2.6 4.6 0V27l2-5.6c1-2.4 4.6-1.6 4.2 1.2L37 31c-1 6-4 10.5-8 13']],
  passports: [['s', 'M16 7h19a2 2 0 0 1 2 2v26'], ['s', 'M11 11h21a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H11z'], ['s', circ(22.5, 24, 6) + 'M16.5 24h12M22.5 18c-2 1.6-2.8 3.6-2.8 6s.8 4.4 2.8 6M22.5 18c2 1.6 2.8 3.6 2.8 6s-.8 4.4-2.8 6M16 36h13']],
  plane: [['f', 'M24 3c2 0 3 2.2 3 4.5v10.5l15 8.5v4.5L27 26.5v8.5l5.5 4.2v3.6L24 40.5l-8.5 2.3v-3.6L21 35v-8.5L6 31v-4.5L21 18V7.5C21 5.2 22 3 24 3z']],
  wreath42: [['f', leafArc(24, 26, 15, Math.PI * .45, Math.PI * 1.4, 7, 6, false) + leafArc(24, 26, 15, Math.PI * .55, -Math.PI * .4, 7, 6, true)], ['t', 24, 31, 13, '42']],
  bars: [['f', 'M6 41h6.5v-7H6zM15.5 41H22V28h-6.5zM25 41h6.5V19H25zM34.5 41H41V9h-6.5z'], ['s', 'M37.75 9V3.5l5 1.8-5 1.8M4 44.5h40']],
  summit: [['s', 'M2 42 17 14l6.5 10.5L30 15l16 27z'], ['f', 'M13.2 21 17 14l3.9 7-2.2-1-1.7 2-1.8-2z'], ['s', 'M30 15V5l5 1.8-5 1.8']],
  gauge: [['s', 'M7 34a17 17 0 1 1 34 0M10.5 22.5l2.6 1.6M24 17v3M37.5 22.5l-2.6 1.6M24 34l9-11'], ['f', circ(24, 34, 2.6)], ['t', 24, 44.5, 9, '100']],
  road: [['s', 'M6 45c6-10 15-11 15-19s-4-10-1.5-17M19 45c4-9 11-10 11-19s-3-10-1-17M4 9h40'], ['s', 'M12.5 41l1.5-2M18.5 32.5l.8-2.4M22 22.5l-.2-2.5M23.5 13.5l.2-2'], ['t', 38, 40, 9, '500']],
  barrier: [['s', 'M10 44V18M5 44h10'], ['f', 'M10 19.5 42 11v4.5L10 24z'], ['s', 'M17 18.2v4M24 16.3v4M31 14.4v4M38 12.5v4'], ['s', circ(10, 18, 2.5)]],
  amber: [['f', 'M24 4c-4.5 6-7 9.5-7 13a7 7 0 0 0 14 0c0-3.5-2.5-7-7-13zM12 24c-4 5.3-6 8.5-6 11.5a6 6 0 0 0 12 0c0-3-2-6.2-6-11.5zM36 24c-4 5.3-6 8.5-6 11.5a6 6 0 0 0 12 0c0-3-2-6.2-6-11.5z'], ['s', 'M21 15c0-1.5.8-3 2-4.5M9 33.5c0-1.4.6-2.7 1.6-4M33 33.5c0-1.4.6-2.7 1.6-4']],
  capitals: [['s', 'M4 44h40M6 44V30h7v14M4.8 30v-2.6h1.9v1.4h1.9v-1.4h1.9v1.4h1.9v-1.4h1.9V30'], ['s', 'M20 44V24h8v20M20 24l4-3 4 3'], ['f', 'M22.6 21 24 10l1.4 11z'], ['s', 'M35 44V28h7v16'], ['f', 'M34 28l4.5-9 4.5 9z']],
  suitcase: [['s', 'M6 16h36v26H6zM17 16v-5h14v5M13 16v26M35 16v26'], ['f', circ(20, 27, 3.2) + 'M27 31h5l-2.5-5z' + poly(starPts(24, 37, 3, 1.3, 5))]],
  globe: [['s', circ(24, 24, 15) + 'M9 24h30M24 9c-4 4-6 9-6 15s2 11 6 15M24 9c4 4 6 9 6 15s-2 11-6 15M11 16.5h26M11 31.5h26'], ['s', 'M3 30c6 6 36-1 42-12', 1.5]],
  skylinepin: [['s', 'M3 44h42M5 44V28h6v16M11 44V20h7v24M18 44V30h5v14M27 44V24h6v20M33 44V32h5v12M38 44V26h6v18'], ['f', 'M24 2.5c-4.2 0-7 3-7 6.8 0 4.6 7 11.7 7 11.7s7-7.1 7-11.7c0-3.8-2.8-6.8-7-6.8z'], ['s', circ(24, 9.5, 2.3)]],
  compass: [['s', circ(24, 24, 18) + circ(24, 24, 14)], ['f', poly([[24, 6], [27.5, 20.5], [42, 24], [27.5, 27.5], [24, 42], [20.5, 27.5], [6, 24], [20.5, 20.5]])]],
  route3: [['s', 'M10 30c4-14 20-18 28-8M38 22c2 6 0 12-6 16', 1.2], ['s', 'M10 30c4-14 20-18 28-8M38 22c2 6 0 12-6 16'], ['f', 'M10 21c-3 0-5 2.2-5 5 0 3.4 5 8.5 5 8.5s5-5.1 5-8.5c0-2.8-2-5-5-5zM38 13c-3 0-5 2.2-5 5 0 3.4 5 8.5 5 8.5s5-5.1 5-8.5c0-2.8-2-5-5-5zM32 29c-3 0-5 2.2-5 5 0 3.4 5 8.5 5 8.5s5-5.1 5-8.5c0-2.8-2-5-5-5z']],
  stopwatch: [['s', circ(24, 27, 16) + 'M24 27v-9M24 27l6 4M20 4h8M24 4v7M37.5 12.5l3-3']],
  rocket: [['s', 'M24 3c7 6 9 15 7 25H17c-2-10 0-19 7-25zM17 23l-6 7v6l6-4M31 23l6 7v6l-6-4'], ['s', circ(24, 17, 3)], ['f', 'M19.5 31h9l-1.5 6c-1 3-2 6-3 8-1-2-2-5-3-8z']],
  shoe: [['s', 'M5 33c0-4 2-9 4-12l3 1c3 1 5 1 7-1l3-4c2 4 6 7 11 8 6 1 10 3 10 8v2H5z'], ['s', 'M5 35v4h37v-4M16 22l2 3M20 19l2 3M26 26l3 1'], ['f', 'M5 39h37v2.5H5z']],
  wingshoe: [['s', 'M12 35c0-3 1.5-7 3-9.5l2.5.8c2.5.8 4 .8 5.6-.8l2.4-3.2c1.6 3.2 4.8 5.6 8.8 6.4 4.8.8 8 2.4 8 6.4v1.6H12z'], ['s', 'M12 37v3h30v-3'], ['f', 'M14 24c-4-1-8-4-10-8 4 1 7 1 10 3-3-2-6-5-7-9 4 2 7 4 9 7-1-3-1-6 1-9 1.5 3 2 6 1 9z']],
  flame: [['f', 'M24 3c2 7 10 11 10 22a10 10 0 0 1-20 0c0-5 2-8 5-11 0 4 1.5 6 3 7 0-6 1-12 2-18z'], ['s', 'M24 44a5 5 0 0 1-5-5c0-3 2.5-5 5-8 2.5 3 5 5 5 8a5 5 0 0 1-5 5z']],
  hourglass: [['s', 'M11 4h26M11 44h26M14 4c0 10 10 14 10 20s-10 10-10 20M34 4c0 10-10 14-10 20s10 10 10 20'], ['f', 'M17.5 12h13c-1.5 3-4 5-6.5 6.5-2.5-1.5-5-3.5-6.5-6.5zM15.5 42c1-5 5-8 8.5-9.5 3.5 1.5 7.5 4.5 8.5 9.5z']],
  arrowfast: [['s', 'M4 16h10M2 24h14M4 32h10'], ['f', 'M18 18h14v-8l14 14-14 14v-8H18z']],
  boltc: [['s', circ(24, 24, 19)], ['f', 'M27 5 12 27h10l-3 16 16-23H25z']],
  clock4: [['s', circ(24, 24, 18) + 'M24 24V11M24 24l8 5'], ['s', 'M24 8v2M40 24h-2M24 40v-2M8 24h2M35.3 12.7l-1.4 1.4M35.3 35.3l-1.4-1.4M12.7 35.3l1.4-1.4M12.7 12.7l1.4 1.4'], ['f', circ(24, 24, 2)]],
  trophy: [['s', 'M14 5h20v10c0 7-4 12-10 12s-10-5-10-12zM14 9H7c0 7 3 10 7 10M34 9h7c0 7-3 10-7 10M24 27v7M16 44h16M18 44l2-10h8l2 10'], ['f', poly(starPts(24, 14, 4.5, 2, 5))]],
  comet: [['f', circ(33, 15, 7)], ['s', 'M28 20 6 42M30 23 13 40M25 18 8 35M32 23l-5 9M24 14l-9 4']],
  bullseye: [['s', circ(22, 26, 17) + circ(22, 26, 11) + circ(22, 26, 5)], ['w', 'M22 26 41 7', 2.6], ['s', 'M35 7h6v6M37 4l4 3M44 9l-3-2']],
  hammer: [['f', 'M6 14l12-10 7 7-3 3 3 3-5 5-3-3-3 3z'], ['w', 'M19 21l22 22', 4.5]],
  gears: [['s', gearD(17, 19, 12, 9)], ['s', gearD(32, 32, 9, 7)]],
  calendar: [['s', 'M6 9h36v34H6zM6 17h36M14 4v9M34 4v9'], ['s', 'M11 25l2 2 3.5-4M21 25l2 2 3.5-4M31 25l2 2 3.5-4M11 34l2 2 3.5-4M21 34l2 2 3.5-4M31 34l2 2 3.5-4']],
  podium: [['s', 'M17 44V17h14v27M3 44V26h14M31 30h14v14M2 44h44'], ['t', 24, 31, 11, '1'], ['t', 10, 38, 9, '2'], ['t', 38, 40.5, 9, '3'], ['f', poly(starPts(24, 9, 5, 2.2, 5))]],
  rematch: [['s', 'M38 18A15 15 0 0 0 10 20M10 30a15 15 0 0 0 28-2'], ['f', 'M41 10v11h-11zM7 38V27h11z']],
  infinity: [['w', 'M24 24c-4-5-7-8-11-8a8 8 0 0 0 0 16c4 0 7-3 11-8s7-8 11-8a8 8 0 0 1 0 16c-4 0-7-3-11-8z', 3.2]],
  island: [['s', 'M22 38c.5-9 2-15 5-20M27 18c-3-4.5-9-4.5-13-1.5M27 18c1.5-4.5 7-6 11-3M27 18c-4.5.5-7.5 3.5-8 8M27 18c4.5.5 7.5 3.5 8 8'], ['f', 'M8 40c4-4 10-5 16-5s12 1 16 5z'], ['s', WAVES(44.5, 4, 44, 1.5)]],
  house: [['s', 'M6 24 24 9l18 15M10 21v22h28V21M20 43V31h8v12M30 13V4M30 4h9l-2.5 3 2.5 3H30']],
  crown3: [['f', crownD(10, 12, 2.3)], ['s', 'M10 40h27.6'], ['f', circ(10, 18.9, 2.2) + circ(23.8, 12, 2.2) + circ(37.6, 18.9, 2.2)]],
  medalrun: [['s', circ(24, 28, 11) + 'M18 17 12 4h7l5 9M30 17l6-13h-7l-5 9'], ['f', poly(starPts(24, 28, 6.5, 2.8, 5))]]
};
const BADGE_SHAPE = {
  mile: 'M50 4 90 27v46L50 96 10 73V27z',
  dist: 'M14 10h72v44c0 22-16 34-36 42C30 88 14 76 14 54z',
  place: (() => { const n = 18; let d = ''; for (let i = 0; i <= n * 8; i++) { const t = i / (n * 8) * Math.PI * 2, rr = 44 + 3.4 * Math.cos(t * n); d += (i ? 'L' : 'M') + r2(50 + Math.cos(t) * rr) + ' ' + r2(50 + Math.sin(t) * rr); } return d + 'z'; })(),
  speed: poly(starPts(50, 50, 47, 38, 8, -Math.PI / 2 + Math.PI / 8)),
  grit: 'M18 6h64a6 6 0 0 1 6 6v58c0 4-2 7-6 9L50 96 18 79c-4-2-6-5-6-9V12a6 6 0 0 1 6-6z'
};
const TIERS = { bronze: ['#ffd5ad', '#cd7f3c', '#6b3a12', '#3b1f08'], silver: ['#ffffff', '#c3ccd8', '#5b6676', '#25303d'], gold: ['#fff2b0', '#e8b52c', '#8a5e07', '#3f2a00'] };
const CAT_ACCENT = { mile: '#e4572e', dist: '#1f9d63', place: '#2f6fe0', speed: '#d0342c', grit: '#7b3fbf' };
function badgeSVG(b, locked, k = '') {
  const id = 'b' + hashS(b.id + k).toString(36), shape = BADGE_SHAPE[b.cat];
  if (locked) {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${shape}" fill="var(--lock-bg)" stroke="var(--lock-line)" stroke-width="2.5" stroke-dasharray="5 4"/>` +
      `<text x="50" y="${b.cat === 'dist' ? 63 : 66}" text-anchor="middle" ${F} font-weight="800" font-size="42" fill="var(--lock-ink)">?</text></svg>`;
  }
  const [l, m, d, ink] = TIERS[b.tier], acc = CAT_ACCENT[b.cat];
  const stars = b.tier === 'gold' ? 3 : b.tier === 'silver' ? 2 : 1;
  let st = ''; for (let i = 0; i < stars; i++) st += `<path d="${poly(starPts(50 + (i - (stars - 1) / 2) * 9, b.cat === 'dist' ? 80 : 84, 3.4, 1.5, 5))}" fill="${ink}"/>`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".55" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></linearGradient>
<radialGradient id="${id}s" cx=".3" cy=".22" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".65"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<path d="${shape}" fill="${d}" transform="translate(0 2.5)" opacity=".5"/>
<path d="${shape}" fill="url(#${id}g)" stroke="${d}" stroke-width="2"/>
<path d="${shape}" fill="none" stroke="${acc}" stroke-width="3.2" transform="translate(50 50) scale(.86) translate(-50 -50)"/>
<path d="${shape}" fill="url(#${id}s)"/>
${drawItems(BI[b.icon] || BI.stamp, ink, 24, b.cat === 'dist' ? 19 : 22, 52, 2.4)}${st}</svg>`;
}

W.RPArt = { LM, CITY_LM, inkFor, stamp, badgeSVG, CROWN_ICON, hash: hashS, BI };
})(window);
