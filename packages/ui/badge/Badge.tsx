import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Badge.module.scss';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const Badge = ({ className, size = 'md', variant = 'default', ...props }: BadgeProps) => {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(styles.root, styles[variant], styles[size], className)}
      {...props}
    />
  );
};

export { Badge };
export type { BadgeProps, BadgeSize, BadgeVariant };
export default Badge;
