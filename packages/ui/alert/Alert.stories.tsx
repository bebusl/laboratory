import type { Meta, StoryObj } from '@storybook/react-vite';

import Alert from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  args: {
    children: '변경사항이 저장되었습니다.',
    title: '저장 완료',
    variant: 'success',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Danger: Story = { args: { title: '저장하지 못했습니다.', variant: 'danger' } };
