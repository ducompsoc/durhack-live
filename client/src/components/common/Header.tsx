import React from 'react';
import styled from 'styled-components';
import { ContentContainer } from './ContentContainer';
import { Countdown } from './Countdown';

const HeaderContainer = styled.div`
	background-color: ${p => p.theme.primaryDark};
`;

const HeaderInner = styled.div`
	background-image: url('/images/header-tile.png');
	background-repeat: repeat-x;
	padding: 64px 0px 0px 0px;
`;

const LogoWrapper = styled.div`
	margin: 16px 0px;
`;

const Logo = styled.img`
	width: auto;
	height: 92px;
`;

const PoweredByContainer = styled.a`
	text-decoration: none;
	margin: 0px 9px;
`;

const PoweredByText = styled.div`
	margin-top: -4px;
`;

const PoweredByLogo = styled.img`
	width: auto;
	height: 24px;
	margin: 9px 0px 0px 6px;
`;

export const Header = React.memo(() => (
	<HeaderContainer>
		<HeaderInner>
			<ContentContainer className="row">
				<LogoWrapper className="column center">
					<Logo src="/images/logo-white.png" alt="Logo" />
					<PoweredByContainer href="https://aws.amazon.com/" target="_blank" rel="noopener" className="row center">
						<PoweredByText>powered by</PoweredByText>
						<PoweredByLogo src="/images/header-aws.png" alt="AWS" />
					</PoweredByContainer>
				</LogoWrapper>
				<div className="flex" />
				<Countdown />
			</ContentContainer>
		</HeaderInner>
	</HeaderContainer>
));
