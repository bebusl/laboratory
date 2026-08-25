import type { Meta, StoryObj } from '@storybook/react-vite';

import Switch from './Switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  args: { 'aria-label': '공개 상태' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
