"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const LoginWrapper = styled.div`
  background-image: url("/images/login-background.jpg");
  background-position: center 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
`;

const LoginPurpleKeyframes = keyframes`
	0% {
		background-color: rgba(125, 99, 153, 1);
	}

	100% {
		background-color: rgba(125, 99, 153, 0.8);
	}
`;

const LoginInner = styled.div`
  min-height: 100vh;
  background-color: rgba(125, 99, 153, 1);

  animation-name: ${LoginPurpleKeyframes};
  animation-delay: 1s;
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <LoginWrapper className={inter.className}>
      <LoginInner className="dh-login">
        <div className="flex flex-col gap-y-3 p-6 text-black dark:text-neutral-200 justify-center md:max-w-3xl md:justify-end md:p-28 min-h-screen xl:text-xl xl:p-35 xl:max-w-5xl">
          {isLoginPage && (
            <h1 className="text-4xl text-white mb-2 font-heading xl:text-6xl">Let&apos;s jump in.</h1>
          )}

          <div className="dh-box">{children}</div>
          {isLoginPage && (
            <div className="dh-box mb-12 md:mb-0">
              <p className="mb-2">
                Please use the email you entered when you registered for
                DurHack.
              </p>
              <p>
                Having trouble? Please chat to a member of the DurHack team.
              </p>
            </div>
          )}
        </div>
      </LoginInner>
    </LoginWrapper>
  );
}
