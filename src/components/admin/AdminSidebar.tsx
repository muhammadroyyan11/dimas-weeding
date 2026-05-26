'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FiHome, FiHeart, FiImage, FiMessageSquare, FiSend, FiLogOut, FiExternalLink, FiLayout } from 'react-icons/fi';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/dashboard?tab=wedding', label: 'Wedding', icon: FiHeart },
  { href: '/admin/dashboard?tab=gallery', label: 'Gallery', icon: FiImage },
  { href: '/admin/dashboard?tab=comments', label: 'Ucapan', icon: FiMessageSquare },
  { href: '/admin/dashboard?tab=whatsapp', label: 'Kirim WA', icon: FiSend },
  { href: '/admin/dashboard?tab=tema', label: 'Tema', icon: FiLayout },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    const currentTab = searchParams.get('tab');
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' && !currentTab;
    }
    if (href.includes('?tab=')) {
      const tabValue = href.split('=')[1];
      return pathname === '/admin/dashboard' && currentTab === tabValue;
    }
    return pathname === href;
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Brand Area */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">DW</span>
        </div>
        <span className="text-lg font-bold text-white">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="sidebar-link sidebar-link-inactive"
        >
          <FiExternalLink className="w-5 h-5 flex-shrink-0" />
          <span>Lihat Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full sidebar-link sidebar-link-inactive text-red-300 hover:text-red-200 hover:bg-red-500/10"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — fixed, dark */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 border-r border-gray-800">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — overlay */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
