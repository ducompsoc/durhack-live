"use client";

import * as React from "react";
import { query } from "@/lib/api";

interface IOAuthResponse {
	access_token?: string;
	error?: string;
	error_description?: string;
}

const DiscordContent = React.memo(() => {
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    if (!window.location.hash) {
      window.location.href = `https://discord.com/oauth2/authorize?client_id=1038564110138355752&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=token&scope=identify`;

      return;
    }

    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.has("error")) {
      setError(`We received an error from Discord: "${hash.get("error_description")}". If you\'re having problems, ask a member of the DurHack team.`);

      return;
    }

    const accessToken = hash.get("access_token");
    if (!accessToken) {
      setError("There's a problem with the URL. If you're having problems, ask a member of the DurHack team.");

      return;
    }

    query("POST", "discord", { accessToken })
      .then(res => {
        if (!res.inviteUrl) {
          throw new Error("No invite URL provided.");
        }

        window.location.href = res.inviteUrl;
      })
      .catch(err => {
        console.error(err);

        setError("An unknown error occurred. If you're having problems, ask a member of the DurHack team.");
      });
  }, []);

  return <p>{error || "Redirecting..."}</p>;
});

export default DiscordContent;
