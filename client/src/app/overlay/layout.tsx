import { Space_Grotesk } from "next/font/google";
import "./overlay.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DurHack: Live - Overlay",
  description: "DurHack's livestream overlay for OBS",
};

const font = Space_Grotesk({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  );
}
