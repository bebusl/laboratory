import type { Meta, StoryObj } from '@storybook/react-vite';

import Input from '../input/Input';
import { Field, FieldDescription, FieldError, FieldLabel } from './Field';

const meta = {
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabelAndInput: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="name">이름</FieldLabel>
      <Input />
    </Field>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="email">이메일</FieldLabel>
      <Input />
      <FieldDescription>사용 가능한 이메일 주소를 입력하세요.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="password">비밀번호</FieldLabel>
      <Input />
      <FieldError errors={[{ message: '비밀번호는 8자 이상이어야 합니다.' }]} />
    </Field>
  ),
};
