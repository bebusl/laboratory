import type { Meta, StoryObj } from '@storybook/react-vite';

import Toast, { ToastClose } from './Toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  args: { children: '새 캠페인이 등록되었습니다.', title: '알림', variant: 'success' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Toast {...args}>
      <ToastClose />
    </Toast>
  ),
};
export const Hidden: Story = { args: { open: false } };
