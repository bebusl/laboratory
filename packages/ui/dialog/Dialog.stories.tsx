import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  args: { children: null },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>캠페인 편집</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>캠페인 편집</DialogTitle>
          <DialogDescription>캠페인 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <p>폼을 이 영역에 배치할 수 있습니다.</p>
        <DialogFooter>
          <DialogClose>닫기</DialogClose>
          <DialogClose>저장</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
