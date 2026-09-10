import type { ReactNode } from 'react';

interface SidebarLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export const SidebarLayout = ({ sidebar, content }: SidebarLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-white border-r">{sidebar}</aside>
      <main className="flex-1 ml-64 p-8">{content}</main>
    </div>
  );
};
