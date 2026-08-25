import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Select.module.scss';

type SelectProps = ComponentPropsWithoutRef<'select'>;

const Select = ({ className, ...props }: SelectProps) => {
  return <select data-slot="select" className={cn(styles.root, className)} {...props} />;
};

export { Select };
export type { SelectProps };
export default Select;
