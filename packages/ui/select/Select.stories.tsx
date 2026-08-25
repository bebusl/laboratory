import type { Meta, StoryObj } from '@storybook/react-vite';

import Select from './Select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  args: { 'aria-label': '상태' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Select {...args} defaultValue="active">
      <option value="active">활성</option>
      <option value="draft">임시 저장</option>
    </Select>
  ),
};
