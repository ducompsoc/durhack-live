import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ContentContainer } from '../common/ContentContainer';
import { LoginForm } from './LoginForm';

const LoginWrapper = styled.div`
	background-image: url('/images/login-background.jpg');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
`;

const LoginPurpleKeyframes = keyframes`
	0% {
		background-color: rgba(132, 47, 215, 1);
	}

	100% {
		background-color: rgba(132, 47, 215, 0.7);
	}
`;

const LoginInner = styled.div`
	min-height: 100vh;
	background-color: rgba(132, 47, 215, 1);

	animation-name: ${LoginPurpleKeyframes};
	animation-delay: 1s;
	animation-duration: 1s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
`;

const LoginContainer = styled.div`
	max-width: 600px;
	margin: 64px 0px;
`;

const LoginTitle = styled.h1`
	font-size: 72px;
	margin: 0px 0px 32px 0px;
`;

const LoginCard = styled.div`
	background-color: rgba(51, 51, 51, 0.9);
	margin-top: 16px;
	padding: 16px 36px;
`;

export const LoginPage = React.memo(() => (
	<LoginWrapper>
		<LoginInner className="column">
			<div className="flex" />

			<ContentContainer>
				<LoginContainer>
					<LoginTitle>Let&apos;s jump in</LoginTitle>

					<LoginCard>
						<LoginForm />
					</LoginCard>
					<LoginCard>
						<p>Please use the Durham email address you entered when you signed up for DurHack.</p>
						<p>
							Having trouble? Please ask an organiser on Slack or email{' '}
							<a href="mailto:hello@durhack.com">hello@durhack.com</a>
						</p>
					</LoginCard>
				</LoginContainer>
			</ContentContainer>
		</LoginInner>
	</LoginWrapper>
));
