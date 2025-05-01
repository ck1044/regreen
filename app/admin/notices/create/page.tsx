<<<<<<< HEAD:app/admin/notices/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectGroup, 
  SelectItem, SelectLabel, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Bell, ChevronLeft, Eye, Send, 
  Calendar, Clock, CheckCircle, Users, Store, 
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

// 공지사항 폼 스키마
const noticeFormSchema = z.object({
  title: z.string().min(1, { message: '공지사항 제목을 입력해주세요.' }),
  content: z.string().min(10, { message: '최소 10자 이상 입력해주세요.' }),
  category: z.enum(['general', 'update', 'event', 'maintenance'], {
    required_error: '카테고리를 선택해주세요.',
  }),
  targetGroups: z.array(z.string()).min(1, { message: '최소 하나 이상의 대상 그룹을 선택해주세요.' }),
  publishImmediately: z.boolean().default(true),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  sendNotification: z.boolean().default(true),
});

// 폼 타입
type NoticeFormValues = z.infer<typeof noticeFormSchema>;

export default function CreateNoticePage() {
  const router = useRouter();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 초기화
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      targetGroups: ['customer', 'owner'],
      publishImmediately: true,
      sendNotification: true,
    },
  });

  // 스케줄 설정 여부
  const publishImmediately = form.watch('publishImmediately');
  
  // 폼 제출 핸들러
  const onSubmit = async (values: NoticeFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('공지사항 작성:', values);
      
      // 실제 구현에서는 API 호출로 공지사항 저장
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('공지사항이 성공적으로 작성되었습니다.');
      router.push('/admin/notices');
    } catch (error) {
      console.error('공지사항 작성 오류:', error);
      toast.error('공지사항 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 대상 그룹 옵션
  const targetGroupOptions = [
    { id: 'customer', label: '일반 사용자', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'owner', label: '사장님', icon: <Store className="h-4 w-4 mr-2" /> },
  ];

  // 카테고리 정보
  const categoryInfo = {
    general: { label: '일반', description: '일반적인 공지사항' },
    update: { label: '업데이트', description: '서비스 업데이트 안내' },
    event: { label: '이벤트', description: '이벤트 및 프로모션 안내' },
    maintenance: { label: '점검', description: '서비스 점검 안내' },
  };
  
  // 미리보기 모드 토글
  const togglePreviewMode = () => {
    if (!form.getValues('title') || !form.getValues('content')) {
      toast.error('제목과 내용을 입력한 후 미리보기를 확인할 수 있습니다.');
      return;
    }
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="container p-4 pb-20">
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
        <h1 className="text-2xl font-bold">새 공지사항 작성</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>공지사항 정보</CardTitle>
          <CardDescription>
            공지사항 정보를 입력하고 대상 그룹을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPreviewMode ? (
            // 미리보기 모드
            <div className="py-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{form.getValues('title')}</h2>
                <div className="flex items-center">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    form.getValues('category') === 'general' && "bg-blue-100 text-blue-800",
                    form.getValues('category') === 'update' && "bg-green-100 text-green-800",
                    form.getValues('category') === 'event' && "bg-purple-100 text-purple-800",
                    form.getValues('category') === 'maintenance' && "bg-orange-100 text-orange-800",
                  )}>
                    {categoryInfo[form.getValues('category')]?.label}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <span>작성자: 관리자</span>
                  <span>등록일: {new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    <span>대상: {form.getValues('targetGroups').map(id => 
                      targetGroupOptions.find(option => option.id === id)?.label
                    ).join(', ')}</span>
                  </div>
                  {!form.getValues('publishImmediately') && (
                    <div className="flex items-center ml-2">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>예약: {form.getValues('scheduleDate')} {form.getValues('scheduleTime')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="prose max-w-full border-t border-b py-6 my-4 whitespace-pre-line">
                {form.getValues('content')}
              </div>
            </div>
          ) : (
            // 입력 폼
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="공지사항 제목을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="공지사항 내용을 입력하세요" 
                          {...field} 
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>카테고리</SelectLabel>
                              {Object.entries(categoryInfo).map(([value, { label, description }]) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex flex-col">
                                    <span>{label}</span>
                                    <span className="text-xs text-muted-foreground">{description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetGroups"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>대상 그룹</FormLabel>
                          <FormDescription>
                            공지사항을 수신할 대상 그룹을 선택하세요.
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {targetGroupOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="targetGroups"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="flex items-center font-normal">
                                      {option.icon}
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="publishImmediately"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">즉시 발행</FormLabel>
                        <FormDescription>
                          공지사항을 즉시 발행하거나 특정 시간에 발행하도록 예약할 수 있습니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!publishImmediately && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduleDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>발행 날짜</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheduleTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>발행 시간</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="time" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="sendNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">알림 발송</FormLabel>
                        <FormDescription>
                          공지사항 발행 시 사용자에게 알림을 발송합니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={togglePreviewMode}
          >
            {isPreviewMode ? (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                편집으로 돌아가기
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                미리보기
              </>
            )}
          </Button>
          {!isPreviewMode && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/notices')}
              >
                취소
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>저장 중...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    공지사항 발행
                  </>
                )}
              </Button>
            </div>
          )}
          {isPreviewMode && (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>저장 중...</>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  확인하고 발행하기
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
=======
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectGroup, 
  SelectItem, SelectLabel, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Bell, ChevronLeft, Eye, Send, 
  Calendar, Clock, CheckCircle, Users, Store, 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 공지사항 폼 스키마
const noticeFormSchema = z.object({
  title: z.string().min(1, { message: '공지사항 제목을 입력해주세요.' }),
  content: z.string().min(10, { message: '최소 10자 이상 입력해주세요.' }),
  category: z.enum(['general', 'update', 'event', 'maintenance'], {
    required_error: '카테고리를 선택해주세요.',
  }),
  targetGroups: z.array(z.string()).min(1, { message: '최소 하나 이상의 대상 그룹을 선택해주세요.' }),
  publishImmediately: z.boolean().default(true),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  sendNotification: z.boolean().default(true),
});

// 폼 타입
type NoticeFormValues = z.infer<typeof noticeFormSchema>;

export default function CreateNoticePage() {
  const router = useRouter();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 초기화
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      targetGroups: ['customer', 'owner'],
      publishImmediately: true,
      sendNotification: true,
    },
  });

  // 스케줄 설정 여부
  const publishImmediately = form.watch('publishImmediately');
  
  // 폼 제출 핸들러
  const onSubmit = async (values: NoticeFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('공지사항 작성:', values);
      
      // 실제 구현에서는 API 호출로 공지사항 저장
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('공지사항이 성공적으로 작성되었습니다.');
      router.push('/admin/notices');
    } catch (error) {
      console.error('공지사항 작성 오류:', error);
      toast.error('공지사항 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 대상 그룹 옵션
  const targetGroupOptions = [
    { id: 'customer', label: '일반 사용자', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'owner', label: '사장님', icon: <Store className="h-4 w-4 mr-2" /> },
  ];

  // 카테고리 정보
  const categoryInfo = {
    general: { label: '일반', description: '일반적인 공지사항' },
    update: { label: '업데이트', description: '서비스 업데이트 안내' },
    event: { label: '이벤트', description: '이벤트 및 프로모션 안내' },
    maintenance: { label: '점검', description: '서비스 점검 안내' },
  };
  
  // 미리보기 모드 토글
  const togglePreviewMode = () => {
    if (!form.getValues('title') || !form.getValues('content')) {
      toast.error('제목과 내용을 입력한 후 미리보기를 확인할 수 있습니다.');
      return;
    }
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="container p-4 pb-20">
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
        <h1 className="text-2xl font-bold">새 공지사항 작성</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>공지사항 정보</CardTitle>
          <CardDescription>
            공지사항 정보를 입력하고 대상 그룹을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPreviewMode ? (
            // 미리보기 모드
            <div className="py-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{form.getValues('title')}</h2>
                <div className="flex items-center">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    form.getValues('category') === 'general' && "bg-blue-100 text-blue-800",
                    form.getValues('category') === 'update' && "bg-green-100 text-green-800",
                    form.getValues('category') === 'event' && "bg-purple-100 text-purple-800",
                    form.getValues('category') === 'maintenance' && "bg-orange-100 text-orange-800",
                  )}>
                    {categoryInfo[form.getValues('category')]?.label}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <span>작성자: 관리자</span>
                  <span>등록일: {new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    <span>대상: {form.getValues('targetGroups').map(id => 
                      targetGroupOptions.find(option => option.id === id)?.label
                    ).join(', ')}</span>
                  </div>
                  {!form.getValues('publishImmediately') && (
                    <div className="flex items-center ml-2">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>예약: {form.getValues('scheduleDate')} {form.getValues('scheduleTime')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="prose max-w-full border-t border-b py-6 my-4 whitespace-pre-line">
                {form.getValues('content')}
              </div>
            </div>
          ) : (
            // 입력 폼
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="공지사항 제목을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="공지사항 내용을 입력하세요" 
                          {...field} 
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>카테고리</SelectLabel>
                              {Object.entries(categoryInfo).map(([value, { label, description }]) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex flex-col">
                                    <span>{label}</span>
                                    <span className="text-xs text-muted-foreground">{description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetGroups"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>대상 그룹</FormLabel>
                          <FormDescription>
                            공지사항을 수신할 대상 그룹을 선택하세요.
                          </FormDescription>
                        </div>
                        <div className="space-y-2">
                          {targetGroupOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="targetGroups"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="flex items-center font-normal">
                                      {option.icon}
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="publishImmediately"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">즉시 발행</FormLabel>
                        <FormDescription>
                          공지사항을 즉시 발행하거나 특정 시간에 발행하도록 예약할 수 있습니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!publishImmediately && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="scheduleDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>발행 날짜</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheduleTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>발행 시간</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="time" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="sendNotification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">알림 발송</FormLabel>
                        <FormDescription>
                          공지사항 발행 시 사용자에게 알림을 발송합니다.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={togglePreviewMode}
          >
            {isPreviewMode ? (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                편집으로 돌아가기
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                미리보기
              </>
            )}
          </Button>
          {!isPreviewMode && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/notices')}
              >
                취소
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>저장 중...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    공지사항 발행
                  </>
                )}
              </Button>
            </div>
          )}
          {isPreviewMode && (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>저장 중...</>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  확인하고 발행하기
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
>>>>>>> cb6d9317783f36cb79baa897bfe8c7f9596ba0ce:src/app/admin/notices/create/page.tsx
} 