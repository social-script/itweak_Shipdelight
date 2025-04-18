'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import AuthButton from './AuthButton';
import { Home, LayoutDashboard, User, Package } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="h-4 w-4 mr-2" />,
      isAlwaysVisible: true
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      isAlwaysVisible: false
    },
    {
      href: '/orders',
      label: 'Orders',
      icon: <Package className="h-4 w-4 mr-2" />,
      isAlwaysVisible: false
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="h-4 w-4 mr-2" />,
      isAlwaysVisible: false
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div>
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Itweak SD
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              (link.isAlwaysVisible || user) && (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200'
                        : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              )
            ))}
          </ul>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
} 