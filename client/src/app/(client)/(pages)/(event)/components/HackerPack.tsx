'use client';

import * as React from 'react';

import Card from '@/app/(client)/(pages)/components/Card';
import Section from '@/app/(client)/(pages)/components/Section';
import Schedule from '@/app/(client)/(pages)/components/Schedule';

const HackerPack = React.memo(() => (
  <Section>
    <Card>
      <Schedule />
    </Card>
  </Section>
));

export default HackerPack;
