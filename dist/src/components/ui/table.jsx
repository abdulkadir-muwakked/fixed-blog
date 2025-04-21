"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRow = exports.TableHeader = exports.TableHead = exports.TableCell = exports.TableBody = exports.Table = void 0;
const react_1 = __importDefault(require("react"));
const Table = ({ children }) => (<table className="min-w-full divide-y divide-gray-200">{children}</table>);
exports.Table = Table;
const TableBody = ({ children }) => (<tbody className="bg-white divide-y divide-gray-200">{children}</tbody>);
exports.TableBody = TableBody;
const TableCell = ({ children }) => (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>);
exports.TableCell = TableCell;
const TableHead = ({ children }) => (<thead className="bg-gray-50">{children}</thead>);
exports.TableHead = TableHead;
const TableHeader = ({ children }) => (<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>);
exports.TableHeader = TableHeader;
const TableRow = ({ children }) => (<tr>{children}</tr>);
exports.TableRow = TableRow;
