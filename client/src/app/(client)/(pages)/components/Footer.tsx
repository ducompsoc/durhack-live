"use client";

import React from "react";
import styled from "styled-components";

import ContentContainer from "@/app/(client)/components/ContentContainer";


const FooterContainer = styled.div`
	text-align: center;
`;

const ExternalLink = styled.a`
	font-weight: bold;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const Footer = React.memo(() => (
  <FooterContainer className="pb-16 pt-6">
    <ContentContainer>
      <p>
        DurHack follows the{" "}
        <ExternalLink
          href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
          target="_blank"
          rel="noopener"
        >
          MLH Code of Conduct
        </ExternalLink>. If something goes wrong, please talk to an organiser.
      </p>
    </ContentContainer>
  </FooterContainer>
));

export default Footer;
