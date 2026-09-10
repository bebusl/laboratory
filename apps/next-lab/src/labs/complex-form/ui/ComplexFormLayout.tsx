'use client';

import type { ReactNode } from 'react';

import CreateCampaignNavigator from './CreateCampaignNavigator';
import { SidebarLayout } from './SidebarLayout';

interface ComplexFormLayoutProps {
  children: ReactNode;
}

export function ComplexFormLayout({ children }: ComplexFormLayoutProps) {
  return (
    <SidebarLayout
      sidebar={<CreateCampaignNavigator onChangeMode={mode => console.log(mode)} />}
      content={children}
    />
  );
}
