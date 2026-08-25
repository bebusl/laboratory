import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Textarea.module.scss';

type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

const Textarea = ({ className, ...props }: TextareaProps) => {
  return <textarea data-slot="textarea" className={cn(styles.root, className)} {...props} />;
};

export { Textarea };
export type { TextareaProps };
export default Textarea;
