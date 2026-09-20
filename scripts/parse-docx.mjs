import fs from 'fs';
import { execSync } from 'child_process';

// Let's unzip word/document.xml to a temp dir and parse it
const extractDir = 'scripts/docx_temp';
if (!fs.existsSync(extractDir)) {
  fs.mkdirSync(extractDir, { recursive: true });
}

try {
  execSync(`tar -xf "src/Updated Profile FES final (1).docx" -C "${extractDir}"`);
  const xml = fs.readFileSync(`${extractDir}/word/document.xml`, 'utf8');

  // Parse paragraphs
  const paragraphs = xml.split('</w:p>').map(p => {
    // Strip tags
    const cleaned = p.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCharCode(parseInt(h, 16))).trim();
    return cleaned;
  }).filter(p => p.length > 0);

  const markdown = paragraphs.join('\n\n');
  fs.writeFileSync('scripts/parsed-profile.md', markdown);
  console.log(`Parsed ${paragraphs.length} paragraphs into scripts/parsed-profile.md (${markdown.length} bytes)`);
} catch (e) {
  console.error('Error parsing docx:', e);
}
