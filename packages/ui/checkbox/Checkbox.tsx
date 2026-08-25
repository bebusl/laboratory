import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Checkbox.module.scss';

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <input type="checkbox" data-slot="checkbox" className={cn(styles.root, className)} {...props} />
  );
};

export { Checkbox };
export type { CheckboxProps };
export default Checkbox;
