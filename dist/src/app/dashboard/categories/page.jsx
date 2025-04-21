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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoriesPage;
const next_auth_1 = require("next-auth");
const navigation_1 = require("next/navigation");
const config_1 = require("@/lib/auth/config");
const dashboard_nav_1 = __importDefault(require("@/components/dashboard/dashboard-nav"));
const dashboard_shell_1 = __importDefault(require("@/components/dashboard/dashboard-shell"));
const dashboard_header_1 = __importDefault(require("@/components/dashboard/dashboard-header"));
const category_manager_1 = __importDefault(require("@/components/dashboard/category-manager"));
const toaster_1 = require("@/components/ui/toaster");
const db_1 = require("@/lib/db");
function CategoriesPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
        if (!session) {
            (0, navigation_1.redirect)("/login?callbackUrl=/dashboard/categories");
        }
        // Fetch categories from the database
        const categories = yield (0, db_1.fetchCategories)();
        return (<dashboard_shell_1.default>
      <dashboard_nav_1.default />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <dashboard_header_1.default heading="Categories" text="Manage blog categories"/>

        <div className="grid gap-4">
          <category_manager_1.default categories={categories}/>
        </div>

        <toaster_1.Toaster />
      </div>
    </dashboard_shell_1.default>);
    });
}
