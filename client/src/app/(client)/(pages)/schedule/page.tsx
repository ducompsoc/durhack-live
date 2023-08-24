'use client';

import * as React from 'react';
import styled from 'styled-components';

import Schedule from '@/app/(client)/(pages)/components/Schedule';

const PageContainer = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${p => p.theme.dark};

	> div {
		width: 100vw;
		box-sizing: border-box;
		padding: 0px 64px;
	}
`;

export default React.memo(() => (
  <PageContainer>
    <div><Schedule /></div>
  </PageContainer>
));
