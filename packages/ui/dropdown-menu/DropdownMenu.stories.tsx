import type { Meta, StoryObj } from '@storybook/react-vite';

import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

const meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  args: { children: null },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>더 보기</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>복제</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
