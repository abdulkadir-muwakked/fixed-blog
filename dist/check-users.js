"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// check-users.js
const index_js_1 = require("./src/lib/db/index.js");
const schema_js_1 = require("./src/lib/db/schema.js");
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield index_js_1.db.select().from(schema_js_1.users);
            console.log(result);
        }
        catch (error) {
            console.error("Error fetching users:", error);
        }
    });
}
check();
