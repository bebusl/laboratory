import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Toast.module.scss';

type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

type ToastProps = ComponentPropsWithoutRef<'div'> & {
  title?: ReactNode;
  variant?: ToastVariant;
  open?: boolean;
};

const Toast = ({
  children,
  className,
  open = true,
  title,
  variant = 'default',
  ...props
}: ToastProps) => {
  if (!open) return null;

  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      data-slot="toast"
      data-variant={variant}
      className={cn(styles.root, styles[variant], className)}
      {...props}
    >
      <div className={styles.body}>
        {title && <strong>{title}</strong>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

const ToastClose = ({ className, ...props }: ComponentPropsWithoutRef<'button'>) => (
  <button
    type="button"
    aria-label="닫기"
    data-slot="toast-close"
    className={cn(styles.close, className)}
    {...props}
  >
    ×
  </button>
);

export { Toast, ToastClose };
export type { ToastProps, ToastVariant };
export default Toast;
