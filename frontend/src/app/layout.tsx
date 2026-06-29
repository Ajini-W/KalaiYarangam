import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { Inter } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/ui/Toast";
import { BrandThemeProvider } from "@/providers/BrandThemeProvider";

// Mock Inter font definition to avoid offline build failure in sandbox
// const inter = {
//   variable: "font-sans",
// };
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


export const metadata: Metadata = {
  metadataBase: new URL("https://KalaiArangam.com"),

  title: {
    default: "KalaiArangam",
    template: "%s | KalaiArangam",
  },

  description: "Multi Tenant SaaS ERP Platform",

  keywords: [
    "ERP",
    "Training Management",
    "Rental Management",
    "Event Management",
  ],

  icons: {
    icon: [
      { url: "/icons/logo.png", sizes: "any", type: "image/png" },
      { url: "/icons/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/apple-touch-icon-precomposed.png",
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "KalaiArangam",
    description: "ERP Platform",
    url: "https://KalaiArangam.com",
    siteName: "KalaiArangam",
    locale: "en_US",
    type: "website",
    images: [{ url: "/icons/logo.png", width: 512, height: 512, alt: "KalaiArangam" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "KalaiArangam",
    description: "ERP Platform",
    images: ["/icons/logo.png"],
  },

  alternates: {
    canonical: "https://KalaiArangam.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "KalaiArangam",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col"
        suppressHydrationWarning
      >
        {/* JSON-LD Structured Data */}
        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <BrandThemeProvider>
            {children}
          </BrandThemeProvider>
        </ThemeProvider>

        <ToastProvider />
      </body>
    </html>
  );
}