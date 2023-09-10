"use client";

import React, {CSSProperties} from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { useAsyncEffect } from "@/app/util/useAsyncEffect";
import { makeLiveApiRequest } from "@/app/util/api";
import { ErrorAlert } from "@/app/(client)/login/components";


interface ClientDetails {
  name: string,
  redirect_uri: string,
}

const Button = styled.button`
  display: inline-block;
  border: none;
  outline: none;
  border-radius: 100px;
  padding: 6px 24px;
  font-size: inherit;
  transition: .3s ease;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: rgba(0,0,0,0);
  &:hover {
    color: darkgrey;
  }
`;

const AuthorizeButton = styled(Button)`
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 0, 64, 1);
  &:hover {
    background-color: indianred;
  }
`;

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

  return <FontAwesomeListItem iconClassName={"fa-solid fa-square-xmark"} iconStyle={{color: "white"}}>
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
      getAuthorizeRoute(searchParams),
      {
        method: "POST",
        body: new URLSearchParams({ allowed: true }),
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
  }

  async function handleCancelPressed() {
    if (hasResponded) return;
    setHasResponded(true);

    const authorizeRequest = await makeLiveApiRequest(
      getAuthorizeRoute(searchParams),
      {
        method: "POST",
        body: new URLSearchParams({ allowed: false }),
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

      console.log(getClientDetailsResponse);

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

  if (errorMessage) return <ErrorAlert>{errorMessage}</ErrorAlert>;
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

  return (<main style={{textAlign: "center"}}>
    <h1>Hey, {authenticatedUserName}!</h1>
    <p>An external application</p>
    <h2><strong>{clientDetails!.name}</strong></h2>
    <p>wants to access your DurHack account.</p>
    <hr/>
    <p>This will allow the developer of {clientDetails!.name} to:</p>
    <ul style={{textAlign: "left"}} className={"fa-ul"}>
      <OAuth2Scope>
        <span>Access your preferred name, email address, and avatar</span>
      </OAuth2Scope>
      <OAuth2Scope>
        <span>Access your third party connections</span>
      </OAuth2Scope>
      <FakeOauth2Scope/>
    </ul>
    <hr/>
    <small>
      <ul style={{textAlign: "left"}} className={"fa-ul"}>
        <RedirectWarning redirect_uri={clientDetails!.redirect_uri}/>
      </ul>
    </small>

    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
      <CancelButton onClick={handleCancelPressed}>Cancel</CancelButton>
      <AuthorizeButton onClick={handleAuthorizePressed}>Authorize</AuthorizeButton>
    </div>
  </main>);
}
