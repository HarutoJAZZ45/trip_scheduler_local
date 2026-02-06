import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Travel Itinerary",
  description: "A stylish travel companion.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Itinerary",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground font-sans selection:bg-primary/20`}
      >
        <div className="mx-auto max-w-md min-h-screen relative bg-white shadow-2xl overflow-hidden sm:my-8 sm:rounded-[40px] sm:h-[844px] sm:border-[8px] sm:border-gray-900 ring-2 ring-gray-900/5 sm:overflow-y-auto pb-20 no-scrollbar">
          {/* Desktop Wrapper pretending to be an iPhone */}
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
