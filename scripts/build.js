// Builds index.html, the standalone page GitHub Pages serves, from season-desk.html.
// season-desk.html is written for the Claude artifact viewer, which supplies the
// document skeleton itself; this adds the doctype, <head> and <body>.
//   node scripts/build.js          write index.html
//   node scripts/build.js --check  fail if index.html is out of date
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'season-desk.html'), 'utf8');
const split = source.indexOf('<main>');
if (split < 0) throw new Error('season-desk.html has no <main> element to split on');

const page = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  '<!-- Generated from season-desk.html by scripts/build.js. Edit that file, then run: npm run build -->',
  source.slice(0, split).trim(),
  '</head>',
  '<body>',
  source.slice(split).trim(),
  '</body>',
  '</html>',
  '',
].join('\n');

const target = path.join(root, 'index.html');
if (process.argv.includes('--check')) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== page) {
    console.error('index.html is out of date. Run: npm run build');
    process.exit(1);
  }
  console.log('index.html is up to date.');
} else {
  fs.writeFileSync(target, page);
  console.log('Wrote index.html (' + Math.round(page.length / 1024) + ' KB).');
}
