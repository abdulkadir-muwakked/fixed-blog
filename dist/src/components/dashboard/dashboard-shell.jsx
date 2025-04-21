"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardShell;
function DashboardShell({ children }) {
    return (<div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {children}
      </div>
    </div>);
}
