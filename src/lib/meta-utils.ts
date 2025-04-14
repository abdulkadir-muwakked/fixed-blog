/**
 * @File: src/lib/meta-utils.ts
 */

import fs from 'fs';
import path from 'path';

const baseDir = './src';

function walkDir(dir: string, callback: (filePath: string) => void): void {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function addHeader(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');

  if (content.trimStart().startsWith('/**')) return;

  const relativePath = path.relative('.', filePath).replace(/\\/g, '/');
  const header = `/**\n * @File: ${relativePath}\n */\n\n`;

  fs.writeFileSync(filePath, header + content, 'utf8');
  console.log(`✅ Added header to ${relativePath}`);
}

walkDir(baseDir, addHeader);
