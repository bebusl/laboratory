import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Switch.module.scss';

type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

const Switch = ({ className, ...props }: SwitchProps) => {
  return (
    <input
      type="checkbox"
      role="switch"
      data-slot="switch"
      className={cn(styles.root, className)}
      {...props}
    />
  );
};

export { Switch };
export type { SwitchProps };
export default Switch;
