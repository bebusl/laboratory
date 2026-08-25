import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Alert from '../alert/Alert';
import Avatar from '../avatar/Avatar';
import Badge from '../badge/Badge';
import Button from '../button/Button';
import Combobox from '../combobox/Combobox';
import {
  Breadcrumb,
  BreadcrumbCurrent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../breadcrumb/Breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card/Card';
import Checkbox from '../checkbox/Checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog/Dialog';
import DropdownMenu, {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu/DropdownMenu';
import DatePicker from '../date-picker/DatePicker';
import EmptyState from '../empty-state/EmptyState';
import { Progress, Skeleton, Spinner } from '../feedback/Feedback';
import Pagination from '../pagination/Pagination';
import RadioGroup, { RadioGroupItem } from '../radio-group/RadioGroup';
import Select from '../select/Select';
import Separator from '../separator/Separator';
import Switch from '../switch/Switch';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table/Table';
import Tabs, { TabsContent, TabsList, TabsTrigger } from '../tabs/Tabs';
import Textarea from '../textarea/Textarea';
import Toast, { ToastClose } from '../toast/Toast';
import Tooltip from '../tooltip/Tooltip';

const meta = {
  title: 'Admin/Component catalogue',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Forms: Story = {
  render: () => (
    <div style={{ display: 'grid', maxWidth: 520, gap: 16 }}>
      <label>
        상태
        <Select defaultValue="active" style={{ marginTop: 6 }}>
          <option value="active">활성</option>
          <option value="draft">임시 저장</option>
        </Select>
      </label>
      <Textarea placeholder="관리자 메모를 입력하세요." />
      <Combobox
        placeholder="담당자를 검색하세요."
        options={[{ value: 'Jinhee' }, { value: 'Admin' }]}
      />
      <DatePicker aria-label="시작일" />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox defaultChecked /> 알림 받기
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        공개 상태 <Switch defaultChecked />
      </label>
      <RadioGroup name="delivery" defaultValue="email" aria-label="전송 방식">
        <RadioGroupItem value="email" label="이메일" />
        <RadioGroupItem value="sms" label="문자 메시지" />
      </RadioGroup>
    </div>
  ),
};

export const Feedback: Story = {
  render: () => (
    <div style={{ display: 'grid', maxWidth: 560, gap: 16 }}>
      <Alert title="저장 완료" variant="success">
        변경사항이 저장되었습니다.
      </Alert>
      <Alert title="확인이 필요합니다." variant="warning">
        필수 입력값을 확인하세요.
      </Alert>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Badge variant="success">활성</Badge>
        <Badge variant="warning">검토 중</Badge>
        <Badge variant="danger">실패</Badge>
        <Spinner />
      </div>
      <Progress value={68} />
      <Toast title="알림" variant="success">
        새 캠페인이 등록되었습니다.
        <ToastClose />
      </Toast>
      <div style={{ display: 'grid', gap: 8 }}>
        <Skeleton style={{ width: 240 }} />
        <Skeleton style={{ width: 160 }} />
      </div>
    </div>
  ),
};

export const DataDisplay: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Card>
        <CardHeader>
          <CardTitle>캠페인 현황</CardTitle>
          <CardDescription>최근 생성된 캠페인 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableCell>
                  <Avatar alt="Jinhee" size="sm" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>신규 고객 환영</TableCell>
                <TableCell>
                  <Badge variant="outline">초안</Badge>
                </TableCell>
                <TableCell>
                  <Avatar alt="Admin" size="sm" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination page={1} totalPages={4} onPageChange={() => undefined} />
        </CardFooter>
      </Card>
      <EmptyState
        title="아직 캠페인이 없습니다."
        description="첫 캠페인을 만들어 운영을 시작해보세요."
      >
        <span style={{ fontSize: 32 }}>＋</span>
      </EmptyState>
    </div>
  ),
};

export const NavigationAndOverlays: Story = {
  render: function Render() {
    const [tab, setTab] = useState('overview');

    return (
      <div style={{ display: 'grid', gap: 24 }}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">캠페인</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbCurrent>상세 보기</BreadcrumbCurrent>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Separator />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">캠페인 개요 내용</TabsContent>
          <TabsContent value="settings">캠페인 설정 내용</TabsContent>
        </Tabs>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tooltip content="추가 설명을 표시합니다.">
            <Button variant="outline">도움말</Button>
          </Tooltip>
          <Dialog>
            <DialogTrigger>편집</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>캠페인 편집</DialogTitle>
                <DialogDescription>캠페인 정보를 수정합니다.</DialogDescription>
              </DialogHeader>
              <p style={{ marginBottom: 0 }}>폼을 이 영역에 배치할 수 있습니다.</p>
              <DialogFooter>
                <DialogClose>닫기</DialogClose>
                <Button>저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>더 보기</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>복제</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  },
};
