"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Pencil,
  Trash2,
  MoreVertical,
  Search,
  Plus,
  ChevronDown,
  CheckCircle,
  X,
  Eye,
  Calendar,
  Users,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 공지사항 타입 정의
interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'update' | 'event' | 'maintenance';
  targetGroups: Array<'customer' | 'owner'>;
  publishDate: string;
  status: 'published' | 'scheduled' | 'draft';
  views: number;
}

// 목업 데이터
const mockNotices: Notice[] = [
  {
    id: '1',
    title: '서비스 이용약관 변경 안내',
    content: '2023년 7월 1일부터 적용되는 서비스 이용약관 변경에 대한 안내입니다.',
    category: 'general',
    targetGroups: ['customer', 'owner'],
    publishDate: '2023-06-15',
    status: 'published',
    views: 1254,
  },
  {
    id: '2',
    title: '앱 업데이트 안내 (v2.5.0)',
    content: '새로운 기능이 추가된 앱 업데이트가 출시되었습니다.',
    category: 'update',
    targetGroups: ['customer', 'owner'],
    publishDate: '2023-06-10',
    status: 'published',
    views: 987,
  },
  {
    id: '3',
    title: '여름 맞이 특별 할인 이벤트',
    content: '2023년 여름 맞이 특별 할인 이벤트를 시작합니다.',
    category: 'event',
    targetGroups: ['customer'],
    publishDate: '2023-06-01',
    status: 'published',
    views: 2345,
  },
  {
    id: '4',
    title: '서버 점검 안내',
    content: '2023년 7월 5일 새벽 2시부터 4시까지 서버 점검이 진행됩니다.',
    category: 'maintenance',
    targetGroups: ['customer', 'owner'],
    publishDate: '2023-07-05',
    status: 'scheduled',
    views: 0,
  },
  {
    id: '5',
    title: '사장님 전용 워크숍 안내',
    content: '사장님들을 위한 온라인 워크숍을 개최합니다.',
    category: 'event',
    targetGroups: ['owner'],
    publishDate: '2023-06-20',
    status: 'draft',
    views: 0,
  },
];

// 카테고리 정보
const categoryInfo = {
  general: { label: '일반', className: 'bg-blue-100 text-blue-800' },
  update: { label: '업데이트', className: 'bg-green-100 text-green-800' },
  event: { label: '이벤트', className: 'bg-purple-100 text-purple-800' },
  maintenance: { label: '점검', className: 'bg-orange-100 text-orange-800' },
};

// 상태 정보
const statusInfo = {
  published: { label: '발행됨', className: 'bg-green-100 text-green-800' },
  scheduled: { label: '예약됨', className: 'bg-blue-100 text-blue-800' },
  draft: { label: '임시저장', className: 'bg-gray-100 text-gray-800' },
};

export default function NoticesPage() {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 필터링된 공지사항 목록
  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || notice.status === statusFilter;
    const matchesTarget = targetFilter === 'all' || 
      (targetFilter === 'customer' && notice.targetGroups.includes('customer')) ||
      (targetFilter === 'owner' && notice.targetGroups.includes('owner'));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTarget;
  });

  // 공지사항 삭제 처리
  const handleDeleteNotice = (id: string) => {
    // 실제 구현에서는 API 호출로 공지사항 삭제
    console.log('공지사항 삭제:', id);
    toast.success('공지사항이 삭제되었습니다.');
    setIsDeleteDialogOpen(false);
  };

  // 대상 그룹 표시
  const renderTargetGroups = (targetGroups: Array<'customer' | 'owner'>) => {
    return (
      <div className="flex space-x-1">
        {targetGroups.includes('customer') && (
          <Badge variant="outline" className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span className="text-xs">사용자</span>
          </Badge>
        )}
        {targetGroups.includes('owner') && (
          <Badge variant="outline" className="flex items-center">
            <Store className="h-3 w-3 mr-1" />
            <span className="text-xs">사장님</span>
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="container p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Button 
          onClick={() => router.push('/admin/notices/create')}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          새 공지사항
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>공지사항 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="공지사항 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  {Object.entries(categoryInfo).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  {Object.entries(statusInfo).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="대상" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 대상</SelectItem>
                  <SelectItem value="customer">일반 사용자</SelectItem>
                  <SelectItem value="owner">사장님</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>대상</TableHead>
                  <TableHead>발행일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>조회수</TableHead>
                  <TableHead className="w-[80px]">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell className="font-medium">
                        <div 
                          className="cursor-pointer hover:underline"
                          onClick={() => router.push(`/admin/notices/${notice.id}`)}
                        >
                          {notice.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(categoryInfo[notice.category].className)}>
                          {categoryInfo[notice.category].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {renderTargetGroups(notice.targetGroups)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {notice.status === 'scheduled' ? (
                          <div className="flex items-center text-xs">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {notice.publishDate}
                          </div>
                        ) : notice.status === 'draft' ? (
                          '-'
                        ) : (
                          notice.publishDate
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(statusInfo[notice.status].className)}>
                          {statusInfo[notice.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {notice.status === 'published' ? notice.views.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">메뉴 열기</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/notices/${notice.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              상세 보기
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/notices/edit/${notice.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              수정하기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedNotice(notice);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              삭제하기
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedNotice && (
              <div className="border rounded-md p-3 bg-muted/50">
                <p className="font-medium">{selectedNotice.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cn(categoryInfo[selectedNotice.category].className)}>
                    {categoryInfo[selectedNotice.category].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    발행일: {selectedNotice.publishDate}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={() => selectedNotice && handleDeleteNotice(selectedNotice.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 