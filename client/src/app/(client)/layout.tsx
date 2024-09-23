import type { Metadata } from "next";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { audiowide, spaceGrotesk } from "@/lib/google-fonts"

export const metadata: Metadata = {
  title: "DurHack: Live",
  description: "DurHack's live event website",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(audiowide.variable, spaceGrotesk.className)}>
        {children}
      </body>
    </html>
  );
}
