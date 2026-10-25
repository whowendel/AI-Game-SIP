import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M's Cases: AI Escape Room | Truth Detective",
  description: "A cartoon multiplayer mystery game where players detect AI hallucinations and race to escape!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-800 antialiased select-none font-sans">
        {children}
      </body>
    </html>
  );
}
