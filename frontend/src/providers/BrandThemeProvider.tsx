"use client";

import * as React from "react";
import { getBranding } from "@/services/branding";
import { useAuthStore } from "@/store/auth.store";

interface BrandThemeContextValue {
  primaryColor: string | null;
  secondaryColor: string | null;
  applyBrandTheme: (primary: string, secondary: string) => void;
}

const BrandThemeContext = React.createContext<BrandThemeContextValue>({
  primaryColor: null,
  secondaryColor: null,
  applyBrandTheme: () => {},
});

export function useBrandTheme() {
  return React.useContext(BrandThemeContext);
}

function getLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function setCSSVars(primary: string, secondary: string) {
  const root = document.documentElement;
  const primaryLuminance = getLuminance(primary);
  const secondaryLuminance = getLuminance(secondary);
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-foreground", primaryLuminance > 0.5 ? "#0f172a" : "#ffffff");
  root.style.setProperty("--secondary", secondary);
  root.style.setProperty("--secondary-foreground", secondaryLuminance > 0.5 ? "#0f172a" : "#ffffff");
}

export function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [secondaryColor, setSecondaryColor] = React.useState<string | null>(null);

  const applyBrandTheme = React.useCallback((primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    setCSSVars(primary, secondary);
  }, []);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    getBranding()
      .then((res) => {
        const p = res.data.primaryColor;
        const s = res.data.secondaryColor;
        if (p) {
          applyBrandTheme(p, s ?? p);
        }
      })
      .catch(() => {});
  }, [isAuthenticated, applyBrandTheme]);

  return (
    <BrandThemeContext.Provider value={{ primaryColor, secondaryColor, applyBrandTheme }}>
      {children}
    </BrandThemeContext.Provider>
  );
}
