'use client';

import React, {useEffect} from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import { makeLiveApiRequest } from '@/app/util/api';

import ContentContainer from './ContentContainer';
import Header from './Header';
import Footer from './Footer';
import ConnectionBar from './ConnectionBar';


const ContentArea = styled.div`
	background-color: ${p => p.theme.dark};
	padding: 32px 0px;
`;

const _Page = React.memo(({ requireAuth, children }: React.PropsWithChildren<{ requireAuth?: boolean }>) => {
  const router = useRouter();

  useEffect(() => {
    if (requireAuth === false) return;

    (async () => {
      const profile_request = await makeLiveApiRequest('/users/me');
      let profile_response: Response;
      try {
        profile_response = await fetch(profile_request);
      } catch (error) {
        return router.push('/login');
      }

      if (!profile_response.ok) {
        return router.push('/login');
      }

      const profile = (await profile_response.json()).data;
      if (!profile.checked_in) {
        return router.push('/login/check-in');
      }
    })();
  });

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
