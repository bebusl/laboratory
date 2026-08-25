import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Table.module.scss';

const Table = ({ className, ...props }: ComponentPropsWithoutRef<'table'>) => (
  <div className={styles.wrapper}>
    <table data-slot="table" className={cn(styles.table, className)} {...props} />
  </div>
);

const TableCaption = ({ className, ...props }: ComponentPropsWithoutRef<'caption'>) => (
  <caption data-slot="table-caption" className={cn(styles.caption, className)} {...props} />
);

const TableHeader = ({ className, ...props }: ComponentPropsWithoutRef<'thead'>) => (
  <thead data-slot="table-header" className={cn(styles.header, className)} {...props} />
);

const TableBody = ({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) => (
  <tbody data-slot="table-body" className={cn(styles.body, className)} {...props} />
);

const TableFooter = ({ className, ...props }: ComponentPropsWithoutRef<'tfoot'>) => (
  <tfoot data-slot="table-footer" className={cn(styles.footer, className)} {...props} />
);

const TableRow = ({ className, ...props }: ComponentPropsWithoutRef<'tr'>) => (
  <tr data-slot="table-row" className={cn(styles.row, className)} {...props} />
);

const TableHead = ({ className, ...props }: ComponentPropsWithoutRef<'th'>) => (
  <th data-slot="table-head" className={cn(styles.head, className)} {...props} />
);

const TableCell = ({ className, ...props }: ComponentPropsWithoutRef<'td'>) => (
  <td data-slot="table-cell" className={cn(styles.cell, className)} {...props} />
);

type TableEmptyProps = ComponentPropsWithoutRef<'td'> & {
  colSpan: number;
  children?: ReactNode;
};

const TableEmpty = ({ children = '데이터가 없습니다.', className, ...props }: TableEmptyProps) => (
  <td data-slot="table-empty" className={cn(styles.empty, className)} {...props}>
    {children}
  </td>
);

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
export type { TableEmptyProps };
export default Table;
