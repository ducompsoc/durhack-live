"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

import { makeLiveApiRequest } from "@/app/util/api";
import ContentContainer from "@/app/(client)/components/ContentContainer";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ConnectionBar from "./components/ConnectionBar";

const PageLayout = React.memo(
  ({
    requireAuth,
    children,
  }: React.PropsWithChildren<{ requireAuth?: boolean }>) => {
    const router = useRouter();

    useEffect(() => {
      if (requireAuth === false) return;

      (async () => {
        const profile_request = await makeLiveApiRequest("/user");
        let profile_response: Response;
        try {
          profile_response = await fetch(profile_request);
        } catch (error) {
          return router.push("/login");
        }

        if (!profile_response.ok) {
          return router.push("/login");
        }

        const profile = (await profile_response.json()).data;

        if (profile.role !== "hacker") return;

        if (!profile.checked_in) {
          return router.push("/login/check-in");
        }
      })();
    });

    return (
      <div>
        <ConnectionBar />
        <Header />

        <div className="m-4 md:mt-8">
          <ContentContainer>{children}</ContentContainer>
        </div>

        <Footer />
      </div>
    );
  }
);

export default PageLayout;
