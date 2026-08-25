import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './DatePicker.module.scss';

type DatePickerProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

const DatePicker = ({ className, ...props }: DatePickerProps) => (
  <input type="date" data-slot="date-picker" className={cn(styles.root, className)} {...props} />
);

export { DatePicker };
export type { DatePickerProps };
export default DatePicker;
