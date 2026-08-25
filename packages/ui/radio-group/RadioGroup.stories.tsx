import type { Meta, StoryObj } from '@storybook/react-vite';

import RadioGroup, { RadioGroupItem } from './RadioGroup';

const meta = { title: 'Forms/RadioGroup', component: RadioGroup } satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup name="delivery" defaultValue="email" aria-label="전송 방식">
      <RadioGroupItem value="email" label="이메일" />
      <RadioGroupItem value="sms" label="문자 메시지" />
    </RadioGroup>
  ),
};
