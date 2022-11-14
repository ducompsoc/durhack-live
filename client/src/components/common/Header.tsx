import React from 'react';
import styled from 'styled-components';
import { ContentContainer } from './ContentContainer';
import { Countdown } from './Countdown';

const HeaderContainer = styled.div`
	background-image: linear-gradient(45deg, #52216b, #ff0040);
`;

const HeaderInner = styled.div`
	padding: 64px 0px 0px 0px;
`;

const LogoWrapper = styled.div`
	margin: 16px 0px;
`;

const Logo = styled.img`
	width: auto;
	height: 66px;
`;

export const Header = React.memo(() => (
	<HeaderContainer>
		<HeaderInner>
			<ContentContainer className="row">
				<LogoWrapper className="column center">
					<Logo src="/images/logo-white-22.png" alt="Logo" />
				</LogoWrapper>
				<div className="flex" />
				<Countdown />
			</ContentContainer>
		</HeaderInner>
	</HeaderContainer>
));
