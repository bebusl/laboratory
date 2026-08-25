import { createContext, useContext, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './RadioGroup.module.scss';

type RadioGroupContextValue = {
  name?: string;
  value?: string;
  setValue: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

type RadioGroupProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'onChange'> & {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroup = ({
  children,
  className,
  defaultValue,
  name,
  onValueChange,
  value,
  ...props
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const setValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <RadioGroupContext.Provider value={{ name, setValue, value: currentValue }}>
      <fieldset data-slot="radio-group" className={cn(styles.root, className)} {...props}>
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

type RadioGroupItemProps = Omit<ComponentPropsWithoutRef<'input'>, 'name' | 'type'> & {
  value: string;
  label?: ReactNode;
};

const RadioGroupItem = ({ className, label, onChange, value, ...props }: RadioGroupItemProps) => {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error('RadioGroupItem must be used inside <RadioGroup>.');

  return (
    <label className={styles.item}>
      <input
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        className={cn(styles.control, className)}
        onChange={event => {
          onChange?.(event);
          if (event.target.checked) group.setValue(value);
        }}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export { RadioGroup, RadioGroupItem };
export type { RadioGroupItemProps, RadioGroupProps };
export default RadioGroup;
