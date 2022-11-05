import * as React from 'react';

import { Card } from '../common/Card';
import { Section } from '../common/Section';
import { Schedule } from '../schedule-page/Schedule';

export const HackerPack = React.memo(() => (
	<Section>
		<Card>
			<Schedule />
		</Card>
	</Section>
));
