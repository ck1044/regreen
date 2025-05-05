"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Search, ChevronLeft, ChevronRight, 
  Edit, Trash2, UserPlus, Filter, Mail, Shield, Store, User
} from 'lucide-react';

// 사용자 타입 정의
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'owner' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  lastActive: string;
}

// 가상의 사용자 데이터
const mockUsers: UserData[] = [
  {
    id: "user-1",
    name: "김서연",
    email: "seoyeon@example.com",
    phone: "010-1234-5678",
    role: "customer",
    status: "active",
    joinedAt: "2023-03-15",
    lastActive: "2023-06-28"
  },
  {
    id: "user-2",
    name: "이도윤",
    email: "doyun@example.com",
    phone: "010-2345-6789",
    role: "owner",
    status: "active",
    joinedAt: "2023-02-08",
    lastActive: "2023-06-30"
  },
  {
    id: "user-3",
    name: "박지민",
    email: "jimin@example.com",
    phone: "010-3456-7890",
    role: "customer",
    status: "inactive",
    joinedAt: "2023-04-22",
    lastActive: "2023-06-01"
  },
  {
    id: "user-4",
    name: "최하은",
    email: "haeun@example.com",
    phone: "010-4567-8901",
    role: "customer",
    status: "active",
    joinedAt: "2023-05-10",
    lastActive: "2023-06-29"
  },
  {
    id: "user-5",
    name: "정승우",
    email: "seungwoo@example.com",
    phone: "010-5678-9012",
    role: "owner",
    status: "active",
    joinedAt: "2023-01-20",
    lastActive: "2023-06-25"
  },
  {
    id: "user-6",
    name: "백서진",
    email: "seojin@example.com",
    phone: "010-6789-0123",
    role: "admin",
    status: "active",
    joinedAt: "2023-01-05",
    lastActive: "2023-06-30"
  },
  {
    id: "user-7",
    name: "김주현",
    email: "juhyun@example.com",
    phone: "010-7890-1234",
    role: "customer",
    status: "suspended",
    joinedAt: "2023-04-15",
    lastActive: "2023-05-28"
  },
  {
    id: "user-8",
    name: "이시우",
    email: "siwoo@example.com",
    phone: "010-8901-2345",
    role: "owner",
    status: "inactive",
    joinedAt: "2023-02-28",
    lastActive: "2023-06-10"
  },
  {
    id: "user-9",
    name: "강민준",
    email: "minjun@example.com",
    phone: "010-9012-3456",
    role: "customer",
    status: "active",
    joinedAt: "2023-05-22",
    lastActive: "2023-06-29"
  },
  {
    id: "user-10",
    name: "조예은",
    email: "yeeun@example.com",
    phone: "010-0123-4567",
    role: "customer",
    status: "active",
    joinedAt: "2023-03-08",
    lastActive: "2023-06-27"
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 현재 페이지에 표시할 사용자 목록
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 검색 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 사용자 삭제 핸들러
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  // 사용자 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">활성</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">비활성</Badge>;
      case 'suspended':
        return <Badge variant="destructive">정지</Badge>;
      default:
        return <Badge variant="secondary">미설정</Badge>;
    }
  };

  // 사용자 역할에 따른 아이콘
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-1 text-blue-500" />;
      case 'owner':
        return <Store className="h-4 w-4 mr-1 text-amber-500" />;
      case 'customer':
        return <User className="h-4 w-4 mr-1 text-slate-500" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };

  // 사용자 역할을 한글로 표시
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'owner':
        return '사장님';
      case 'customer':
        return '일반 사용자';
      default:
        return '미설정';
    }
  };

  return (
    <div className="container p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">사용자 관리</h1>
        <p className="text-muted-foreground text-sm">사용자 목록을 확인하고 관리할 수 있습니다.</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center w-full md:w-auto">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 이메일, 전화번호 검색..."
                value={searchQuery}
                onChange={handleSearch}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="역할별 필터" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>역할별 필터</SelectLabel>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                    <SelectItem value="owner">사장님</SelectItem>
                    <SelectItem value="customer">일반 사용자</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    사용자 추가
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새 사용자 추가</DialogTitle>
                    <DialogDescription>새로운 사용자 정보를 입력하세요.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* 여기에 사용자 추가 폼을 구현할 수 있음 */}
                    <p className="text-center text-sm text-muted-foreground">새 사용자 추가 기능은 추후 구현 예정입니다.</p>
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
              <TabsTrigger value="active">활성 사용자</TabsTrigger>
              <TabsTrigger value="inactive">비활성 사용자</TabsTrigger>
              <TabsTrigger value="suspended">정지된 사용자</TabsTrigger>
            </TabsList>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자</TableHead>
                    <TableHead className="hidden md:table-cell">전화번호</TableHead>
                    <TableHead className="hidden md:table-cell">역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="hidden md:table-cell">가입일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground md:hidden">{user.phone}</p>
                            <div className="md:hidden mt-1 flex items-center">
                              {getRoleIcon(user.role)}
                              <span className="text-xs">{getRoleName(user.role)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span>{getRoleName(user.role)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.joinedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedUser(user);
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
                                setSelectedUser(user);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="font-medium">사용자를 찾을 수 없습니다</p>
                          <p className="text-sm text-muted-foreground">검색 조건에 맞는 사용자가 없습니다.</p>
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

      {/* 사용자 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="mb-2">
                <span className="font-medium">사용자 이름:</span> {selectedUser.name}
              </p>
              <p>
                <span className="font-medium">이메일:</span> {selectedUser.email}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 사용자 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보 수정</DialogTitle>
            <DialogDescription>
              사용자 정보를 수정하세요.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4 space-y-4">
              {/* 여기에 사용자 편집 폼을 구현할 수 있음 */}
              <p className="text-center text-sm text-muted-foreground">사용자 편집 기능은 추후 구현 예정입니다.</p>
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