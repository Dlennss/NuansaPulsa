import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("public/service-icons-nuansa");
fs.mkdirSync(outDir, { recursive: true });

const services = {
  "pulsa": "phone",
  "paket-data": "arrows",
  "hp-pascabayar": "call",
  "esim-roaming": "sim",
  "ewallet": "wallet",
  "transfer-bank": "bank",
  "qris": "qr",
  "uang-elektronik": "tapcard",
  "kartu-kredit": "cards",
  "asuransi": "shield",
  "bpjs": "bpjs",
  "token-pln": "bolt",
  "pdam": "drop",
  "gas-pgn": "flame",
  "internet-wifi": "router",
  "tv-kabel": "tv",
  "voucher-game": "game",
  "voucher-digital": "ticket",
  "streaming-musik": "headphone",
  "klinik-kesehatan": "health",
  "uang-sekolah": "school",
  "cicilan-kendaraan": "car",
  "cicilan-multifinance": "cycle",
  "pbb": "house",
  "pajak-negara": "gov",
  "tiket-perjalanan": "plane",
  "saldo-kartu-tol": "tol",
  "parkir-digital": "parking",
  "kurir-pengiriman": "truck",
  "zakat-donasi": "donate",
  "lainnya": "dots",
};

function shape(type) {
  const red = "url(#red)";
  const orange = "url(#orange)";
  const blue = "url(#blue)";
  const dark = "#111827";

  const shapes = {
    phone: `<rect x="42" y="31" width="45" height="66" rx="9" fill="${red}"/><rect x="51" y="41" width="27" height="40" rx="4" fill="#fff8f3"/><path d="M54 75v-8m8 8V57m8 18V49" stroke="${orange}" stroke-width="6" stroke-linecap="round"/><circle cx="84" cy="83" r="16" fill="${red}" stroke="#fff" stroke-width="4"/><text x="84" y="89" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">Rp</text>`,
    arrows: `<path d="M51 91V45M51 45L33 64M51 45l18 19" stroke="${orange}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M81 37v46M81 83L63 64M81 83l18-19" stroke="${red}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`,
    call: `<path d="M45 39c8-7 15-4 20 4l4 8c3 5 1 10-4 13l-4 3c8 12 15 19 27 26l4-5c4-5 9-6 14-2l8 6c7 5 8 13 2 20-9 10-24 8-43-5-17-12-31-27-38-45-5-11-2-19 10-23z" fill="${red}"/><path d="M91 42c12 4 20 13 23 25M87 56c6 2 10 6 12 12" stroke="${orange}" stroke-width="7" stroke-linecap="round" fill="none"/>`,
    sim: `<path d="M50 29h45l22 23v55a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10V39a10 10 0 0 1 10-10z" fill="${red}"/><path d="M61 56h36v35H61z" fill="${orange}"/><path d="M73 56v35M85 56v35M61 68h36M61 80h36" stroke="#ff5a00" stroke-width="4"/><circle cx="103" cy="91" r="18" fill="${red}" stroke="#fff" stroke-width="4"/><path d="M89 91h28M103 75c8 8 8 24 0 32M103 75c-8 8-8 24 0 32" stroke="#fff" stroke-width="4" fill="none"/>`,
    wallet: `<path d="M35 55h76a12 12 0 0 1 12 12v35a12 12 0 0 1-12 12H35a12 12 0 0 1-12-12V61a6 6 0 0 1 12-6z" fill="${red}"/><path d="M41 48l51-16 12 23H43z" fill="${orange}"/><rect x="86" y="75" width="34" height="24" rx="8" fill="#c90818"/><circle cx="100" cy="87" r="6" fill="#fff"/>`,
    bank: `<path d="M30 58h84L72 29z" fill="${red}"/><circle cx="72" cy="48" r="9" fill="${orange}"/><text x="72" y="52" text-anchor="middle" font-size="10" font-weight="900" fill="#d70717">Rp</text><path d="M38 62h68v10H38zm5 11h10v31H43zm20 0h10v31H63zm20 0h10v31H83zm20 0h10v31h-10zM34 104h76v12H34z" fill="${orange}"/>`,
    qr: `<rect x="38" y="38" width="21" height="21" fill="none" stroke="${dark}" stroke-width="6"/><rect x="85" y="38" width="21" height="21" fill="none" stroke="${dark}" stroke-width="6"/><rect x="38" y="85" width="21" height="21" fill="none" stroke="${dark}" stroke-width="6"/><path d="M73 40h8v20H69V48h4zm-1 32h15v9H72zm22 0h13v13H94zm-22 22h9v13h-9zm18 0h19v8H99v9h-9z" fill="${dark}"/><path d="M26 45v-9a10 10 0 0 1 10-10h9M99 26h9a10 10 0 0 1 10 10v9M118 99v9a10 10 0 0 1-10 10h-9M45 118h-9a10 10 0 0 1-10-10v-9" stroke="${orange}" stroke-width="7" stroke-linecap="round" fill="none"/>`,
    tapcard: `<rect x="35" y="48" width="76" height="50" rx="9" fill="${red}" transform="rotate(-10 73 73)"/><rect x="43" y="63" width="20" height="15" rx="3" fill="${orange}" transform="rotate(-10 53 70)"/><text x="56" y="88" font-size="19" font-weight="900" fill="#fff">Rp</text><path d="M96 57c8 8 10 18 5 30M108 52c12 13 16 28 8 44" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>`,
    cards: `<rect x="33" y="49" width="72" height="48" rx="9" fill="${red}" transform="rotate(-13 69 73)"/><rect x="43" y="60" width="72" height="48" rx="9" fill="${orange}"/><rect x="43" y="66" width="72" height="9" fill="#ff4d00"/><circle cx="88" cy="92" r="8" fill="#ff5a00"/><circle cx="100" cy="92" r="8" fill="#f7b500"/>`,
    shield: `<path d="M72 28l42 15v30c0 25-17 42-42 53-25-11-42-28-42-53V43z" fill="${red}"/><path d="M53 73l13 13 28-31" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 93c26 18 60 18 88-18" stroke="${orange}" stroke-width="7" stroke-linecap="round" fill="none"/>`,
    bpjs: `<circle cx="76" cy="47" r="15" fill="${red}"/><circle cx="51" cy="65" r="12" fill="${orange}"/><path d="M38 107c4-23 20-36 39-36s35 13 39 36z" fill="${red}"/><path d="M74 80v28M60 94h28" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`,
    bolt: `<path d="M80 22L39 77h29l-8 45 43-58H74z" fill="${orange}"/><path d="M80 22L72 65h31l-43 57 8-45H39z" fill="${red}" opacity=".72"/>`,
    drop: `<path d="M72 23c21 25 35 47 35 66 0 23-15 36-35 36S37 112 37 89c0-19 14-41 35-66z" fill="${blue}"/><path d="M56 88c-2 16 7 25 22 25" stroke="#8ee8ff" stroke-width="7" stroke-linecap="round" fill="none"/>`,
    flame: `<path d="M77 126c25-11 39-31 33-55-5-21-22-30-31-50-16 15-10 29-21 42-9 11-22 20-22 38 0 15 13 24 41 25z" fill="${red}"/><path d="M73 113c14-6 23-17 20-30-2-12-11-17-16-29-9 10-7 18-14 26-6 7-13 13-13 24 0 9 8 14 23 9z" fill="${orange}"/>`,
    router: `<rect x="36" y="78" width="72" height="26" rx="10" fill="${red}"/><circle cx="85" cy="91" r="4" fill="${orange}"/><circle cx="98" cy="91" r="4" fill="#fff"/><path d="M50 68c12-12 32-12 44 0M38 54c19-20 49-20 68 0M62 75c6-5 14-5 20 0" stroke="${orange}" stroke-width="8" stroke-linecap="round" fill="none"/>`,
    tv: `<rect x="35" y="51" width="77" height="52" rx="12" fill="${red}"/><path d="M64 65l27 15-27 15z" fill="#fff"/><path d="M59 42l-12-15M85 42l12-15" stroke="${orange}" stroke-width="5" stroke-linecap="round"/>`,
    game: `<path d="M39 70c3-15 10-21 23-16 5 2 16 2 21 0 13-5 20 1 23 16l7 30c2 10-8 18-17 12l-15-11H63l-15 11c-9 6-19-2-17-12z" fill="${red}"/><path d="M54 76h18M63 67v18" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="91" cy="75" r="5" fill="${orange}"/><circle cx="101" cy="85" r="5" fill="#fff"/>`,
    ticket: `<path d="M34 60h76v15a12 12 0 0 0 0 24v15H34V99a12 12 0 0 0 0-24z" fill="${red}"/><text x="72" y="92" text-anchor="middle" font-size="34" font-weight="900" fill="#fff">%</text><path d="M54 60l36-16h22l-12 16z" fill="${orange}"/>`,
    headphone: `<circle cx="72" cy="76" r="34" fill="#fff" stroke="${red}" stroke-width="9"/><rect x="30" y="72" width="18" height="33" rx="8" fill="${orange}"/><rect x="96" y="72" width="18" height="33" rx="8" fill="${orange}"/><path d="M65 61l25 16-25 16z" fill="${red}"/>`,
    health: `<path d="M72 110s-38-22-38-52c0-15 10-25 24-25 8 0 13 4 14 8 1-4 7-8 14-8 14 0 24 10 24 25 0 30-38 52-38 52z" fill="${red}"/><path d="M42 78h21l7-17 10 32 8-15h16" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 45c-13 15-13 42 5 56" stroke="${orange}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    school: `<path d="M24 57l48-27 48 27-48 27z" fill="${red}"/><path d="M45 77v28c18 12 36 12 54 0V77L72 92z" fill="${orange}"/><path d="M110 62v30" stroke="#ffb000" stroke-width="5" stroke-linecap="round"/>`,
    car: `<path d="M35 77l10-24h54l10 24z" fill="${red}"/><rect x="28" y="74" width="88" height="30" rx="11" fill="${red}"/><path d="M51 59h42l6 16H45z" fill="#1f2937"/><circle cx="50" cy="106" r="8" fill="${dark}"/><circle cx="94" cy="106" r="8" fill="${dark}"/><rect x="37" y="85" width="18" height="7" rx="3" fill="#fff"/><rect x="89" y="85" width="18" height="7" rx="3" fill="#fff"/>`,
    cycle: `<circle cx="78" cy="70" r="24" fill="${red}"/><text x="78" y="79" text-anchor="middle" font-size="29" font-weight="900" fill="#fff">Rp</text><path d="M49 50a43 43 0 0 1 62 5l8 8M95 115a43 43 0 0 1-63-7l-7-9" stroke="${orange}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M117 44v22H95M27 121V99h23" stroke="${orange}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    house: `<path d="M27 70l45-39 45 39" fill="none" stroke="${red}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 68v46h62V68" fill="#fff4e7" stroke="${orange}" stroke-width="7"/><rect x="64" y="85" width="16" height="29" rx="3" fill="${red}"/>`,
    gov: `<path d="M30 57h84L72 30z" fill="${red}"/><path d="M40 64h64v10H40zm3 12h12v30H43zm23 0h12v30H66zm23 0h12v30H89zM34 106h76v10H34z" fill="${orange}"/><circle cx="72" cy="46" r="8" fill="#ffde43"/>`,
    plane: `<path d="M31 81l82-45c6-3 12 4 8 10L78 111l-12-35-35 5z" fill="${red}"/><path d="M77 111l-8-34 31-24-40 19z" fill="${orange}" opacity=".95"/>`,
    tol: `<rect x="30" y="49" width="87" height="51" rx="10" fill="${red}" transform="rotate(-8 73 75)"/><path d="M45 73h50" stroke="${orange}" stroke-width="10"/><text x="72" y="85" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">TOL</text>`,
    parking: `<rect x="49" y="32" width="47" height="55" rx="10" fill="${blue}"/><text x="73" y="69" text-anchor="middle" font-size="42" font-weight="900" fill="#fff">P</text><path d="M79 95h17" stroke="${red}" stroke-width="10" stroke-linecap="round"/><circle cx="60" cy="106" r="7" fill="${dark}"/><circle cx="101" cy="106" r="7" fill="${dark}"/><path d="M49 94h50l12 12H37z" fill="${red}"/>`,
    truck: `<path d="M28 62h55v34H28z" fill="${red}"/><path d="M83 72h20l13 13v11H83z" fill="${orange}"/><circle cx="48" cy="101" r="8" fill="${dark}"/><circle cx="99" cy="101" r="8" fill="${dark}"/><path d="M31 52h42" stroke="${orange}" stroke-width="7" stroke-linecap="round"/>`,
    donate: `<path d="M72 72s-22-13-22-30c0-9 6-15 14-15 4 0 7 2 8 5 2-3 5-5 9-5 8 0 14 6 14 15 0 17-23 30-23 30z" fill="${red}"/><path d="M43 89c11-13 24-12 34-4l7 6M101 89c-11-13-24-12-34-4l-7 6" stroke="${orange}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M43 102c20 16 38 16 58 0" stroke="${red}" stroke-width="8" stroke-linecap="round" fill="none"/>`,
    dots: `<circle cx="50" cy="50" r="10" fill="${red}"/><circle cx="94" cy="50" r="10" fill="${orange}"/><circle cx="50" cy="94" r="10" fill="${orange}"/><circle cx="94" cy="94" r="10" fill="${red}"/>`,
  };

  return shapes[type] || shapes.dots;
}

function render(type) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144" role="img">
  <defs>
    <linearGradient id="red" x1="25" y1="18" x2="118" y2="126"><stop stop-color="#ff5a00"/><stop offset=".45" stop-color="#ff161f"/><stop offset="1" stop-color="#d70717"/></linearGradient>
    <linearGradient id="orange" x1="24" y1="22" x2="116" y2="124"><stop stop-color="#ffe048"/><stop offset=".5" stop-color="#ffb000"/><stop offset="1" stop-color="#ff6a00"/></linearGradient>
    <linearGradient id="blue" x1="24" y1="22" x2="116" y2="124"><stop stop-color="#42e6ff"/><stop offset=".5" stop-color="#0ea5e9"/><stop offset="1" stop-color="#2563eb"/></linearGradient>
    <filter id="shadow" x="-25%" y="-20%" width="150%" height="155%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#64748b" flood-opacity=".25"/></filter>
  </defs>
  <rect x="16" y="14" width="112" height="112" rx="29" fill="#fff" filter="url(#shadow)"/>
  <rect x="20" y="18" width="104" height="104" rx="26" fill="none" stroke="#edf2f7" stroke-width="3"/>
  <g>${shape(type)}</g>
</svg>
`;
}

for (const [slug, type] of Object.entries(services)) {
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), render(type));
}

console.log(`Generated ${Object.keys(services).length} NuansaPulsa service icons.`);
