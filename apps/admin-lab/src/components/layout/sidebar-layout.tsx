// shared/ui/layouts/SidebarLayout.tsx
interface SidebarLayoutProps {
  sidebar: React.ReactNode; // 왼쪽 슬롯
  content: React.ReactNode; // 오른쪽 슬롯
}

export const SidebarLayout = ({ sidebar, content }: SidebarLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-white border-r">{sidebar}</aside>
      <main className="flex-1 ml-64 p-8">{content}</main>
    </div>
  );
};
