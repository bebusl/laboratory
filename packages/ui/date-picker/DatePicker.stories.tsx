import type { Meta, StoryObj } from '@storybook/react-vite';

import DatePicker from './DatePicker';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  args: { 'aria-label': '시작일' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: '2026-08-25' } };
