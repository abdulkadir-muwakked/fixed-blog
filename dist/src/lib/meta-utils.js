"use strict";
/**
 * @File: src/lib/meta-utils.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const baseDir = './src';
function walkDir(dir, callback) {
    fs_1.default.readdirSync(dir).forEach(file => {
        const fullPath = path_1.default.join(dir, file);
        if (fs_1.default.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, callback);
        }
        else {
            callback(fullPath);
        }
    });
}
function addHeader(filePath) {
    const content = fs_1.default.readFileSync(filePath, 'utf8');
    if (content.trimStart().startsWith('/**'))
        return;
    const relativePath = path_1.default.relative('.', filePath).replace(/\\/g, '/');
    const header = `/**\n * @File: ${relativePath}\n */\n\n`;
    fs_1.default.writeFileSync(filePath, header + content, 'utf8');
    console.log(`✅ Added header to ${relativePath}`);
}
walkDir(baseDir, addHeader);
