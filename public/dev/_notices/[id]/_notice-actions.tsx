"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';

// 카테고리 정보
const categoryInfo = {
  general: { label: '일반', className: 'bg-blue-100 text-blue-800' },
  update: { label: '업데이트', className: 'bg-green-100 text-green-800' },
  event: { label: '이벤트', className: 'bg-purple-100 text-purple-800' },
  maintenance: { label: '점검', className: 'bg-orange-100 text-orange-800' },
};

interface NoticeActionsProps {
  noticeId: string;
  noticeTitle: string;
  category: 'general' | 'update' | 'event' | 'maintenance';
  publishDate: string;
}

export default function NoticeActions({ 
  noticeId, 
  noticeTitle,
  category,
  publishDate 
}: NoticeActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  return (
    <>
      <Button 
        variant="outline"
        className="text-destructive border-destructive hover:bg-destructive/10"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        삭제하기
      </Button>

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
              <p className="font-medium">{noticeTitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn(categoryInfo[category].className)}>
                  {categoryInfo[category].label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  발행일: {publishDate}
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
    </>
  );
} 