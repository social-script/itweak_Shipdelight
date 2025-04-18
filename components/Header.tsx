'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import AuthButton from './AuthButton';
import { Home, LayoutDashboard, User } from 'lucide-react';

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
      href: '/profile',
      label: 'Profile',
      icon: <User className="h-4 w-4 mr-2" />,
      isAlwaysVisible: false
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div>
          <Link href="/" className="text-xl font-bold">
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
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
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