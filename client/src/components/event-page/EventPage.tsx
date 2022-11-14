import React from 'react';

import { Page } from '../common/Page';
import { Announcement } from './Announcement';
import { HackerPack } from './HackerPack';
import { Socials } from './Socials';
import { Stage } from './Stage';
import { MainWebsiteLink } from './MainWebsiteLink';

export const EventPage = React.memo(() => (
	<Page>
		<Stage />
		<Socials />
		<Announcement />
		<HackerPack />
		<MainWebsiteLink />
	</Page>
));
