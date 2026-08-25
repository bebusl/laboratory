import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Separator.module.scss';

type SeparatorProps = ComponentPropsWithoutRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical';
};

const Separator = ({ className, orientation = 'horizontal', ...props }: SeparatorProps) => (
  <hr
    aria-orientation={orientation}
    data-slot="separator"
    data-orientation={orientation}
    className={cn(styles.root, styles[orientation], className)}
    {...props}
  />
);

export { Separator };
export type { SeparatorProps };
export default Separator;
