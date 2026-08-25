import type { Meta, StoryObj } from '@storybook/react-vite';

import Combobox from './Combobox';

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  args: {
    'aria-label': '담당자',
    options: [{ value: 'Jinhee' }, { value: 'Admin' }, { value: 'Support' }],
    placeholder: '담당자를 검색하세요.',
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
