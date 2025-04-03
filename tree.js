import fs from 'fs';
import path from 'path';


const ignore = ['node_modules', '.next', '.git'];
const maxDepth = 3;

function buildTree(dir, depth = 0, prefix = '') {
  if (depth > maxDepth) return;
  
  const items = fs.readdirSync(dir)
    .filter(item => !ignore.includes(item))
    .sort((a, b) => {
      const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
      const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
      return bIsDir - aIsDir; // المجلدات أولاً
    });

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    console.log(prefix + (isLast ? '└── ' : '├── ') + item);
    
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      buildTree(fullPath, depth + 1, prefix + (isLast ? '    ' : '│   '));
    }
  });
}
//node tree.js

buildTree('.');