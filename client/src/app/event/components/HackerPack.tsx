'use client';

import * as React from 'react';

import Card from '@/app/components/Card';
import Section from '@/app/components/Section';
import Schedule from '@/app/schedule/components/Schedule';

const HackerPack = React.memo(() => (
	<Section>
		<Card>
			<Schedule />
		</Card>
	</Section>
));

export default HackerPack;
