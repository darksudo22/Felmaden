import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persian Academic Copilot",
  description: "AI assistant for Persian academic writing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased bg-[#0a0a0a] text-orange-50">
        {children}
      </body>
    </html>
  );
}