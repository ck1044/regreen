"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, Store, Calendar, Bell, BarChart3, PieChart, 
  ListFilter, ArrowUpRight, TrendingUp, TrendingDown, Loader2
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center mt-1">
          {trend.isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% 전주 대비
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// 차트 데이터
const userChartData = [
  { name: '1월', 신규가입: 120, 탈퇴: 20 },
  { name: '2월', 신규가입: 150, 탈퇴: 25 },
  { name: '3월', 신규가입: 180, 탈퇴: 18 },
  { name: '4월', 신규가입: 220, 탈퇴: 22 },
  { name: '5월', 신규가입: 280, 탈퇴: 30 },
  { name: '6월', 신규가입: 320, 탈퇴: 28 },
];

const shopChartData = [
  { name: '1월', 신규등록: 10, 폐점: 2 },
  { name: '2월', 신규등록: 12, 폐점: 1 },
  { name: '3월', 신규등록: 15, 폐점: 0 },
  { name: '4월', 신규등록: 18, 폐점: 3 },
  { name: '5월', 신규등록: 22, 폐점: 1 },
  { name: '6월', 신규등록: 25, 폐점: 2 },
];

const reservationChartData = [
  { name: '1월', 예약: 250 },
  { name: '2월', 예약: 320 },
  { name: '3월', 예약: 380 },
  { name: '4월', 예약: 450 },
  { name: '5월', 예약: 520 },
  { name: '6월', 예약: 580 },
];

const categoryData = [
  { name: '식품', value: 540 },
  { name: '생활용품', value: 320 },
  { name: '가전제품', value: 180 },
  { name: '의류', value: 280 },
  { name: '기타', value: 120 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // 실제 구현에서는 API 호출로 통계 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      // 가상의 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">관리자 대시보드</h1>
        <p className="text-muted-foreground text-sm">서비스 통계 및 데이터 관리</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview" className="md:px-4">
              <BarChart3 className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">개요</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="md:px-4">
              <Users className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">사용자</span>
            </TabsTrigger>
            <TabsTrigger value="shops" className="md:px-4">
              <Store className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">가게</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="md:px-4">
              <Calendar className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">예약</span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="md:px-4">
              <Bell className="h-4 w-4 mr-2 md:mr-2" />
              <span className="hidden md:inline">공지사항</span>
            </TabsTrigger>
          </TabsList>

          <div>
            <Button size="sm" variant="outline" className="md:px-4">
              <ListFilter className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">필터</span>
            </Button>
          </div>
        </div>

        {/* 개요 탭 */}
        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StatCard
              title="총 사용자"
              value="12,345"
              description="가입된 총 사용자 수"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="총 가게"
              value="1,234"
              description="등록된 총 가게 수"
              icon={<Store className="h-5 w-5" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="월간 예약"
              value="8,765"
              description="이번 달 총 예약 수"
              icon={<Calendar className="h-5 w-5" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="취소율"
              value="4.2%"
              description="이번 달 예약 취소율"
              icon={<ArrowUpRight className="h-5 w-5" />}
              trend={{ value: 1.5, isPositive: false }}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>월별 사용자 통계</CardTitle>
                <CardDescription>신규 가입 및 탈퇴 사용자 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="신규가입" stroke="#8884d8" />
                      <Line type="monotone" dataKey="탈퇴" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>예약 카테고리 분포</CardTitle>
                <CardDescription>카테고리별 예약 수</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 사용자 탭 */}
        <TabsContent value="users">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <StatCard
              title="총 사용자"
              value="12,345"
              description="가입된 총 사용자 수"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="일반 사용자"
              value="10,245"
              description="일반 사용자 계정 수"
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              title="상점 소유자"
              value="2,050"
              description="가게 소유자 계정 수"
              icon={<Store className="h-5 w-5" />}
            />
            <StatCard
              title="관리자"
              value="50"
              description="관리자 계정 수"
              icon={<Users className="h-5 w-5" />}
            />
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>월별 사용자 추이</CardTitle>
                <CardDescription>신규 가입 및 탈퇴 사용자 통계</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="신규가입" stroke="#8884d8" />
                      <Line type="monotone" dataKey="탈퇴" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button>
              사용자 관리로 이동
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* 가게 탭 */}
        <TabsContent value="shops">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <StatCard
              title="총 가게 수"
              value="1,234"
              description="등록된 총 가게 수"
              icon={<Store className="h-5 w-5" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="활성 가게"
              value="1,150"
              description="현재 활성화된 가게 수"
              icon={<Store className="h-5 w-5" />}
            />
            <StatCard
              title="신규 가게"
              value="84"
              description="이번 달 신규 등록 가게"
              icon={<Store className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="폐점 가게"
              value="24"
              description="이번 달 폐점 가게"
              icon={<Store className="h-5 w-5" />}
              trend={{ value: 2, isPositive: false }}
            />
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>월별 가게 추이</CardTitle>
                <CardDescription>신규 등록 및 폐점 가게 통계</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={shopChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="신규등록" fill="#8884d8" />
                      <Bar dataKey="폐점" fill="#ff7300" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button>
              가게 관리로 이동
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* 예약 탭 */}
        <TabsContent value="reservations">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <StatCard
              title="총 예약 수"
              value="8,765"
              description="이번 달 총 예약 수"
              icon={<Calendar className="h-5 w-5" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="완료된 예약"
              value="7,230"
              description="이번 달 완료된 예약 수"
              icon={<Calendar className="h-5 w-5" />}
            />
            <StatCard
              title="취소된 예약"
              value="365"
              description="이번 달 취소된 예약 수"
              icon={<Calendar className="h-5 w-5" />}
              trend={{ value: 1.5, isPositive: false }}
            />
            <StatCard
              title="취소율"
              value="4.2%"
              description="이번 달 예약 취소율"
              icon={<ArrowUpRight className="h-5 w-5" />}
              trend={{ value: 0.2, isPositive: false }}
            />
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>월별 예약 추이</CardTitle>
                <CardDescription>월별 예약 건수 통계</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={reservationChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="예약" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button>
              예약 관리로 이동
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* 공지사항 탭 */}
        <TabsContent value="notices">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <StatCard
              title="총 공지사항"
              value="124"
              description="등록된 총 공지사항 수"
              icon={<Bell className="h-5 w-5" />}
            />
            <StatCard
              title="이번 달 공지"
              value="12"
              description="이번 달 등록된 공지사항"
              icon={<Bell className="h-5 w-5" />}
            />
            <StatCard
              title="평균 조회수"
              value="845"
              description="공지사항 평균 조회수"
              icon={<PieChart className="h-5 w-5" />}
            />
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>공지사항 관리</CardTitle>
                <CardDescription>공지사항을 생성하고 관리합니다</CardDescription>
              </CardHeader>
              <CardContent className="text-center p-8">
                <p className="mb-4 text-muted-foreground">공지사항을 생성하거나 관리하려면 공지사항 관리 페이지로 이동하세요.</p>
                <Button>
                  공지사항 관리로 이동
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 