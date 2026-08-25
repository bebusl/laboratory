import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Alert.module.scss';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

type AlertProps = ComponentPropsWithoutRef<'div'> & {
  variant?: AlertVariant;
  title?: ReactNode;
};

const Alert = ({ children, className, title, variant = 'info', ...props }: AlertProps) => (
  <div
    role={variant === 'danger' ? 'alert' : 'status'}
    data-slot="alert"
    data-variant={variant}
    className={cn(styles.root, styles[variant], className)}
    {...props}
  >
    <div className={styles.content}>
      {title && <strong className={styles.title}>{title}</strong>}
      <div>{children}</div>
    </div>
  </div>
);

export { Alert };
export type { AlertProps, AlertVariant };
export default Alert;
