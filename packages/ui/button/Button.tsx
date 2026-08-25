import type { ComponentPropsWithoutRef, ComponentRef, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import cn from 'classnames';

import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonElement = ComponentRef<'button'>;

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

function Button(
  {
    className,
    disabled,
    loading = false,
    size = 'md',
    type = 'button',
    variant = 'primary',
    ...props
  }: ButtonProps,
  ref: ForwardedRef<ButtonElement>
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.root, styles[variant], styles[size], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...props}
    />
  );
}

const ForwardedButton = forwardRef(Button);

ForwardedButton.displayName = 'Button';

export { ForwardedButton as Button };
export type { ButtonProps, ButtonSize, ButtonVariant };
export default ForwardedButton;
