"use strict";
/**
 * @File: src/app/api/auth/[...nextauth]/route.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const next_auth_1 = __importDefault(require("next-auth"));
const config_1 = require("@/lib/auth/config");
const handler = (0, next_auth_1.default)(config_1.authOptions);
exports.GET = handler;
exports.POST = handler;
