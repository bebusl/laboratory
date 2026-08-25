import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta = { title: 'Layout/Card', component: Card } satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 420 }}>
      <CardHeader>
        <CardTitle>캠페인 현황</CardTitle>
        <CardDescription>최근 생성된 캠페인입니다.</CardDescription>
      </CardHeader>
      <CardContent>현재 활성 캠페인은 12개입니다.</CardContent>
      <CardFooter>업데이트: 방금 전</CardFooter>
    </Card>
  ),
};
