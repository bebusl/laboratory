import { createContext, useContext, useId, useState } from 'react';
import type { ComponentPropsWithoutRef, ComponentRef, KeyboardEvent } from 'react';
import cn from 'classnames';

import styles from './Tabs.module.scss';

type TabsContextValue = {
  baseId: string;
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

type TabsProps = ComponentPropsWithoutRef<'div'> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const Tabs = ({
  children,
  className,
  defaultValue = '',
  onValueChange,
  value,
  ...props
}: TabsProps) => {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const setValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <TabsContext.Provider value={{ baseId, setValue, value: currentValue }}>
      <div data-slot="tabs" className={cn(styles.root, className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used inside <Tabs>.');
  return context;
};

const TabsList = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div role="tablist" data-slot="tabs-list" className={cn(styles.list, className)} {...props} />
);

type TabsTriggerProps = ComponentPropsWithoutRef<'button'> & {
  value: string;
};

const TabsTrigger = ({ children, className, value, ...props }: TabsTriggerProps) => {
  const tabs = useTabs();
  const isActive = tabs.value === value;
  const triggerId = `${tabs.baseId}-trigger-${value}`;
  const panelId = `${tabs.baseId}-panel-${value}`;

  const handleKeyDown = (event: KeyboardEvent<ComponentRef<'button'>>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const triggers = Array.from(
      event.currentTarget.parentElement?.querySelectorAll('[role="tab"]') ?? []
    );
    const index = triggers.indexOf(event.currentTarget);
    const nextIndex = event.key === 'ArrowRight' ? index + 1 : index - 1;
    const nextTrigger = triggers[(nextIndex + triggers.length) % triggers.length] as unknown as
      | { dataset: { value?: string }; focus: () => void }
      | undefined;
    nextTrigger?.focus();
    if (nextTrigger?.dataset.value) tabs.setValue(nextTrigger.dataset.value);
  };

  return (
    <button
      type="button"
      role="tab"
      id={triggerId}
      aria-controls={panelId}
      aria-selected={isActive}
      data-value={value}
      data-state={isActive ? 'active' : 'inactive'}
      tabIndex={isActive ? 0 : -1}
      className={cn(styles.trigger, isActive && styles.active, className)}
      onClick={() => tabs.setValue(value)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
};

type TabsContentProps = ComponentPropsWithoutRef<'div'> & {
  value: string;
};

const TabsContent = ({ children, className, value, ...props }: TabsContentProps) => {
  const tabs = useTabs();
  const isActive = tabs.value === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${tabs.baseId}-panel-${value}`}
      aria-labelledby={`${tabs.baseId}-trigger-${value}`}
      data-slot="tabs-content"
      className={cn(styles.content, className)}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
export type { TabsContentProps, TabsProps, TabsTriggerProps };
export default Tabs;
