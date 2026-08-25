import type { Meta, StoryObj } from '@storybook/react-vite';

import Badge from './Badge';

const meta = {
  title: 'Display/Badge',
  component: Badge,
  args: { children: '활성', variant: 'success' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Variants: Story = {
  render: args => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge {...args} variant="default" />
      <Badge {...args} variant="success" />
      <Badge {...args} variant="warning" />
      <Badge {...args} variant="danger" />
      <Badge {...args} variant="info" />
      <Badge {...args} variant="outline" />
    </div>
  ),
};
