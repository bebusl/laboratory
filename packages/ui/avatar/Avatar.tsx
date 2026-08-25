import { useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Avatar.module.scss';

type AvatarProps = Omit<ComponentPropsWithoutRef<'img'>, 'alt'> & {
  alt?: string;
  fallback?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

const Avatar = ({ className, fallback, size = 'md', src, alt = '', ...props }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <span data-slot="avatar" className={cn(styles.root, styles[size], className)}>
      {src && !hasError ? (
        <img alt={alt} src={src} onError={() => setHasError(true)} {...props} />
      ) : (
        <span aria-hidden={!fallback} className={styles.fallback}>
          {fallback ?? alt.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  );
};

export { Avatar };
export type { AvatarProps };
export default Avatar;
