import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jay's Pro Wash — Professional Power Washing",
  description: "Licensed & insured power washing serving your area. House washing, driveways, decks, and more. Free quotes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
