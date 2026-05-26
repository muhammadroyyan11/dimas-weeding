'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';

interface Props {
  onToggleSidebar: () => void;
}

const tabTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/dashboard?tab=wedding': 'Konten Wedding',
  '/admin/dashboard?tab=gallery': 'Galeri Pre-Wedding',
  '/admin/dashboard?tab=comments': 'Ucapan & Doa',
  '/admin/dashboard?tab=whatsapp': 'Kirim Undangan WhatsApp',
  '/admin/dashboard?tab=tema': 'Pilih Tema',
};

export default function AdminTopbar({ onToggleSidebar }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dapatkan title berdasarkan path + query string
  const getTitle = () => {
    const tab = searchParams.get('tab');
    const key = tab ? `/admin/dashboard?tab=${tab}` : '/admin/dashboard';
    return tabTitles[key] || tabTitles[pathname] || 'Dashboard';
  };

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{getTitle()}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-[#F5E6D3] rounded-full flex items-center justify-center">
              <FiUser className="text-sm text-[#8B5E3C]" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden lg:block">Admin</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Wedding Admin</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
