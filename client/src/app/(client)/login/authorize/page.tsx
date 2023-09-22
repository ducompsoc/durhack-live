"use client";

import React, {CSSProperties} from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";

import { useAsyncEffect } from "@/app/util/useAsyncEffect";
import { makeLiveApiRequest } from "@/app/util/api";


interface ClientDetails {
  name: string,
  redirect_uri: string,
}

function FontAwesomeListItem(props: { children?: React.ReactNode, iconClassName: string, iconStyle?: CSSProperties }) {
  return <li>
    <i className={props.iconClassName} style={props.iconStyle}/> &nbsp;
    {props.children}
  </li>;
}

function OAuth2Scope(props: { children?: React.ReactNode }) {
  return <FontAwesomeListItem iconClassName={"fa-solid fa-square-check"} iconStyle={{color: "green"}}>
    {props.children}
  </FontAwesomeListItem>;
}

function FakeOauth2Scope() {
  const scopes = [
    "Bake a cake",
    "Buy you a nice seafood dinner",
    "Have an existential crisis",
    "Microbrew some local kombucha",
    "Solve a mystery with Scooby and the gang",
    "Record a new mixtape",
    "Paint a happy little tree",
    "Read you a bedtime story"
  ];

  return <FontAwesomeListItem iconClassName="fa-solid fa-square-xmark text-neutral-600 dark:text-white">
    <span>
      {scopes[Math.floor(Math.random() * scopes.length)]}
    </span>
  </FontAwesomeListItem>;
}

export default function AuthorizePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [authenticatedUserName, setAuthenticatedUserName] = React.useState<string | null>(null);
  const [clientDetails, setClientDetails] = React.useState<ClientDetails | null>(null);
  const [hasResponded, setHasResponded] = React.useState<boolean>(false);

  function getAuthorizeRoute(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
    const stringSearchParams = searchParams.toString();
    return "/auth/oauth/authorize" + (stringSearchParams ? `?${stringSearchParams}` : "");
  }

  async function handleAuthorizePressed() {
    if (hasResponded) return;
    setHasResponded(true);

    const authorizeRequest = await makeLiveApiRequest(
      "/auth/oauth/authorize",
      {
        method: "POST",
        body: new URLSearchParams([
          ...Array.from(searchParams.entries()),
          ...Object.entries({
            allowed: true,
          }),
        ]),
        redirect: "follow",
      },
    );

    let authorizeResponse;
    try {
      authorizeResponse = await fetch(authorizeRequest);
    } catch (error) {
      setHasResponded(false);
      return setErrorMessage("A network error occurred. Try again.");
    }

    if (!authorizeResponse.ok) {
      return setErrorMessage("An unknown error occurred. Try again.");
    }

    const location = authorizeResponse.headers.get("location");
    if (location) {
      return router.push(location);
    }
  }

  async function handleCancelPressed() {
    if (hasResponded) return;
    setHasResponded(true);

    const authorizeRequest = await makeLiveApiRequest(
      "/auth/oauth/authorize",
      {
        method: "POST",
        body: new URLSearchParams([
          ...Array.from(searchParams.entries()),
          ...Object.entries({
            allowed: false,
          }),
        ]),
      },
    );

    let authorizeResponse;
    try {
      authorizeResponse = await fetch(authorizeRequest);
    } catch (error) {
      setHasResponded(false);
      return setErrorMessage("A network error occurred. Try again.");
    }

    if (!authorizeResponse.ok) {
      return setErrorMessage("An unknown error occurred. Try again.");
    }

    const location = authorizeResponse.headers.get("location");
    if (location) {
      return router.push(location);
    }
  }

  useAsyncEffect(
    async () => {
      const getClientDetailsRequest = await makeLiveApiRequest(
        getAuthorizeRoute(searchParams),
        {},
      );

      let getClientDetailsResponse;
      try {
        getClientDetailsResponse = await fetch(getClientDetailsRequest);
      } catch (error) {
        return setErrorMessage("A network error occurred. Try again.");
      }

      if (getClientDetailsResponse.redirected) {
        router.push(getClientDetailsResponse.url);
        return;
      }

      if (getClientDetailsResponse.status === 400) {
        return setErrorMessage("Malformed/invalid authorize URI. Try whatever you were just doing again!");
      }

      if (getClientDetailsResponse.status === 404) {
        return setErrorMessage("Unknown OAuth Client ID. Have fun!");
      }

      if (getClientDetailsResponse.status === 500) {
        return setErrorMessage("Internal server error. Try again later.");
      }

      if (!getClientDetailsResponse.ok) {
        return setErrorMessage("An unknown error occurred. Try again.");
      }

      const getClientDetailsBody = await getClientDetailsResponse.json();

      setAuthenticatedUserName(getClientDetailsBody.user.name);
      setClientDetails(getClientDetailsBody.client);
      setLoading(false);
    },
    async () => {}
  );

  if (errorMessage) return <p className="dh-err">{errorMessage}</p>;
  if (loading) return <div>Fetching client info...</div>;

  function RedirectWarning(props: { redirect_uri: string }) {
    let redirectOrigin;
    try {
      redirectOrigin = new URL(props.redirect_uri).origin;
    } catch (error) {
      return;
    }

    return <FontAwesomeListItem iconClassName={"fas fa-link"}>
      <span>
        Once you authorize, you will be redirected to <a href={redirectOrigin}>{redirectOrigin}</a>
      </span>
    </FontAwesomeListItem>;
  }

  return (
    <main className="grid gap-y-2">
      <h1>Hey, {authenticatedUserName}!</h1>
      <p>An external application</p>
      <h2 className="text-center">
        <strong>{clientDetails!.name}</strong>
      </h2>
      <p>wants to access your DurHack account.</p>
      <hr />
      <p>This will allow the developer of {clientDetails!.name} to:</p>
      <ul className="mx-8 mt-2 mb-4">
        <OAuth2Scope>
          <span>Access your preferred name, email address, and avatar</span>
        </OAuth2Scope>
        <OAuth2Scope>
          <span>Access your third party connections</span>
        </OAuth2Scope>
        <FakeOauth2Scope />
      </ul>
      <hr />
      <small>
        <ul className="mx-2 text-center">
          <RedirectWarning redirect_uri={clientDetails!.redirect_uri} />
        </ul>
      </small>

      <div className="flex justify-evenly mt-2">
        <button className="dh-btn !bg-gray-400" onClick={handleCancelPressed}>Cancel</button>
        <button className="dh-btn" onClick={handleAuthorizePressed}>
          Authorize
        </button>
      </div>
    </main>
  );
}
