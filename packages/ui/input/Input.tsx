import type { ComponentProps } from 'react';
import cn from 'classnames';
import styles from './Input.module.scss';

type Props = ComponentProps<'input'>;

const Input = ({ className, type, ...props }: Props) => {
  return (
    <input type={type} data-slot="input" className={cn(styles.root, className)} {...props}></input>
  );
};

export default Input;
