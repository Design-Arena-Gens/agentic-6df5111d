import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benable TikTok Comment Agent",
  description:
    "Generate high-converting TikTok comments that spark curiosity about Benable."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
