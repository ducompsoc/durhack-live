'use client';

import React from 'react';

import _Page from '@/app/components/_Page';
import Announcement from './components/Announcement';
import HackerPack from './components/HackerPack';
import Socials from './components/Socials';
import Stage from './components/Stage';
import MainWebsiteLink from './components/MainWebsiteLink';

export default React.memo(() => (
  <_Page>
    <Stage />
    <Socials />
    <Announcement />
    <HackerPack />
    <MainWebsiteLink />
  </_Page>
));
