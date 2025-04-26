import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, Package, Calendar, User } from 'lucide-react'

const navigationItems = [
  { href: '/stores', icon: Store, label: '매장' },
  { href: '/inventory', icon: Package, label: '재고' },
  { href: '/reservations', icon: Calendar, label: '예약' },
  { href: '/profile', icon: User, label: '프로필' },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 