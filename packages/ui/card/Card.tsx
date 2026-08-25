import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Card.module.scss';

type CardProps = ComponentPropsWithoutRef<'div'>;

const Card = ({ className, ...props }: CardProps) => (
  <section data-slot="card" className={cn(styles.card, className)} {...props} />
);

const CardHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div data-slot="card-header" className={cn(styles.header, className)} {...props} />
);

const CardTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
  <h3 data-slot="card-title" className={cn(styles.title, className)} {...props} />
);

const CardDescription = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p data-slot="card-description" className={cn(styles.description, className)} {...props} />
);

const CardContent = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div data-slot="card-content" className={cn(styles.content, className)} {...props} />
);

const CardFooter = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div data-slot="card-footer" className={cn(styles.footer, className)} {...props} />
);

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export type { CardProps };
export default Card;
