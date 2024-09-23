"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@durhack/web-components/ui/button"

export default function LoginPage() {
  return (
    <>
      <h1 className="text-4xl text-white mb-2 font-heading xl:text-6xl">Let&apos;s jump in.</h1>
      <main className="dh-box">
        <Button variant='secondary' size="lg" asChild>
          <Link href="/api/auth/keycloak/login">
            <span>Log in via <code className="underline">auth.durhack.com</code></span>
          </Link>
        </Button>
      </main>
    </>
  );
}
