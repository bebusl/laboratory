import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './EmptyState.module.scss';

type EmptyStateProps = ComponentPropsWithoutRef<'section'> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

const EmptyState = ({
  action,
  children,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) => (
  <section data-slot="empty-state" className={cn(styles.root, className)} {...props}>
    {children && <div className={styles.illustration}>{children}</div>}
    <h2 className={styles.title}>{title}</h2>
    {description && <p className={styles.description}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </section>
);

export { EmptyState };
export type { EmptyStateProps };
export default EmptyState;
