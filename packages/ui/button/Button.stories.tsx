import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';

const meta = {
  component: Button,
  args: {
    children: '저장하기',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: args => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button {...args} variant="primary" />
      <Button {...args} variant="secondary" />
      <Button {...args} variant="outline" />
      <Button {...args} variant="ghost" />
      <Button {...args} variant="danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
