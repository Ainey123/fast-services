import fs from 'fs';

const xml = fs.readFileSync('scripts/docx_temp/word/document.xml', 'utf8');

// Parse paragraphs and tables
const paragraphs = xml.split('</w:p>').map(p => {
  const cleaned = p
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .trim();
  return cleaned;
}).filter(p => p.length > 0);

fs.writeFileSync('scripts/parsed-profile.md', paragraphs.join('\n\n'));
console.log(`Extracted ${paragraphs.length} paragraphs into scripts/parsed-profile.md`);
