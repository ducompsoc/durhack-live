"use client";

import Tippy from "@tippyjs/react";
import * as React from "react";
import styled from "styled-components";

import 'tippy.js/dist/tippy.css'; // eslint-disable-line

const PurpleTippy = styled(Tippy)`
	background: ${p => p.theme.primaryDark};

	&[data-placement^='top'] > .tippy-arrow::before {
		border-top-color: ${p => p.theme.primaryDark};
	}
`;

const LinkContainer = styled.div`
	position: relative;
	font-weight: 300;
	text-align: center;
	font-size: large;

	a {
		color: ${p => p.theme.primaryDark};
		border-bottom: dashed 1px ${p => p.theme.primaryDark};
		text-decoration: none;
		font-size: x-large;

		&:hover {
			border-bottom-style: solid;
		}
	}
`;

/* eslint-disable */

const MainWebsiteLink = React.memo(() => (
	<LinkContainer className="md:pt-[48px] pt-6 text-white">
		<h2>Meet your organisers, see our sponsors, and read the FAQs over on</h2>
		<a href="https://durhack.com" target="_blank">durhack.com</a>
	</LinkContainer>
));

/* eslint-enable */
export default MainWebsiteLink;
