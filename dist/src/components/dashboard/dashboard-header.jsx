"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardHeader;
function DashboardHeader({ heading, text, children, }) {
    return (<div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>);
}
