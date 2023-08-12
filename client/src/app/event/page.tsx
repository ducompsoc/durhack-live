'use client';

import React from 'react';

import Page from '@/app/components/_Page';
import Announcement from './components/Announcement';
import HackerPack from './components/HackerPack';
import Socials from './components/Socials';
import Stage from './components/Stage';
import MainWebsiteLink from './components/MainWebsiteLink';

export default React.memo(() => (
	<Page>
		<Stage />
		<Socials />
		<Announcement />
		<HackerPack />
		<MainWebsiteLink />
	</Page>
));
