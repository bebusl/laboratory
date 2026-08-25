import { useId } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Combobox.module.scss';

type ComboboxOption = {
  value: string;
  label?: string;
};

type ComboboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'list'> & {
  options: readonly ComboboxOption[];
};

const Combobox = ({ className, options, ...props }: ComboboxProps) => {
  const listId = useId();

  return (
    <>
      <input list={listId} data-slot="combobox" className={cn(styles.root, className)} {...props} />
      <datalist id={listId}>
        {options.map(option => (
          <option key={option.value} value={option.value} label={option.label} />
        ))}
      </datalist>
    </>
  );
};

export { Combobox };
export type { ComboboxOption, ComboboxProps };
export default Combobox;
