import type { ComponentPropsWithoutRef } from 'react';
import cn from 'classnames';

import styles from './Pagination.module.scss';

type PaginationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

function getPageItems(
  page: number,
  totalPages: number,
  siblingCount: number
): Array<number | 'ellipsis'> {
  const totalVisible = siblingCount * 2 + 5;

  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, totalPages - 1);
  const items: Array<number | 'ellipsis'> = [1];

  if (left > 2) items.push('ellipsis');
  for (let current = left; current <= right; current += 1) items.push(current);
  if (right < totalPages - 1) items.push('ellipsis');
  items.push(totalPages);

  return items;
}

const Pagination = ({
  className,
  onPageChange,
  page,
  siblingCount = 1,
  totalPages,
  ...props
}: PaginationProps) => {
  if (totalPages <= 0) return null;

  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const items = getPageItems(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={cn(styles.root, className)}
      {...props}
    >
      <button
        type="button"
        className={styles.button}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        이전
      </button>
      <div className={styles.pages}>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === currentPage ? 'page' : undefined}
              className={cn(styles.button, item === currentPage && styles.current)}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}
      </div>
      <button
        type="button"
        className={styles.button}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        다음
      </button>
    </nav>
  );
};

export { Pagination };
export type { PaginationProps };
export default Pagination;
