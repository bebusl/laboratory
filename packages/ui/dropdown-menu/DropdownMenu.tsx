import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './DropdownMenu.module.scss';

type DropdownMenuContextValue = {
  contentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

type DropdownMenuProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DropdownMenu = ({ children, defaultOpen = false, onOpenChange, open }: DropdownMenuProps) => {
  const id = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentOpen = open ?? internalOpen;
  const setOpen = (nextOpen: boolean) => {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <DropdownMenuContext.Provider
      value={{ contentId: `${id}-content`, open: currentOpen, setOpen }}
    >
      <div className={styles.root} data-slot="dropdown-menu">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenu components must be used inside <DropdownMenu>.');
  return context;
};

const DropdownMenuTrigger = ({
  className,
  onClick,
  ...props
}: ComponentPropsWithoutRef<'button'>) => {
  const menu = useDropdownMenu();

  return (
    <button
      type="button"
      aria-expanded={menu.open}
      aria-controls={menu.contentId}
      data-slot="dropdown-menu-trigger"
      className={className}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) menu.setOpen(!menu.open);
      }}
      {...props}
    />
  );
};

type DropdownMenuContentProps = ComponentPropsWithoutRef<'div'> & {
  align?: 'start' | 'end';
};

const DropdownMenuContent = ({
  align = 'start',
  children,
  className,
  ...props
}: DropdownMenuContentProps) => {
  const menu = useDropdownMenu();
  const ref = useRef<ComponentRef<'div'>>(null);

  useEffect(() => {
    if (!menu.open) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') menu.setOpen(false);
    };

    const ownerDocument = ref.current?.ownerDocument;
    ownerDocument?.addEventListener('keydown', handleKeyDown);
    return () => ownerDocument?.removeEventListener('keydown', handleKeyDown);
  }, [menu]);

  if (!menu.open) return null;

  return (
    <div
      ref={ref}
      id={menu.contentId}
      role="menu"
      data-slot="dropdown-menu-content"
      data-align={align}
      className={cn(styles.content, styles[align], className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DropdownMenuItemProps = ComponentPropsWithoutRef<'button'> & {
  inset?: boolean;
};

const DropdownMenuItem = ({
  className,
  inset = false,
  onClick,
  ...props
}: DropdownMenuItemProps) => {
  const menu = useDropdownMenu();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="dropdown-menu-item"
      className={cn(styles.item, inset && styles.inset, className)}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) menu.setOpen(false);
      }}
      {...props}
    />
  );
};

const DropdownMenuSeparator = ({ className, ...props }: ComponentPropsWithoutRef<'hr'>) => (
  <hr data-slot="dropdown-menu-separator" className={cn(styles.separator, className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
export type { DropdownMenuContentProps, DropdownMenuItemProps, DropdownMenuProps };
export default DropdownMenu;
