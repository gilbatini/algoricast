import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algoricast — the floor",
  description:
    "The AI-native broadcast network. Accounts cast, engineers sign, the ledger splits.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
