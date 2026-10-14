// Assembles stardust/prototypes/en-services-html-proposed.html from hand-authored parts:
// head + chrome copied from en-html-proposed.html (adapted) + notes/en-services-html-content.html + footer.
// Inlines the live SVG icons harvested from the DOM (never redrawn) and the two hidden garage-chooser lists
// (data lifted from the captured HTML; markup ours).
import fs from 'node:fs';
const N = 'stardust/replica/notes/';
const svgs = JSON.parse(fs.readFileSync(N + 'en-services-html-live-svgs.json', 'utf8'));
const captured = fs.readFileSync('stardust/current/pages/en-services-html.html', 'utf8');
function garages(hrefPrefix) {
  const re = new RegExp('<a href="(' + hrefPrefix + '[^"]*)"[^>]*class="text-decoration-none">\\s*<div class="amag-garageOverlay__garageList--garageInfo">\\s*<p class="amag-garageOverlay__garageList--garageName">([^<]*)</p>\\s*<p class="amag-garageOverlay__garageList--garageStreet">([^<]*)</p>\\s*<p class="amag-garageOverlay__garageList--garagePlace">([^<]*)</p>', 'g');
  const out = []; let m, i = 0;
  while ((m = re.exec(captured))) { out.push(`<div class="amag-garageOverlay__garageList--garage d-block col-sm-12" style="background-color: ${i % 2 ? 'white' : 'rgb(245, 245, 245)'};">\n<a class="text-decoration-none" href="${m[1]}">\n<div class="amag-garageOverlay__garageList--garageInfo">\n<p class="amag-garageOverlay__garageList--garageName">${m[2]}</p>\n<p class="amag-garageOverlay__garageList--garageStreet">${m[3]}</p>\n<p class="amag-garageOverlay__garageList--garagePlace">${m[4]}</p>\n</div>\n</a>\n</div>`); i++; }
  return { html: out.join('\n'), n: out.length };
}
const otv = garages('/en/services/otv.html#'), dealers = garages('/en/car-dealers/');
let content = fs.readFileSync(N + 'en-services-html-content.html', 'utf8')
  .replace(/<!--SVG:(\d+)-->/g, (_, i) => svgs[+i].html)
  .replace('<!--GARAGES:otv-->', otv.html)
  .replace('<!--GARAGES:dealers-->', dealers.html);
const head = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>All vehicle services at a glance | AMAG</title>
<meta name="description" content="Whether repair, roadside assistance or wheel change: at AMAG your car is in the best hands. Discover all services and arrange an appointment at your garage.">
<link rel="icon" href="assets/favicon.svg">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/en-services-html.css">
</head>
<body>
`;
const header = fs.readFileSync(N + 'en-services-html-chrome-header.html', 'utf8');
const footer = fs.readFileSync(N + 'en-services-html-chrome-footer.html', 'utf8');
const tail = `<script src="js/canon.js"></script>
<script src="js/en-services-html.js"></script>
</body>
</html>
`;
const out = head + header + content + footer + tail;
fs.writeFileSync('stardust/prototypes/en-services-html-proposed.html', out);
const bad = out.match(/(src|href|srcset)="[^"]*(amag\.ch|amag-group\.ch)[^"]*"/g) || [];
console.log('written', out.length, 'chars; garages otv', otv.n, 'dealers', dealers.n, '; remote asset refs (src/srcset only matter):', bad.filter(b => !b.startsWith('href')).length, bad.filter(b => !b.startsWith('href')).slice(0, 5));
