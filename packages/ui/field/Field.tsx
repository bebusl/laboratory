'use client';

import { useMemo } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import cn from 'classnames';
import styles from './Field.module.scss';

type Orientation = 'vertical' | 'horizontal' | 'responsive';

function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return <fieldset data-slot="field-set" className={cn(styles.fieldSet, className)} {...props} />;
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(styles.fieldLegend, className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn(styles.fieldGroup, className)} {...props} />;
}

function Field({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<'div'> & { orientation?: Orientation }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(styles.field, className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="field-content" className={cn(styles.fieldContent, className)} {...props} />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<'label'>) {
  return <label data-slot="field-label" className={cn(styles.fieldLabel, className)} {...props} />;
}

function FieldTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-label" className={cn(styles.fieldTitle, className)} {...props} />;
}

function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(styles.fieldDescription, className)}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: ComponentProps<'div'> & { children?: ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(styles.fieldSeparator, className)}
      {...props}
    >
      <hr className={styles.fieldSeparatorLine} />
      {children && (
        <span className={styles.fieldSeparatorContent} data-slot="field-separator-content">
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;

    const uniqueErrors = [...new Map(errors.map(error => [error?.message, error])).values()];

    if (uniqueErrors.length === 1) return uniqueErrors[0]?.message;

    return (
      <ul className={styles.fieldErrorList}>
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(styles.fieldError, className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
