import type { Meta, StoryObj } from '@storybook/react-vite';

import Textarea from './Textarea';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  args: { placeholder: '관리자 메모를 입력하세요.' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { 'aria-invalid': true } };
