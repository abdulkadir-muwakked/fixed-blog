"use strict";
'use client';
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
exports.default = SocialShare;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const next_intl_1 = require("next-intl");
function SocialShare({ title, slug }) {
    const t = (0, next_intl_1.useTranslations)('common');
    const locale = (0, next_intl_1.useLocale)();
    const [copied, setCopied] = (0, react_1.useState)(false);
    // Get the base URL (we're using a simple approach here - in production you'd want to use environment variables)
    const baseUrl = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}`
        : '';
    const url = `${baseUrl}/${locale}/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    };
    const copyToClipboard = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error('Failed to copy:', err);
        }
    });
    return (<div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">{t('share')}:</span>

      <button_1.Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(shareUrls.twitter, '_blank')} aria-label="Share on Twitter">
        <lucide_react_1.Twitter className="h-4 w-4"/>
      </button_1.Button>

      <button_1.Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(shareUrls.facebook, '_blank')} aria-label="Share on Facebook">
        <lucide_react_1.Facebook className="h-4 w-4"/>
      </button_1.Button>

      <button_1.Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(shareUrls.linkedin, '_blank')} aria-label="Share on LinkedIn">
        <lucide_react_1.Linkedin className="h-4 w-4"/>
      </button_1.Button>

      <button_1.Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={copyToClipboard} aria-label="Copy link">
        {copied ? <lucide_react_1.Check className="h-4 w-4 text-green-500"/> : <lucide_react_1.Link2 className="h-4 w-4"/>}
      </button_1.Button>
    </div>);
}
