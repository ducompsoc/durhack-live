'use client';

import React from 'react';
import styled from 'styled-components';
import { redirect } from 'next/navigation'

import ContentContainer from './ContentContainer';
import Header from './Header';
import Footer from './Footer';
import ConnectionBar from './ConnectionBar';

const ContentArea = styled.div`
	background-color: ${p => p.theme.dark};
	padding: 32px 0px;
`;

const _Page = React.memo(({ requireAuth, children }: React.PropsWithChildren<{ requireAuth?: boolean }>) => {
	if (requireAuth !== false && (!localStorage.getItem('token') || !localStorage.getItem('checkin'))) {
    return redirect("/login");
	}

	return (
		<div>
			<ConnectionBar />
			<Header />

			<ContentArea>
				<ContentContainer>
					{children}
				</ContentContainer>
			</ContentArea>

			<Footer />
		</div>
	);
});

export default _Page;
