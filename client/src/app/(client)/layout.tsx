import "./globals.scss";
import type { Metadata } from "next";
import { Audiowide, Space_Grotesk } from "next/font/google";

import StyledComponentsRegistry from "./styledComponentsRegistry";

const headings = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--durhack-font",
});

const font = Space_Grotesk({ subsets: ["latin"] });

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
      <body className={headings.variable + " " + font.className}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
