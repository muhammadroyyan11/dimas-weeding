'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Login gagal');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 50%, #FFF8F0 100%)' }}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-[#8B5E3C] mb-2" style={{ fontFamily: "'Brush Script MT', cursive" }}>
              Admin Panel
            </h1>
            <p className="text-sm text-[#7A6B5D]">Masuk ke panel admin undangan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#7A6B5D] mb-2">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#C9A96E]/20 rounded-xl focus:outline-none focus:border-[#8B5E3C] transition-colors text-[#3D2B1F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#7A6B5D] mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-[#FFF8F0] border border-[#C9A96E]/20 rounded-xl focus:outline-none focus:border-[#8B5E3C] transition-colors text-[#3D2B1F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A96E] hover:text-[#8B5E3C] transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B5E3C] text-white rounded-xl hover:bg-[#7A4E2C] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 font-semibold"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#C9A96E] hover:text-[#8B5E3C] transition-colors">
              &larr; Kembali ke website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
