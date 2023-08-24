import "./globals.css";
import type { Metadata } from "next";

import StyledComponentsRegistry from "./styledComponentsRegistry";


export const metadata: Metadata = {
  title: "DurHack: Live",
  description: "DurHack's live event website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
