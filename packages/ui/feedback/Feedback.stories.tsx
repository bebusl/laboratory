import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress, Skeleton, Spinner } from './Feedback';

const meta = { title: 'Feedback/Loading', component: Progress } satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgressBar: Story = { args: { value: 68, 'aria-label': '업로드 진행률' } };
export const SpinnerState: Story = { render: () => <Spinner /> };
export const SkeletonState: Story = {
  render: () => (
    <div style={{ display: 'grid', width: 260, gap: 8 }}>
      <Skeleton />
      <Skeleton style={{ width: 180 }} />
    </div>
  ),
};
