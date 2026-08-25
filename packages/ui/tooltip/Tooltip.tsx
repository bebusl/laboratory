import { useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Tooltip.module.scss';

type TooltipProps = Omit<ComponentPropsWithoutRef<'span'>, 'content'> & {
  content: ReactNode;
  children: ReactNode;
};

const Tooltip = ({ children, className, content, ...props }: TooltipProps) => {
  const id = useId();

  return (
    <span data-slot="tooltip" className={cn(styles.root, className)} {...props}>
      <span aria-describedby={id}>{children}</span>
      <span id={id} role="tooltip" className={styles.content}>
        {content}
      </span>
    </span>
  );
};

export { Tooltip };
export type { TooltipProps };
export default Tooltip;
