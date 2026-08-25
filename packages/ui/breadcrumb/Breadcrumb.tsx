import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Breadcrumb.module.scss';

const Breadcrumb = ({ className, ...props }: ComponentPropsWithoutRef<'nav'>) => (
  <nav
    aria-label="Breadcrumb"
    data-slot="breadcrumb"
    className={cn(styles.root, className)}
    {...props}
  />
);

const BreadcrumbList = ({ className, ...props }: ComponentPropsWithoutRef<'ol'>) => (
  <ol data-slot="breadcrumb-list" className={cn(styles.list, className)} {...props} />
);

const BreadcrumbItem = ({ className, ...props }: ComponentPropsWithoutRef<'li'>) => (
  <li data-slot="breadcrumb-item" className={cn(styles.item, className)} {...props} />
);

const BreadcrumbLink = ({ className, ...props }: ComponentPropsWithoutRef<'a'>) => (
  <a data-slot="breadcrumb-link" className={cn(styles.link, className)} {...props} />
);

const BreadcrumbCurrent = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    aria-current="page"
    data-slot="breadcrumb-current"
    className={cn(styles.current, className)}
    {...props}
  />
);

const BreadcrumbSeparator = ({
  children = '/',
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>) => (
  <span
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    className={cn(styles.separator, className)}
    {...props}
  >
    {children}
  </span>
);

export {
  Breadcrumb,
  BreadcrumbCurrent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
};
export default Breadcrumb;
