import fs from 'fs';
import path from 'path';

const baseDir = './src';
const fileExt = '.ts';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      if (path.extname(fullPath) === fileExt) {
        callback(fullPath);
      }
    }
  });
}

function addHeader(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if header already exists
  if (content.startsWith('/**')) return;

  const relativePath = path.relative('.', filePath).replace(/\\/g, '/');
  const header = `/**\n * @File: ${relativePath}\n */\n\n`;

  fs.writeFileSync(filePath, header + content, 'utf8');
  console.log(`✅ Added header to ${relativePath}`);
}

walkDir(baseDir, addHeader);
