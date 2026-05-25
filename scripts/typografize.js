const fs = require('node:fs');
const path = require('node:path');
const { parseDocument } = require('htmlparser2');
const Typograf = require('typograf');

const inputArg = process.argv[2];

if (!inputArg) {
  console.error('Usage: node scripts/typografize.js <html-file>');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), inputArg);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
const tp = new Typograf({ locale: ['ru', 'en-US'] });

tp.enableRule('common/nbsp/*');
tp.enableRule('ru/space/afterPunctuation');
tp.enableRule('ru/space/year');
tp.enableRule('ru/space/centuries');
tp.enableRule('ru/space/month');
tp.enableRule('ru/typo/quotation');
tp.enableRule('common/punctuation/hellip');
tp.enableRule('common/punctuation/mdash');
tp.disableRule('ru/optalign/*');

const document = parseDocument(html, {
  decodeEntities: false,
  withStartIndices: true,
  withEndIndices: true
});

function shouldSkipTextNode(node, parentTag) {
  if (!node || node.type !== 'text') return true;
  if (!node.data || !node.data.trim()) return true;
  return ['script', 'style'].includes(parentTag);
}

function collectTextNodes(nodes, parentTag, replacements) {
  if (!nodes) return;

  for (const node of nodes) {
    const tagName = node.type === 'tag' || node.type === 'script' || node.type === 'style'
      ? node.name
      : parentTag;

    if (!shouldSkipTextNode(node, parentTag) && Number.isInteger(node.startIndex) && Number.isInteger(node.endIndex)) {
      const original = node.data;
      const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const leading = match ? match[1] : '';
      const core = match ? match[2] : original;
      const trailing = match ? match[3] : '';
      const formattedCore = tp.execute(core);
      const formatted = `${leading}${formattedCore}${trailing}`;

      if (formatted !== original) {
        replacements.push({
          start: node.startIndex,
          end: node.endIndex + 1,
          value: formatted
        });
      }
    }

    if (node.children && node.children.length) {
      collectTextNodes(node.children, tagName, replacements);
    }
  }
}

const replacements = [];
collectTextNodes(document.children, '', replacements);

let output = html;
for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
  output = output.slice(0, replacement.start) + replacement.value + output.slice(replacement.end);
}

fs.writeFileSync(filePath, output, 'utf8');
console.log(`Typografized: ${path.relative(process.cwd(), filePath)}`);
