import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Feedback.module.scss';

const Spinner = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    role="status"
    aria-label="Loading"
    data-slot="spinner"
    className={cn(styles.spinner, className)}
    {...props}
  />
);

type ProgressProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  value?: number;
  max?: number;
};

const Progress = ({ className, max = 100, value = 0, ...props }: ProgressProps) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (clampedValue / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clampedValue}
      data-slot="progress"
      className={cn(styles.progress, className)}
      {...props}
    >
      <span className={styles.progressValue} style={{ width: `${percentage}%` }} />
    </div>
  );
};

type SkeletonProps = ComponentPropsWithoutRef<'div'>;

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    aria-hidden="true"
    data-slot="skeleton"
    className={cn(styles.skeleton, className)}
    {...props}
  />
);

export { Progress, Skeleton, Spinner };
export type { ProgressProps, SkeletonProps };
