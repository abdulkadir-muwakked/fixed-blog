"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
// تعريف النصوص العربية مباشرة
const arabicText = {
    home: "الرئيسية",
    blog: "المدونة",
    categories: "التصنيفات"
};
function Footer() {
    const currentYear = new Date().getFullYear();
    return (<footer className="w-full border-t bg-background">
      <div className="container flex flex-col md:flex-row md:justify-between py-10">
        <div className="flex flex-col space-y-4 mb-8 md:mb-0">
          <h3 className="text-lg font-semibold">مدونة Next.js</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            مدونة حديثة مبنية بتقنيات Next.js و React و Tailwind CSS،
            تتميز بتصميم أنيق ونظام قوي لإدارة المحتوى.
          </p>
          <div className="flex space-x-4">
            <link_1.default href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <lucide_react_1.Github className="h-5 w-5"/>
              <span className="sr-only">GitHub</span>
            </link_1.default>
            <link_1.default href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <lucide_react_1.Twitter className="h-5 w-5"/>
              <span className="sr-only">Twitter</span>
            </link_1.default>
            <link_1.default href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <lucide_react_1.Linkedin className="h-5 w-5"/>
              <span className="sr-only">LinkedIn</span>
            </link_1.default>
            <link_1.default href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <lucide_react_1.Facebook className="h-5 w-5"/>
              <span className="sr-only">Facebook</span>
            </link_1.default>
            <link_1.default href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <lucide_react_1.Instagram className="h-5 w-5"/>
              <span className="sr-only">Instagram</span>
            </link_1.default>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">تصفح</h4>
            <link_1.default href="/" className="text-sm text-muted-foreground hover:text-primary">{arabicText.home}</link_1.default>
            <link_1.default href="/blog" className="text-sm text-muted-foreground hover:text-primary">{arabicText.blog}</link_1.default>
            <link_1.default href="/categories" className="text-sm text-muted-foreground hover:text-primary">{arabicText.categories}</link_1.default>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">موارد</h4>
            <link_1.default href="/about" className="text-sm text-muted-foreground hover:text-primary">حول المدونة</link_1.default>
            <link_1.default href="/privacy" className="text-sm text-muted-foreground hover:text-primary">سياسة الخصوصية</link_1.default>
            <link_1.default href="/terms" className="text-sm text-muted-foreground hover:text-primary">شروط الاستخدام</link_1.default>
          </div>

          <div className="flex flex-col space-y-2 col-span-2 md:col-span-1">
            <h4 className="font-medium text-sm">اتصل بنا</h4>
            <link_1.default href="mailto:contact@example.com" className="text-sm text-muted-foreground hover:text-primary">
              contact@example.com
            </link_1.default>
            <link_1.default href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-primary">
              +1 (234) 567-890
            </link_1.default>
          </div>
        </div>
      </div>

      <div className="container border-t py-6">
        <p className="text-sm text-center text-muted-foreground">
          © {currentYear} مدونة Next.js. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>);
}
