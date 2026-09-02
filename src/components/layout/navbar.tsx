'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  Wrench,
  Bell,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  Heart,
  Search,
  Tag,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'

type NavUser = {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  image?: string | null
}

interface NavbarProps {
  user?: NavUser | null
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Find Providers', href: '/providers' },
  { label: 'Offers', href: '/offers' },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/notifications/unread')
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.count || 0)
      }
    } catch {
      // Ignored
    }
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)

      window.addEventListener('notificationsUpdated', fetchUnreadCount)

      // Connect EventSource SSE stream
      let eventSource: EventSource | null = null
      try {
        eventSource = new EventSource('/api/notifications/stream')
        eventSource.onmessage = () => {
          fetchUnreadCount()
        }
      } catch {
        // Fallback to polling
      }

      return () => {
        clearInterval(interval)
        window.removeEventListener('notificationsUpdated', fetchUnreadCount)
        if (eventSource) eventSource.close()
      }
    }
  }, [user])

  const getDashboardHref = () => {
    if (!user) return '/login'
    if (user.role === 'ADMIN') return '/admin'
    if (user.role === 'PROVIDER') return '/provider/dashboard'
    return '/dashboard'
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || pathname !== '/'
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className={cn(
              'transition-colors',
              scrolled || pathname !== '/' ? 'text-slate-900' : 'text-slate-900'
            )}>
              Service<span className="text-violet-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/become-provider"
                className="px-3 py-2 rounded-lg text-sm font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                Become a Provider
              </Link>
            )}
          </div>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Global Search Icon */}
            <Link
              href="/providers"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
              title="Search Providers"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Saved / Favorites (Customers only) */}
            {user && user.role === 'CUSTOMER' && (
              <Link
                href="/favorites"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                title="Saved/Favorites"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Notifications Bell (Logged in only) */}
            {user && (
              <Link
                href="/notifications"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all relative mr-1"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Auth Actions */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Link
                      href={getDashboardHref()}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/bookings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {user.role === 'PROVIDER' ? 'Booking Requests' : 'My Bookings'}
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <form action="/api/auth/logout" method="POST">
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="gradient" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-3 space-y-1 absolute left-0 right-0 shadow-lg z-50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/become-provider"
                className="block px-4 py-2 rounded-xl text-sm font-medium text-violet-600 hover:bg-violet-50"
                onClick={() => setMenuOpen(false)}
              >
                Become a Provider
              </Link>
            )}

            {/* Mobile User Actions */}
            {user && (
              <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                <Link
                  href="/notifications"
                  className="flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-500" />
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </Link>

                {user.role === 'CUSTOMER' && (
                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 text-slate-500" />
                    Saved Providers
                  </Link>
                )}

                <Link
                  href={getDashboardHref()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Dashboard
                </Link>

                <Link
                  href="/bookings"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {user.role === 'PROVIDER' ? 'Booking Requests' : 'My Bookings'}
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Settings
                </Link>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex gap-2 px-2">
              {user ? (
                <form action="/api/auth/logout" method="POST" className="w-full">
                  <button type="submit" className="w-full text-left">
                    <Button variant="outline" size="sm" className="w-full text-red-600 border-red-100 hover:bg-red-50">Sign Out</Button>
                  </button>
                </form>
              ) : (
                <>
                  <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <Button variant="gradient" size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
