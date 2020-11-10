import * as React from 'react';

import { Card } from '../common/Card';
import { Section } from '../common/Section';
import { Schedule } from './Schedule';

export const HackerPack = React.memo(() => (
	<Section>
		<Card>
			<Schedule />
		</Card>
	</Section>
));
