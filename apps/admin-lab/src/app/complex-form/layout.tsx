import { SidebarLayout } from '@/components/layout/sidebar-layout';
import CreateCampaignNavigator from '@/widgets/campaign-sidebar/ui/create-campaign-navigator';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <SidebarLayout sidebar={<CreateCampaignNavigator />} content={children} />;
};

export default Layout;
