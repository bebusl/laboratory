'use client';

import { SidebarLayout } from '@/components/layout/sidebar-layout';
import CreateCampaignNavigator from '@/widgets/campaign-sidebar/ui/create-campaign-navigator';

import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarLayout
      sidebar={<CreateCampaignNavigator onChangeMode={mode => console.log(mode)} />}
      content={children}
    />
  );
};

export default Layout;
