import type { Meta, StoryObj } from '@storybook/react-vite';

import Pagination from './Pagination';

const meta = {
  title: 'Data/Pagination',
  component: Pagination,
  args: { page: 3, totalPages: 12, onPageChange: () => undefined },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FirstPage: Story = { args: { page: 1 } };
