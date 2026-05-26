'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiHeart, FiImage, FiMessageSquare, FiSend, FiSave, FiPlus, FiTrash2, FiCheck, FiX, FiRefreshCw, FiUsers, FiCalendar, FiMapPin, FiMusic, FiLayout } from 'react-icons/fi';
import ThemeSelector from '@/components/admin/ThemeSelector';
import ImageUpload from '@/components/admin/ImageUpload';

interface WeddingData {
  groom: { name: string; father: string; mother: string; nickname: string };
  bride: { name: string; father: string; mother: string; nickname: string };
  reception: { date: string; time: string; location: string; address: string; mapUrl: string; googleMapsEmbed: string };
  loveStory: Array<{ date: string; title: string; description: string }>;
  hero: { greeting: string; subtitle: string; date: string; footer: string };
  colors: Record<string, string>;
  music: { url: string; enabled: boolean };
  theme: string;
  coverImage: string;
  groomImage: string;
  brideImage: string;
}

interface Comment {
  id: number;
  name: string;
  message: string;
  attendance: string;
  createdAt: string;
  approved: boolean;
}

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        if (res.ok) {
          setIsAuthed(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) return null;

  return (
    <div>
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'wedding' && <WeddingTab />}
      {activeTab === 'gallery' && <GalleryTab />}
      {activeTab === 'comments' && <CommentsTab />}
      {activeTab === 'whatsapp' && <WhatsAppTab />}
      {activeTab === 'tema' && <ThemeTab />}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}

/* ===== Dashboard Tab ===== */
function DashboardTab() {
  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, Admin!</h2>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your wedding website.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FiHeart className="w-5 h-5" />}
          iconClass="stat-icon-wedding"
          value="Terisi"
          label="Konten Wedding"
        />
        <DashboardGalleryStat />
        <DashboardCommentsStat />
        <StatCard
          icon={<FiSend className="w-5 h-5" />}
          iconClass="stat-icon-whatsapp"
          value="Siap Kirim"
          label="WhatsApp"
        />
      </div>

      {/* Quick Actions */}
      <div className="admin-card mb-6">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        </div>
        <div className="admin-card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              href="/admin/dashboard?tab=wedding"
              icon={<FiHeart className="w-6 h-6" />}
              bgClass="bg-amber-100 text-amber-600"
              hoverClass="hover:bg-amber-50"
              label="Edit Wedding"
            />
            <QuickAction
              href="/admin/dashboard?tab=gallery"
              icon={<FiImage className="w-6 h-6" />}
              bgClass="bg-blue-100 text-blue-600"
              hoverClass="hover:bg-blue-50"
              label="Tambah Foto"
            />
            <QuickAction
              href="/admin/dashboard?tab=comments"
              icon={<FiMessageSquare className="w-6 h-6" />}
              bgClass="bg-emerald-100 text-emerald-600"
              hoverClass="hover:bg-emerald-50"
              label="Lihat Ucapan"
            />
            <QuickAction
              href="/admin/dashboard?tab=whatsapp"
              icon={<FiSend className="w-6 h-6" />}
              bgClass="bg-green-100 text-green-600"
              hoverClass="hover:bg-green-50"
              label="Kirim Undangan"
            />
          </div>
        </div>
      </div>

      {/* Password Info */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-gray-800">Informasi Akun</h3>
        </div>
        <div className="admin-card-body">
          <p className="text-sm text-gray-500 mb-4">
            Untuk keamanan, ubah password default di file environment variables.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm border border-gray-200">
            <p className="text-gray-600 mb-1">
              Default Username: <code className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono text-gray-800">admin</code>
            </p>
            <p className="text-gray-600">
              Default Password: <code className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono text-gray-800">dimas123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, iconClass, value, label }: { icon: React.ReactNode; iconClass: string; value: string; label: string }) {
  return (
    <div className="admin-card p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function DashboardGalleryStat() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(d => setCount(d.length)).catch(() => setCount(0));
  }, []);
  return <StatCard icon={<FiImage className="w-5 h-5" />} iconClass="stat-icon-gallery" value={`${count} Foto`} label="Galeri Foto" />;
}

function DashboardCommentsStat() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch('/api/comments').then(r => r.json()).then(d => setCount(d.filter((c: Comment) => c.approved).length)).catch(() => setCount(0));
  }, []);
  return <StatCard icon={<FiMessageSquare className="w-5 h-5" />} iconClass="stat-icon-comments" value={`${count} Ucapan`} label="Ucapan" />;
}

function QuickAction({ href, icon, bgClass, hoverClass, label }: { href: string; icon: React.ReactNode; bgClass: string; hoverClass: string; label: string }) {
  return (
    <a
      href={href}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 ${hoverClass} transition-colors group`}
    >
      <div className={`w-12 h-12 ${bgClass} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </a>
  );
}

/* ===== Wedding Tab ===== */
function WeddingTab() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/wedding').then(r => r.json()).then(setData);
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/wedding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Gagal menyimpan');
      }
    } catch {
      setError('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="text-center py-10 text-gray-500">Memuat...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Konten Wedding</h2>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data pernikahan, mempelai, dan informasi resepsi</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <FiRefreshCw className="animate-spin w-4 h-4" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Alerts */}
      {saved && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm border border-emerald-200">
          <FiCheck className="w-4 h-4" /> Berhasil disimpan!
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm border border-red-200">
          <FiX className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Bride & Groom */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-800">Data Mempelai</h3>
          </div>
          <div className="admin-card-body">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-[#C9A96E] mb-3 uppercase tracking-wider">Mempelai Pria</h4>
                <div className="space-y-3">
                  <div>
                    <label className="admin-label">Nama Lengkap</label>
                    <input value={data.groom.name} onChange={e => setData({...data, groom: {...data.groom, name: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nama Panggilan</label>
                    <input value={data.groom.nickname} onChange={e => setData({...data, groom: {...data.groom, nickname: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nama Ayah</label>
                    <input value={data.groom.father} onChange={e => setData({...data, groom: {...data.groom, father: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nama Ibu</label>
                    <input value={data.groom.mother} onChange={e => setData({...data, groom: {...data.groom, mother: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Foto Mempelai Pria</label>
                    <ImageUpload
                      currentUrl={data.groomImage}
                      onUpload={(url) => setData({...data, groomImage: url})}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#C9A96E] mb-3 uppercase tracking-wider">Mempelai Wanita</h4>
                <div className="space-y-3">
                  <div>
                    <label className="admin-label">Nama Lengkap</label>
                    <input value={data.bride.name} onChange={e => setData({...data, bride: {...data.bride, name: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nama Panggilan</label>
                    <input value={data.bride.nickname} onChange={e => setData({...data, bride: {...data.bride, nickname: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nama Ayah</label>
                    <input value={data.bride.father} onChange={e => setData({...data, bride: {...data.bride, father: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Nama Ibu</label>
                    <input value={data.bride.mother} onChange={e => setData({...data, bride: {...data.bride, mother: e.target.value}})} className="admin-input" />
                  </div>
                  <div>
                    <label className="admin-label">Foto Mempelai Wanita</label>
                    <ImageUpload
                      currentUrl={data.brideImage}
                      onUpload={(url) => setData({...data, brideImage: url})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-800">Foto Cover</h3>
          </div>
          <div className="admin-card-body">
            <div>
              <label className="admin-label">Foto Cover (Pasangan)</label>
              <ImageUpload
                currentUrl={data.coverImage}
                onUpload={(url) => setData({...data, coverImage: url})}
              />
            </div>
          </div>
        </div>

        {/* Reception */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-800">Informasi Resepsi</h3>
          </div>
          <div className="admin-card-body">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Tanggal</label>
                <input type="date" value={data.reception.date} onChange={e => setData({...data, reception: {...data.reception, date: e.target.value}})} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Waktu</label>
                <input value={data.reception.time} onChange={e => setData({...data, reception: {...data.reception, time: e.target.value}})} className="admin-input" />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Lokasi</label>
                <input value={data.reception.location} onChange={e => setData({...data, reception: {...data.reception, location: e.target.value}})} className="admin-input" />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Alamat Lengkap</label>
                <input value={data.reception.address} onChange={e => setData({...data, reception: {...data.reception, address: e.target.value}})} className="admin-input" />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Link Google Maps</label>
                <input value={data.reception.mapUrl} onChange={e => setData({...data, reception: {...data.reception, mapUrl: e.target.value}})} className="admin-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              <div>
                <label className="admin-label">Greeting (Salam Pembuka)</label>
                <input value={data.hero.greeting} onChange={e => setData({...data, hero: {...data.hero, greeting: e.target.value}})} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Subtitle</label>
                <textarea value={data.hero.subtitle} onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} rows={2} className="admin-input resize-none" />
              </div>
              <div>
                <label className="admin-label">Tanggal di Hero</label>
                <input value={data.hero.date} onChange={e => setData({...data, hero: {...data.hero, date: e.target.value}})} className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Footer Text</label>
                <textarea value={data.hero.footer} onChange={e => setData({...data, hero: {...data.hero, footer: e.target.value}})} rows={2} className="admin-input resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Love Story */}
        <div className="admin-card">
          <div className="admin-card-header flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Perjalanan Cinta</h3>
            <button
              onClick={() => setData({...data, loveStory: [...data.loveStory, { date: '', title: '', description: '' }]})}
              className="btn-secondary text-sm"
            >
              <FiPlus className="w-4 h-4" /> Tambah
            </button>
          </div>
          <div className="admin-card-body">
            <div className="space-y-4">
              {data.loveStory.map((story, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#C9A96E] uppercase tracking-wider">Story {index + 1}</span>
                    <button
                      onClick={() => setData({...data, loveStory: data.loveStory.filter((_, i) => i !== index)})}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="admin-label">Tanggal</label>
                      <input value={story.date} onChange={e => {
                        const newStories = [...data.loveStory];
                        newStories[index] = {...newStories[index], date: e.target.value};
                        setData({...data, loveStory: newStories});
                      }} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Judul</label>
                      <input value={story.title} onChange={e => {
                        const newStories = [...data.loveStory];
                        newStories[index] = {...newStories[index], title: e.target.value};
                        setData({...data, loveStory: newStories});
                      }} className="admin-input" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="admin-label">Deskripsi</label>
                      <textarea value={story.description} onChange={e => {
                        const newStories = [...data.loveStory];
                        newStories[index] = {...newStories[index], description: e.target.value};
                        setData({...data, loveStory: newStories});
                      }} rows={2} className="admin-input resize-none" />
                    </div>
                  </div>
                </div>
              ))}
              {data.loveStory.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada cerita. Klik "Tambah" untuk menambahkan.</p>
              )}
            </div>
          </div>
        </div>

        {/* Music */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-800">Musik Latar (YouTube)</h3>
          </div>
          <div className="admin-card-body">
            <div className="space-y-3">
              <div>
                <label className="admin-label">URL Musik YouTube</label>
                <input
                  value={data.music?.url || ''}
                  onChange={e => setData({...data, music: { ...data.music, url: e.target.value }})}
                  placeholder="https://youtu.be/laMRBmD2aeg atau ID video"
                  className="admin-input"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Masukkan link YouTube (youtu.be/... atau youtube.com/watch?v=...) atau ID video saja (11 karakter)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.music?.enabled || false}
                    onChange={e => setData({...data, music: { ...data.music, enabled: e.target.checked }})}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8B5E3C]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5E3C]" />
                </label>
                <span className="text-sm text-gray-600">Aktifkan musik</span>
              </div>
              {data.music?.url && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Pratinjau:</p>
                  <p className="text-sm text-gray-800 break-all">{data.music.url}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Gallery Tab ===== */
function GalleryTab() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [saving, setSaving] = useState(false);

  const loadGallery = useCallback(async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setImages(data);
  }, []);

  useEffect(() => { loadGallery(); }, [loadGallery]);

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, caption: newCaption }),
      });
      if (res.ok) {
        setNewUrl('');
        setNewCaption('');
        loadGallery();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      loadGallery();
    } catch {}
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Galeri Pre-Wedding</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kelola foto pre-wedding yang tampil di website</p>
      </div>

      {/* Add form */}
      <div className="admin-card mb-6">
        <div className="admin-card-header">
          <h3 className="text-lg font-semibold text-gray-800">Tambah Foto Baru</h3>
        </div>
        <div className="admin-card-body">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              placeholder="URL Gambar (contoh: https://...)"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              className="admin-input flex-1"
            />
            <input
              placeholder="Caption (opsional)"
              value={newCaption}
              onChange={e => setNewCaption(e.target.value)}
              className="admin-input flex-1"
            />
            <button
              onClick={handleAdd}
              disabled={saving || !newUrl.trim()}
              className="btn-primary whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FiImage className="text-4xl mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada foto. Tambahkan foto pre-wedding di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="admin-card overflow-hidden group">
              <div className="aspect-square">
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate">{img.caption || 'Tanpa caption'}</p>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Comments Tab ===== */
function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);

  const loadComments = useCallback(async () => {
    const res = await fetch('/api/comments');
    const data = await res.json();
    setComments(data);
  }, []);

  useEffect(() => { loadComments(); }, [loadComments]);

  const toggleApproval = async (id: number, approved: boolean) => {
    try {
      await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      loadComments();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      loadComments();
    } catch {}
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Ucapan & Doa</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kelola ucapan dari tamu undangan</p>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FiMessageSquare className="text-4xl mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada ucapan dari tamu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className={`admin-card border-l-4 ${comment.approved ? 'border-l-emerald-400' : 'border-l-yellow-400'}`}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-800 text-sm">{comment.name}</h4>
                      <span className={`admin-badge ${
                        comment.attendance === 'Hadir' ? 'admin-badge-success' :
                        comment.attendance === 'Tidak Hadir' ? 'admin-badge-danger' :
                        'admin-badge-warning'
                      }`}>{comment.attendance}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleApproval(comment.id, !comment.approved)}
                      className={`p-2 rounded-lg transition-colors ${
                        comment.approved ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      }`}
                      title={comment.approved ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {comment.approved ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== WhatsApp Tab ===== */
function WhatsAppTab() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [preview, setPreview] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('/api/wedding').then(r => r.json()).then(setWeddingData);
  }, []);

  const generatePreview = (name: string) => {
    if (!weddingData) return '';
    const { groom, bride, reception } = weddingData;
    const date = new Date(reception.date).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    return `Assalamu'alaikum Warahmatullahi Wabarakatuh

Dengan hormat,

Kami mengundang Bapak/Ibu/Saudara/i ${name} untuk menghadiri resepsi pernikahan putra-putri kami:

${groom.name} (Putra Bapak ${groom.father} & Ibu ${groom.mother})
&
${bride.name} (Putri Bapak ${bride.father} & Ibu ${bride.mother})

📅 Hari, Tanggal: ${date}
🕐 Waktu: ${reception.time}
📍 Lokasi: ${reception.location}
${reception.address}

Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim()) {
      setPreview(generatePreview(value.trim()));
    } else {
      setPreview('');
    }
  };

  const handleOpenWA = () => {
    if (!phone.trim() || !name.trim() || !weddingData) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = generatePreview(name);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSend = async () => {
    if (!phone.trim() || !name.trim() || !weddingData) return;
    setSending(true);
    setSent(false);
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, weddingData }),
      });
      if (res.ok) {
        setSent(true);
        setPhone('');
        setName('');
        setPreview('');
        setTimeout(() => setSent(false), 5000);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Kirim Undangan WhatsApp</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kirim undangan pernikahan ke tamu via WhatsApp</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="admin-label">Nama Tamu</label>
                <input
                  placeholder="Contoh: Bapak/Ibu/Saudara"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div className="mb-4">
                <label className="admin-label">Nomor WhatsApp</label>
                <input
                  placeholder="6281234567890"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="admin-input"
                />
                <p className="text-xs text-gray-400 mt-1">Gunakan format internasional, contoh: 6281234567890</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleOpenWA}
                  disabled={!phone.trim() || !name.trim()}
                  className="btn-success"
                >
                  <FiSend className="w-4 h-4" /> Buka WhatsApp Web
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || !phone.trim() || !name.trim()}
                  className="btn-primary"
                >
                  {sending ? 'Mengirim...' : 'Kirim Via API'}
                </button>
              </div>

              {sent && (
                <div className="mt-4 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm border border-emerald-200">
                  <FiCheck className="w-4 h-4" /> Undangan berhasil dikirim! (atau terbuka di tab baru)
                </div>
              )}
            </div>

            <div>
              <label className="admin-label">Pratinjau Pesan</label>
              <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[400px] max-h-[500px] overflow-y-auto border border-gray-200">
                {preview || (
                  <span className="text-gray-300 italic">
                    Masukkan nama tamu untuk melihat pratinjau pesan undangan...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Theme Tab ===== */
function ThemeTab() {
  const [currentTheme, setCurrentTheme] = useState('base');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load current theme
  useEffect(() => {
    fetch('/api/wedding')
      .then(r => r.json())
      .then(data => {
        if (data.theme) setCurrentTheme(data.theme);
      })
      .catch(() => {});
  }, []);

  const handleSelectTheme = async (theme: string) => {
    setCurrentTheme(theme);
    setSaving(true);
    setSaved(false);
    try {
      // Fetch current data and update only the theme
      const res = await fetch('/api/wedding');
      const data = await res.json();
      data.theme = theme;
      const saveRes = await fetch('/api/wedding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (saveRes.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert('Gagal menyimpan tema');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {saved && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm border border-emerald-200">
          <FiCheck className="w-4 h-4" /> Tema berhasil diubah!{' '}
          <a href="/" target="_blank" className="underline font-medium">Lihat website</a>
        </div>
      )}
      <ThemeSelector
        currentTheme={currentTheme}
        onSelect={handleSelectTheme}
        saving={saving}
      />
    </div>
  );
}
