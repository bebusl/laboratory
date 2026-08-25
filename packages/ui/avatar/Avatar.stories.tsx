import type { Meta, StoryObj } from '@storybook/react-vite';

import Avatar from './Avatar';

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  args: { alt: 'Jinhee' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};
export const CustomFallback: Story = { args: { alt: '', fallback: 'JH', size: 'lg' } };
