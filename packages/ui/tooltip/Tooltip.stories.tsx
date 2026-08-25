import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '../button/Button';
import Tooltip from './Tooltip';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  args: { children: null, content: '추가 설명입니다.' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Tooltip {...args}>
      <Button variant="outline">도움말</Button>
    </Tooltip>
  ),
};
