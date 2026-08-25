import type { Meta, StoryObj } from '@storybook/react-vite';

import Tabs, { TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: { defaultValue: 'overview' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="settings">설정</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">캠페인 개요 내용</TabsContent>
      <TabsContent value="settings">캠페인 설정 내용</TabsContent>
    </Tabs>
  ),
};
