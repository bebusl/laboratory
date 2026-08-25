import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '../button/Button';
import EmptyState from './EmptyState';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  args: {
    title: '아직 캠페인이 없습니다.',
    description: '첫 캠페인을 만들어 운영을 시작해보세요.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { action: <Button>캠페인 만들기</Button> } };
