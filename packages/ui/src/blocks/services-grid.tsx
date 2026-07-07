import type { ReactNode } from 'react';
import { Grid } from '../layout/grid';
import { ServiceCard } from './service-card';

export interface ServicesGridItem {
  title: string;
  description: string;
  href?: string;
  icon?: ReactNode;
  priceLabel?: string;
  ctaLabel?: string;
}

export interface ServicesGridProps {
  items: ServicesGridItem[];
  cols?: 2 | 3 | 4;
}

export function ServicesGrid({ items, cols = 3 }: ServicesGridProps) {
  return (
    <Grid cols={cols} gap="md">
      {items.map((item) => (
        <ServiceCard key={item.title} {...item} />
      ))}
    </Grid>
  );
}
