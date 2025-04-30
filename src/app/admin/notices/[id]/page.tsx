"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import { Calendar, ChevronLeft, Pencil, Trash2, Users, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

// 공지사항 타입
interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'update' | 'event' | 'maintenance';
  targetGroups: Array<'customer' | 'owner'>;
  publishDate: string;
  status: 'published' | 'scheduled' | 'draft';
  views: number;
  author: string;
}

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

export default function NoticeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 공지사항 ID
  const noticeId = params.id;

  // 목업 데이터 불러오기 (API 호출 대체)
  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        // 실제 구현에서는 API 호출로 공지사항 상세 정보 가져오기
        await new Promise(resolve => setTimeout(resolve, 500));

        // 목업 데이터
        const mockNotice: Notice = {
          id: noticeId,
          title: '서비스 이용약관 변경 안내',
          content: `안녕하세요, 리그린 서비스를 이용해 주시는 고객님들께 감사드립니다.

2023년 7월 1일부터 적용되는 서비스 이용약관 변경 사항을 안내드립니다.

▶ 주요 변경 사항
1. 개인정보 보호정책 강화
2. 예약 취소 및 환불 정책 변경
3. 사용자 콘텐츠 관련 정책 업데이트

자세한 내용은 서비스 이용약관 페이지를 참고해 주시기 바랍니다.
문의사항이 있으시면 고객센터로 연락 부탁드립니다.

감사합니다.`,
          category: 'general',
          targetGroups: ['customer', 'owner'],
          publishDate: '2023-06-15',
          status: 'published',
          views: 1254,
          author: '관리자',
        };

        setNotice(mockNotice);
      } catch (error) {
        console.error('공지사항 상세 정보 로딩 오류:', error);
        toast.error('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [noticeId]);

  // 공지사항 삭제 처리
  const handleDeleteNotice = async () => {
    try {
      // 실제 구현에서는 API 호출로 공지사항 삭제
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('공지사항이 삭제되었습니다.');
      router.push('/admin/notices');
    } catch (error) {
      console.error('공지사항 삭제 오류:', error);
      toast.error('공지사항 삭제 중 오류가 발생했습니다.');
    }
  };

  // 대상 그룹 표시
  const renderTargetGroups = (targetGroups: Array<'customer' | 'owner'>) => {
    const targetLabels = [];
    
    if (targetGroups.includes('customer')) {
      targetLabels.push('일반 사용자');
    }
    
    if (targetGroups.includes('owner')) {
      targetLabels.push('사장님');
    }
    
    return targetLabels.join(', ');
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="container p-4 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 공지사항이 없는 경우
  if (!notice) {
    return (
      <div className="container p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => router.push('/admin/notices')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">공지사항 정보 없음</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">요청하신 공지사항 정보를 찾을 수 없습니다.</p>
              <Button 
                className="mt-4"
                onClick={() => router.push('/admin/notices')}
              >
                공지사항 목록으로
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => router.push('/admin/notices')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">공지사항 상세</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/admin/notices/edit/${notice.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            수정하기
          </Button>
          <Button 
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제하기
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-2xl">{notice.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>작성자: {notice.author}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                  <span>등록일: {notice.publishDate}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                  <span>조회수: {notice.views.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge className={cn(categoryInfo[notice.category].className)}>
                  {categoryInfo[notice.category].label}
                </Badge>
                <Badge className={cn(statusInfo[notice.status].className)}>
                  {statusInfo[notice.status].label}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">대상 그룹</h3>
              <div className="flex gap-1">
                {notice.targetGroups.includes('customer') && (
                  <Badge variant="outline" className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span className="text-xs">사용자</span>
                  </Badge>
                )}
                {notice.targetGroups.includes('owner') && (
                  <Badge variant="outline" className="flex items-center">
                    <Store className="h-3 w-3 mr-1" />
                    <span className="text-xs">사장님</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="prose max-w-full">
            <div className="whitespace-pre-line">{notice.content}</div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <div className="text-sm text-muted-foreground">
            최종 수정일: {notice.publishDate}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`/notices/${notice.id}`, '_blank')}
          >
            사용자 화면에서 보기
          </Button>
        </CardFooter>
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
            <div className="border rounded-md p-3 bg-muted/50">
              <p className="font-medium">{notice.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn(categoryInfo[notice.category].className)}>
                  {categoryInfo[notice.category].label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  발행일: {notice.publishDate}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteNotice}
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