import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, Pencil, Trash2, Users, Store } from 'lucide-react';
import NoticeActions from './_notice-actions';
import { cn } from '../../../../lib/utils';

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

// 공지사항 데이터 가져오기 함수
async function getNotice(id: string): Promise<Notice | null> {
  // 실제 구현에서는 API 호출로 공지사항 상세 정보 가져오기
  // 여기서는 목업 데이터 반환
  return {
    id,
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
}

type PageParams = Promise<{ id: string }>;

export default async function NoticeDetailPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const notice = await getNotice(id);

  // 공지사항이 없는 경우
  if (!notice) {
    return (
      <div className="container p-4">
        <div className="flex items-center mb-6">
          <Link href="/admin/notices" className="mr-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              돌아가기
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">공지사항 정보 없음</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">요청하신 공지사항 정보를 찾을 수 없습니다.</p>
              <Link href="/admin/notices">
                <Button className="mt-4">
                  공지사항 목록으로
                </Button>
              </Link>
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
          <Link href="/admin/notices" className="mr-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              돌아가기
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">공지사항 상세</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/notices/edit/${notice.id}`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              수정하기
            </Button>
          </Link>
          <NoticeActions noticeId={notice.id} noticeTitle={notice.title} category={notice.category} publishDate={notice.publishDate} />
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
          <Link href={`/notices/${notice.id}`} target="_blank">
            <Button variant="outline" size="sm">
              사용자 화면에서 보기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 