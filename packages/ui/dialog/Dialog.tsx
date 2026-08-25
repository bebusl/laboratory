import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Dialog.module.scss';

type DialogContextValue = {
  contentId: string;
  descriptionId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Dialog = ({ children, defaultOpen = false, onOpenChange, open }: DialogProps) => {
  const baseId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentOpen = open ?? internalOpen;
  const setOpen = (nextOpen: boolean) => {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <DialogContext.Provider
      value={{
        contentId: `${baseId}-content`,
        descriptionId: `${baseId}-description`,
        open: currentOpen,
        setOpen,
        titleId: `${baseId}-title`,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('Dialog components must be used inside <Dialog>.');
  return context;
};

const DialogTrigger = ({ className, onClick, ...props }: ComponentPropsWithoutRef<'button'>) => {
  const dialog = useDialog();

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      className={className}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) dialog.setOpen(true);
      }}
      {...props}
    />
  );
};

type DialogContentProps = ComponentPropsWithoutRef<'dialog'> & {
  children: ReactNode;
};

const DialogContent = ({
  children,
  className,
  onCancel,
  onClose,
  ...props
}: DialogContentProps) => {
  const dialog = useDialog();
  const ref = useRef<ComponentRef<'dialog'>>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (dialog.open && !element.open) element.showModal();
    if (!dialog.open && element.open) element.close();
  }, [dialog.open]);

  return (
    <dialog
      ref={ref}
      aria-describedby={dialog.descriptionId}
      aria-labelledby={dialog.titleId}
      data-slot="dialog-content"
      className={cn(styles.content, className)}
      onCancel={event => {
        onCancel?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          dialog.setOpen(false);
        }
      }}
      onClose={event => {
        onClose?.(event);
        dialog.setOpen(false);
      }}
      {...props}
    >
      {children}
    </dialog>
  );
};

const DialogHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div data-slot="dialog-header" className={cn(styles.header, className)} {...props} />
);

const DialogTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => {
  const dialog = useDialog();
  return (
    <h2
      id={dialog.titleId}
      data-slot="dialog-title"
      className={cn(styles.title, className)}
      {...props}
    />
  );
};

const DialogDescription = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => {
  const dialog = useDialog();
  return (
    <p
      id={dialog.descriptionId}
      data-slot="dialog-description"
      className={cn(styles.description, className)}
      {...props}
    />
  );
};

const DialogFooter = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div data-slot="dialog-footer" className={cn(styles.footer, className)} {...props} />
);

const DialogClose = ({ className, onClick, ...props }: ComponentPropsWithoutRef<'button'>) => {
  const dialog = useDialog();

  return (
    <button
      type="button"
      data-slot="dialog-close"
      className={cn(styles.close, className)}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) dialog.setOpen(false);
      }}
      {...props}
    />
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
export type { DialogContentProps, DialogProps };
export default Dialog;
