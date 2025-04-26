import MobileLayout from '@/components/layout/MobileLayout'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Store, Plus } from 'lucide-react'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function StoresPage() {
  // 세션 확인
  const session = await getServerSession(authOptions);
  
  // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  if (!session) {
    redirect('/auth/signin');
  }

  // 실제 구현에서는 여기서 DB에서 사용자의 가게 목록을 가져옵니다
  const userStores = []; // await db.stores.findMany({ where: { ownerId: session.user.id } })

  return (
    <MobileLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">내 가게 관리</h1>
          <Link href="/stores/register">
            <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
              <Plus className="mr-2 h-4 w-4" />
              가게 등록
            </Button>
          </Link>
        </div>

        {userStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Store className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
              등록된 가게가 없습니다.<br />
              새로운 가게를 등록해보세요.
            </p>
            <Link href="/stores/register">
              <Button className="bg-[#5DCA69] hover:bg-[#4db058]">
                가게 등록하기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 가게 목록이 여기에 들어갑니다 */}
          </div>
        )}
      </div>
    </MobileLayout>
  )
} 