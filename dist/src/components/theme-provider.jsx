"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
exports.ThemeProvider = ThemeProvider;
const react_1 = require("react");
const initialState = {
    theme: "system",
    setTheme: () => null,
};
const ThemeProviderContext = (0, react_1.createContext)(initialState);
function ThemeProvider({ children, defaultTheme = "system", enableSystem = true, attribute = "data-theme", disableTransitionOnChange = false, }) {
    const [theme, setTheme] = (0, react_1.useState)(defaultTheme);
    (0, react_1.useEffect)(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system" && enableSystem) {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            root.setAttribute(attribute, systemTheme);
            return;
        }
        root.classList.add(theme);
        root.setAttribute(attribute, theme);
    }, [theme, attribute, enableSystem]);
    const value = {
        theme,
        setTheme: (theme) => {
            if (disableTransitionOnChange) {
                document.documentElement.classList.add("no-transitions");
                window.setTimeout(() => {
                    document.documentElement.classList.remove("no-transitions");
                }, 0);
            }
            setTheme(theme);
        },
    };
    return (<ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>);
}
const useTheme = () => {
    const context = (0, react_1.useContext)(ThemeProviderContext);
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
exports.useTheme = useTheme;
