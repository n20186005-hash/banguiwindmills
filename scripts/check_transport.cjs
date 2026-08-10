const fs = require('fs');
const langs = ['km', 'en', 'zh'];
for (const l of langs) {
  const h = fs.readFileSync('dist/' + l + '/index.html', 'utf8');
  const i = h.indexOf('From the Airport');
  const zh = h.indexOf('从机场出发');
  const km = h.indexOf('ពីអាកាសយានដ្ឋាន');
  const start = Math.max(i, zh, km);
  const end = h.indexOf('Public Transport', start);
  const end2 = h.indexOf('ធ្វើដំណើរសាធារណៈ', start);
  const end3 = h.indexOf('公共交通', start);
  const stop = Math.min(...[end, end2, end3].filter(x => x > start));
  const seg = h.slice(start, stop > start ? stop : start + 3000);
  // count list items by a simple heuristic: occurrences of the step text markers
  const steps = [
    'official taxi counter', 'ride-hailing app', 'local currency', '30',
    'city bus lines'
  ];
  const found = steps.filter(s => seg.includes(s)).length;
  console.log(l, 'airport block chars:', seg.length, 'core-step markers found:', found, '/5');
}
