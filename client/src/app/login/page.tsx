'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import ContentContainer from '@/app/components/ContentContainer';
import LoginForm from './components/LoginForm';

const LoginWrapper = styled.div`
	background-image: url('/images/login-background.jpg');
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
`;

const LoginPurpleKeyframes = keyframes`
	0% {
		background-color: rgba(255, 0, 64, 1);
	}

	100% {
		background-color: rgba(255, 0, 64, 0.6);
	}
`;

const LoginInner = styled.div`
	min-height: 100vh;
	background-color: rgba(255, 0, 64, 1);

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
	background-color: rgba(17, 17, 17, 0.9);
	margin-top: 16px;
	padding: 16px 36px;
`;

export default React.memo(() => (
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
            <p>
              Please use the email you entered when you registered for DurHack.
            </p>
            <p>
              Having trouble? Please chat to a member of the DurHack team.
            </p>
          </LoginCard>
        </LoginContainer>
      </ContentContainer>
    </LoginInner>
  </LoginWrapper>
));
