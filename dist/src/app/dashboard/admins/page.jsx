"use strict";
"use client";
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
exports.default = AdminsPage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const sonner_1 = require("sonner");
const dialog_1 = require("@/components/ui/dialog");
const table_1 = require("@/components/ui/table");
const navigation_1 = require("next/navigation");
const react_2 = require("next-auth/react");
const avatar_1 = require("@/components/ui/avatar");
const lucide_react_1 = require("lucide-react");
const dashboard_shell_1 = __importDefault(require("@/components/dashboard/dashboard-shell"));
function AdminsPage() {
    const router = (0, navigation_1.useRouter)();
    const { data: session } = (0, react_2.useSession)();
    const [admins, setAdmins] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [showAddAdminDialog, setShowAddAdminDialog] = (0, react_1.useState)(false);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    // Load admins on component mount
    (0, react_1.useEffect)(() => {
        fetchAdmins();
    }, []);
    const fetchAdmins = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setIsLoading(true);
            const response = yield fetch("/api/users/admins");
            if (!response.ok) {
                throw new Error("Failed to fetch admin users");
            }
            const data = yield response.json();
            setAdmins(data.admins);
        }
        catch (error) {
            console.error("Error fetching admins:", error);
            sonner_1.toast.error("Failed to load admin users");
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // Validation
        if (formData.password !== formData.confirmPassword) {
            sonner_1.toast.error("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            sonner_1.toast.error("Password must be at least 8 characters");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = yield fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: "ADMIN",
                }),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to create admin user");
            }
            sonner_1.toast.success("Admin user created successfully");
            setShowAddAdminDialog(false);
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
            // Refresh admin list
            fetchAdmins();
        }
        catch (error) {
            console.error("Error creating admin:", error);
            sonner_1.toast.error(error instanceof Error ? error.message : "Failed to create admin user");
        }
        finally {
            setIsSubmitting(false);
        }
    });
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };
    return (<dashboard_shell_1.default>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin Users</h1>
        <button_1.Button onClick={() => setShowAddAdminDialog(true)}>
          <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
          Add Admin
        </button_1.Button>
      </div>

      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>All Administrators</card_1.CardTitle>
          <card_1.CardDescription>
            Manage users with administrative access to the dashboard.
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          {isLoading ? (<div className="flex justify-center py-8">
              <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
            </div>) : admins.length === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-center">
              <lucide_react_1.User className="h-10 w-10 text-muted-foreground/60 mb-2"/>
              <p className="text-muted-foreground">No admin users found.</p>
              <button_1.Button variant="outline" className="mt-4" onClick={() => setShowAddAdminDialog(true)}>
                <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                Add your first admin
              </button_1.Button>
            </div>) : (<div className="rounded-md border">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Name</table_1.TableHead>
                    <table_1.TableHead>Email</table_1.TableHead>
                    <table_1.TableHead>Added On</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {admins.map((admin) => (<table_1.TableRow key={admin.id}>
                      <table_1.TableCell className="font-medium flex items-center">
                        <avatar_1.Avatar className="h-8 w-8 mr-2">
                          <avatar_1.AvatarImage src={admin.image || ""} alt={admin.name}/>
                          <avatar_1.AvatarFallback>{getInitials(admin.name)}</avatar_1.AvatarFallback>
                        </avatar_1.Avatar>
                        {admin.name}
                        {admin.id === (session === null || session === void 0 ? void 0 : session.user.id) && (<span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                            You
                          </span>)}
                      </table_1.TableCell>
                      <table_1.TableCell>{admin.email}</table_1.TableCell>
                      <table_1.TableCell>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </table_1.TableCell>
                    </table_1.TableRow>))}
                </table_1.TableBody>
              </table_1.Table>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Add Admin Dialog */}
      <dialog_1.Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Add New Admin</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Create a new user with administrative privileges.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label_1.Label htmlFor="name">Name</label_1.Label>
                <input_1.Input id="name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} disabled={isSubmitting}/>
              </div>
              <div className="grid gap-2">
                <label_1.Label htmlFor="email">Email</label_1.Label>
                <input_1.Input id="email" name="email" placeholder="admin@example.com" required type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting}/>
              </div>
              <div className="grid gap-2">
                <label_1.Label htmlFor="password">Password</label_1.Label>
                <input_1.Input id="password" name="password" required type="password" value={formData.password} onChange={handleChange} disabled={isSubmitting}/>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div className="grid gap-2">
                <label_1.Label htmlFor="confirmPassword">Confirm Password</label_1.Label>
                <input_1.Input id="confirmPassword" name="confirmPassword" required type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting}/>
              </div>
            </div>
            <dialog_1.DialogFooter>
              <button_1.Button type="button" variant="outline" onClick={() => setShowAddAdminDialog(false)} disabled={isSubmitting}>
                Cancel
              </button_1.Button>
              <button_1.Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Admin"}
              </button_1.Button>
            </dialog_1.DialogFooter>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </dashboard_shell_1.default>);
}
