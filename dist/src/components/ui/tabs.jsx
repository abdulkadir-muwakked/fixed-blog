"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsContent = exports.TabsTrigger = exports.TabsList = exports.Tabs = void 0;
const react_1 = __importDefault(require("react"));
const Tabs = ({ children }) => (<div className="tabs">{children}</div>);
exports.Tabs = Tabs;
const TabsList = ({ children }) => (<div className="tabs-list flex space-x-2">{children}</div>);
exports.TabsList = TabsList;
const TabsTrigger = ({ children, onClick, }) => (<button className="tabs-trigger px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300" onClick={onClick}>
    {children}
  </button>);
exports.TabsTrigger = TabsTrigger;
const TabsContent = ({ children }) => (<div className="tabs-content mt-4">{children}</div>);
exports.TabsContent = TabsContent;
