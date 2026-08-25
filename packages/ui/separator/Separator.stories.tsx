import type { Meta, StoryObj } from '@storybook/react-vite';

import Separator from './Separator';

const meta = { title: 'Layout/Separator', component: Separator } satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = {
  render: () => <Separator orientation="vertical" style={{ height: 48 }} />,
};
