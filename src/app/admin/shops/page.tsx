"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectGroup, 
  SelectItem, SelectLabel, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, Search, ChevronLeft, ChevronRight, 
  Edit, Trash2, PlusCircle, Filter, CheckCircle, XCircle, Eye, Star
} from 'lucide-react';

// 가게 타입 정의
interface ShopData {
  id: string;
  name: string;
  owner: string;
  location: string;
  category: string;
  rating: number;
  status: 'active' | 'pending' | 'suspended' | 'closed';
  registeredAt: string;
  lastUpdated: string;
}

// 가상의 가게 데이터
const mockShops: ShopData[] = [
  {
    id: "shop-1",
    name: "그린 마트",
    owner: "김그린",
    location: "서울 강남구 역삼동 123-45",
    category: "식품",
    rating: 4.5,
    status: "active",
    registeredAt: "2023-01-15",
    lastUpdated: "2023-06-28"
  },
  {
    id: "shop-2",
    name: "프레시 베이커리",
    owner: "이도윤",
    location: "서울 서초구 방배동 789-10",
    category: "식품",
    rating: 4.8,
    status: "active",
    registeredAt: "2023-02-08",
    lastUpdated: "2023-06-30"
  },
  {
    id: "shop-3",
    name: "테크 갤러리",
    owner: "박지민",
    location: "서울 영등포구 여의도동 45-67",
    category: "가전제품",
    rating: 4.2,
    status: "pending",
    registeredAt: "2023-06-20",
    lastUpdated: "2023-06-20"
  },
  {
    id: "shop-4",
    name: "스타일 하우스",
    owner: "최하은",
    location: "서울 마포구 합정동 234-56",
    category: "의류",
    rating: 4.0,
    status: "active",
    registeredAt: "2023-03-10",
    lastUpdated: "2023-06-29"
  },
  {
    id: "shop-5",
    name: "홈 데코",
    owner: "정승우",
    location: "서울 용산구 이태원동 345-67",
    category: "생활용품",
    rating: 4.7,
    status: "active",
    registeredAt: "2023-01-20",
    lastUpdated: "2023-06-25"
  },
  {
    id: "shop-6",
    name: "북스토리",
    owner: "백서진",
    location: "서울 종로구 인사동 456-78",
    category: "도서",
    rating: 4.6,
    status: "suspended",
    registeredAt: "2023-04-05",
    lastUpdated: "2023-06-01"
  },
  {
    id: "shop-7",
    name: "선샤인 카페",
    owner: "김주현",
    location: "서울 송파구 잠실동 567-89",
    category: "식품",
    rating: 4.3,
    status: "active",
    registeredAt: "2023-04-15",
    lastUpdated: "2023-06-28"
  },
  {
    id: "shop-8",
    name: "헬시 라이프",
    owner: "이시우",
    location: "서울 강서구 화곡동 678-90",
    category: "건강",
    rating: 4.4,
    status: "closed",
    registeredAt: "2023-02-28",
    lastUpdated: "2023-05-10"
  },
  {
    id: "shop-9",
    name: "키즈 월드",
    owner: "강민준",
    location: "서울 노원구 상계동 789-01",
    category: "완구",
    rating: 4.1,
    status: "active",
    registeredAt: "2023-05-22",
    lastUpdated: "2023-06-29"
  },
  {
    id: "shop-10",
    name: "뷰티 샵",
    owner: "조예은",
    location: "서울 중구 명동 890-12",
    category: "뷰티",
    rating: 4.9,
    status: "active",
    registeredAt: "2023-03-08",
    lastUpdated: "2023-06-27"
  }
];

export default function AdminShopsPage() {
  const [shops, setShops] = useState<ShopData[]>(mockShops);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [shopsPerPage] = useState(5);
  const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 현재 페이지에 표시할 가게 목록
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  
  // 검색 및 카테고리 필터링 적용
  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || shop.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  // 검색 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  // 가게 삭제 핸들러
  const handleDeleteShop = () => {
    if (selectedShop) {
      setShops(shops.filter(shop => shop.id !== selectedShop.id));
      setIsDeleteDialogOpen(false);
      setSelectedShop(null);
    }
  };

  // 가게 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">운영 중</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">승인 대기</Badge>;
      case 'suspended':
        return <Badge variant="destructive">운영 정지</Badge>;
      case 'closed':
        return <Badge variant="secondary">폐점</Badge>;
      default:
        return <Badge variant="secondary">미설정</Badge>;
    }
  };

  // 별점 표시
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="mr-1 text-amber-500">{rating.toFixed(1)}</span>
        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
      </div>
    );
  };

  // 카테고리 목록 (중복 제거)
  const categories = ['all', ...new Set(shops.map(shop => shop.category))];

  return (
    <div className="container p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">가게 관리</h1>
        <p className="text-muted-foreground text-sm">등록된 가게 목록을 확인하고 관리할 수 있습니다.</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center w-full md:w-auto">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="가게명, 주인 이름, 위치 검색..."
                value={searchQuery}
                onChange={handleSearch}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all" onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="카테고리" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>카테고리</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? '전체' : category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    가게 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새 가게 추가</DialogTitle>
                    <DialogDescription>새로운 가게 정보를 입력하세요.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* 여기에 가게 추가 폼을 구현할 수 있음 */}
                    <p className="text-center text-sm text-muted-foreground">새 가게 추가 기능은 추후 구현 예정입니다.</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">취소</Button>
                    <Button>추가</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="active">운영 중</TabsTrigger>
              <TabsTrigger value="pending">승인 대기</TabsTrigger>
              <TabsTrigger value="suspended">운영 정지</TabsTrigger>
            </TabsList>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>가게 정보</TableHead>
                    <TableHead className="hidden md:table-cell">위치</TableHead>
                    <TableHead className="hidden md:table-cell">카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="hidden md:table-cell">등록일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentShops.length > 0 ? (
                    currentShops.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{shop.name}</p>
                            <p className="text-sm text-muted-foreground">운영자: {shop.owner}</p>
                            <div className="md:hidden mt-1">{getRatingStars(shop.rating)}</div>
                            <p className="text-xs text-muted-foreground md:hidden mt-1">{shop.location}</p>
                            <div className="md:hidden mt-1">
                              <Badge variant="outline">{shop.category}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{shop.location}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <Badge variant="outline">{shop.category}</Badge>
                            <div className="mt-1">{getRatingStars(shop.rating)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(shop.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">{shop.registeredAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedShop(shop);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedShop(shop);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center">
                          <Store className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="font-medium">가게를 찾을 수 없습니다</p>
                          <p className="text-sm text-muted-foreground">검색 조건에 맞는 가게가 없습니다.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-4 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* 가게 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>가게 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 가게를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="py-4">
              <p className="mb-2">
                <span className="font-medium">가게명:</span> {selectedShop.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">운영자:</span> {selectedShop.owner}
              </p>
              <p>
                <span className="font-medium">위치:</span> {selectedShop.location}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteShop}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 가게 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>가게 정보 수정</DialogTitle>
            <DialogDescription>
              가게 정보를 수정하세요.
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="py-4 space-y-4">
              {/* 여기에 가게 편집 폼을 구현할 수 있음 */}
              <p className="text-center text-sm text-muted-foreground">가게 편집 기능은 추후 구현 예정입니다.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 