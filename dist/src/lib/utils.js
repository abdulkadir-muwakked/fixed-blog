"use strict";
/**
 * @File: src/lib/utils.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = void 0;
exports.cn = cn;
//src/lib/utils
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
const nanoid_1 = require("nanoid");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
// Create a custom ID generator with nanoid
exports.createId = (0, nanoid_1.customAlphabet)("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 12);
