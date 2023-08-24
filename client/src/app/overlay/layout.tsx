import "./overlay.scss";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "DurHack: Live - Overlay",
  description: "DurHack's livestream overlay for OBS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
