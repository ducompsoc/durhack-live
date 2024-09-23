import * as React from "react";

import { inter } from "@/lib/google-fonts"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: "url(\"/images/login-background.jpg\")",
        backgroundPosition: "center 0",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      className={inter.className}
    >
      <div className="dh-login">
        <div className="flex flex-col gap-y-3 p-6 text-black dark:text-neutral-200 justify-center md:max-w-3xl md:justify-end md:p-28 min-h-screen xl:text-xl xl:p-35 xl:max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}
