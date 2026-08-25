import type { Meta, StoryObj } from '@storybook/react-vite';

import Badge from '../badge/Badge';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

const meta = { title: 'Data/Table', component: Table } satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>캠페인</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>담당자</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>여름 프로모션</TableCell>
          <TableCell>
            <Badge variant="success">활성</Badge>
          </TableCell>
          <TableCell>Jinhee</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>신규 고객 환영</TableCell>
          <TableCell>
            <Badge variant="outline">초안</Badge>
          </TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
