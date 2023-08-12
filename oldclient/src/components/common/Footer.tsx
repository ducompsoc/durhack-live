import React from 'react';
import styled from 'styled-components';
import { ContentContainer } from './ContentContainer';

const FooterContainer = styled.div`
	text-align: center;
	color: #fff;
	padding: 32px 0px;
`;

const ExternalLink = styled.a`
	font-weight: bold;
	text-decoration: none;
	color: #fff;

	&:hover {
		text-decoration: underline;
	}
`;

export const Footer = React.memo(() => (
	<FooterContainer>
		<ContentContainer>
			<p>
				DurHack follows the{' '}
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
