'use client';

import * as React from 'react';

import Card from '@/app/(pages)/components/Card';
import Section from '@/app/(pages)/components/Section';
import Schedule from '@/app/(pages)/components/Schedule';

const HackerPack = React.memo(() => (
  <Section>
    <Card>
      <Schedule />
    </Card>
  </Section>
));

export default HackerPack;
