'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiHeart, FiCalendar, FiMapPin, FiSend, FiImage,
  FiVolume2, FiVolumeX, FiChevronDown
} from 'react-icons/fi';
import { ThemeProps } from './theme-types';
import { formatDate } from '@/lib/utils';

// ===== Dummy Images =====
const DUMMY_COVER = '/dummy/kita.png';
const DUMMY_GROOM = '/dummy/groom.png';
const DUMMY_BRIDE = '/dummy/bride.png';
const DUMMY_ALBUMS = [
  '/dummy/album1.png', '/dummy/album2.png', '/dummy/album3.png',
  '/dummy/album4.png', '/dummy/album5.png', '/dummy/album6.png',
  '/dummy/album7.png', '/dummy/album8.png', '/dummy/album9.png',
  '/dummy/album10.png',
];

// ===== Color Palette =====
// Background utama: #E8E8E8
// Marble texture: #D2D2D2
// Text sekunder: #636262
// Accent dark: #1F1C1D

// ===== Decorative Divider Component =====
function FloralDivider() {
  return (
    <div className="relative w-full py-6 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <div className="h-px w-16 md:w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(180,180,180,0.3))' }} />
        <span style={{ color: 'rgba(150,150,150,0.35)', fontSize: '14px' }}>❦</span>
        <div className="h-px w-16 md:w-24" style={{ background: 'linear-gradient(to left, transparent, rgba(180,180,180,0.3))' }} />
      </div>
    </div>
  );
}

function OrnamentalBorder() {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(180,180,180,0.3))' }} />
      <span style={{ color: 'rgba(150,150,150,0.3)', fontSize: '12px' }}>✦</span>
      <span style={{ color: 'rgba(130,130,130,0.35)', fontSize: '14px' }}>❦</span>
      <span style={{ color: 'rgba(150,150,150,0.3)', fontSize: '12px' }}>✦</span>
      <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, rgba(180,180,180,0.3))' }} />
    </div>
  );
}

// ===== Fade-in on scroll hook =====
function useReveal(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    let observer: IntersectionObserver | null = null;
    let mutationObs: MutationObserver | null = null;

    const timeout = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('opacity-100', 'translate-y-0');
              entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
          });
        },
        { threshold: 0.15 }
      );
      document.querySelectorAll('.reveal').forEach((el) => observer!.observe(el));

      mutationObs = new MutationObserver(() => {
        document.querySelectorAll('.reveal.opacity-0').forEach((el) => observer!.observe(el));
      });
      mutationObs.observe(document.body, { childList: true, subtree: true });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer?.disconnect();
      mutationObs?.disconnect();
    };
  }, [isOpen]);
}

// ===== Countdown =====
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { clearInterval(interval); return; }
      setTimeLeft({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
      {[
        { label: 'Hari', value: timeLeft.d },
        { label: 'Jam', value: timeLeft.h },
        { label: 'Menit', value: timeLeft.m },
        { label: 'Detik', value: timeLeft.s },
      ].map(t => (
        <div key={t.label} className="rounded-2xl p-3 shadow-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#D2D2D2' }}>
          <p className="text-2xl md:text-3xl font-bold" style={{ color: '#1F1C1D' }}>{t.value}</p>
          <p className="text-[11px] uppercase tracking-wider mt-1 font-medium" style={{ color: '#636262' }}>{t.label}</p>
        </div>
      ))}
    </div>
  );
}

// ===== Main Component =====
export default function WeddingTheme({ data, comments, gallery, guestName }: ThemeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentMsg, setCommentMsg] = useState('');
  const [commentList, setCommentList] = useState(
    comments.filter(c => c.approved)
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  const coupleName = `${data.groom.nickname} & ${data.bride.nickname}`;
  const coverImg = data.coverImage || DUMMY_COVER;
  const groomImg = data.groomImage || DUMMY_GROOM;
  const brideImg = data.brideImage || DUMMY_BRIDE;
  const galleryImages = gallery.length > 0
    ? gallery.map(g => g.url)
    : DUMMY_ALBUMS;

  useReveal(isOpen);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current && data.music.url) {
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleAddComment = () => {
    if (!commentName.trim() || !commentMsg.trim()) return;
    setCommentList(prev => [{
      id: Date.now(),
      name: commentName,
      message: commentMsg,
      attendance: 'Hadir',
      createdAt: new Date().toISOString(),
      approved: true,
    }, ...prev]);
    setCommentName('');
    setCommentMsg('');
  };

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E8E8', color: '#1F1C1D' }}>
      {/* Audio */}
      <audio ref={audioRef} loop src={data.music.url} className="hidden" />

      {/* Music Toggle Button */}
      {isOpen && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #D2D2D2' }}
        >
          {isMuted ? <FiVolumeX style={{ color: '#636262' }} /> : <FiVolume2 style={{ color: '#1F1C1D' }} />}
        </button>
      )}

      {/* ============ COVER PAGE ============ */}
      {!isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleOpen}
          style={{
            backgroundImage: `url(${coverImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="relative z-10 text-center px-6 max-w-lg">
            <p className="text-base tracking-[0.4em] uppercase text-white/70 mb-8 font-light">— The Wedding of —</p>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
              <span className="text-white/50 text-sm">⚘</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
            </div>
            <div className="relative block w-full max-w-xs sm:max-w-sm mx-auto px-6 py-5">
              <div className="absolute inset-0 border border-white/30" />
              <div className="absolute -inset-[6px] border border-white/15" />
              <span className="absolute -top-2 -left-2 text-white/50 text-sm">⚘</span>
              <span className="absolute -top-2 -right-2 text-white/50 text-sm">⚘</span>
              <span className="absolute -bottom-2 -left-2 text-white/50 text-sm">⚘</span>
              <span className="absolute -bottom-2 -right-2 text-white/50 text-sm">⚘</span>
              <div className="relative">
                <div className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-[0.1em]" style={{ fontFamily: "'Georgia', serif" }}>{data.groom.nickname}</div>
                <div className="flex items-center justify-center gap-2 my-3">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/40" />
                  <span className="text-white/80 text-xl italic font-serif">&amp;</span>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/40" />
                </div>
                <div className="text-4xl md:text-5xl font-serif text-white tracking-[0.1em]" style={{ fontFamily: "'Georgia', serif" }}>{data.bride.nickname}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
              <span className="text-white/50 text-sm">⚘</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
            </div>
            <p className="text-lg text-white/90 mb-8 tracking-[0.15em] font-light">{formatDate(data.reception.date)}</p>
            <p className="text-white/70 text-base mb-8 leading-relaxed">{data.hero.greeting}</p>
            <p className="text-white/50 text-sm mb-2 tracking-wider">Kepada Yth.</p>
            <p className="text-white text-xl font-semibold mb-8 tracking-wide">{guestName || 'Tamu Undangan'}</p>
            <div className="animate-bounce">
              <span className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur border border-white/30 rounded-full text-white font-medium text-base tracking-wide">
                Buka Undangan <FiChevronDown className="text-white/80" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============ MAIN CONTENT ============ */}
      {isOpen && (
        <>
          {/* ===== Navigation ===== */}
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-lg rounded-2xl px-2 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid #D2D2D2' }}>
            <div className="flex items-center gap-1">
              {[
                { id: 'pembukaan', label: 'Pembuka', icon: FiHeart },
                { id: 'mempelai', label: 'Mempelai', icon: FiHeart },
                { id: 'acara', label: 'Acara', icon: FiCalendar },
                { id: 'galeri', label: 'Galeri', icon: FiImage },
                { id: 'ucapan', label: 'Ucapan', icon: FiSend },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all hover:bg-gray-100"
                  style={{ color: '#636262' }}
                >
                  <item.icon className="text-lg" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* ===== Section: Pembukaan ===== */}
          <section
            id="pembukaan"
            className="min-h-screen flex items-center justify-center py-28 px-4 relative z-10"
            style={{ backgroundColor: '#F0F0F0' }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1F1C1D 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="text-3xl mb-3" style={{ color: '#636262' }}>﷽</div>
              <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Bismillahirrahmanirrahim —</p>
              <div className="w-16 h-0.5 mx-auto mb-10" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />

              <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
                <p className="text-xl md:text-2xl font-medium mb-6 leading-relaxed" style={{ color: '#1F1C1D' }}>
                  {data.hero.greeting}
                </p>
              </div>

              {data.hero.subtitle && (
                <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-100">
                  <p className="text-lg leading-relaxed mb-4 max-w-xl mx-auto" style={{ color: '#636262' }}>
                    {data.hero.subtitle}
                  </p>
                </div>
              )}

              <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-200 my-10">
                <div className="inline-block px-8 py-6 rounded-3xl shadow-md" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #D2D2D2' }}>
                  <p className="text-2xl md:text-3xl font-serif mb-2" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                    {data.groom.name}
                  </p>
                  <p className="text-base mb-1" style={{ color: '#636262' }}>
                    Putra Bpk. {data.groom.father} & Ibu {data.groom.mother}
                  </p>
                  <div className="flex items-center justify-center gap-3 my-4">
                    <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2)' }} />
                    <span className="text-xl font-serif" style={{ color: '#636262' }}>&amp;</span>
                    <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #D2D2D2)' }} />
                  </div>
                  <p className="text-2xl md:text-3xl font-serif mb-2" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                    {data.bride.name}
                  </p>
                  <p className="text-base" style={{ color: '#636262' }}>
                    Putri Bpk. {data.bride.father} & Ibu {data.bride.mother}
                  </p>
                </div>
              </div>

              <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-300">
                <p className="text-xl font-serif mb-1" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                  {formatDate(data.reception.date)}
                </p>
                <p className="text-base" style={{ color: '#636262' }}>{data.reception.time}</p>
              </div>

              <OrnamentalBorder />
            </div>
          </section>

          {/* Divider: Pembukaan → Mempelai */}
          <FloralDivider />

          {/* ===== Section: Mempelai ===== */}
          <section
            id="mempelai"
            className="min-h-screen flex items-center justify-center py-28 px-4 relative z-10"
            style={{ backgroundColor: '#F4F4F4' }}
          >
            {/* Corner ornaments */}
            <div className="absolute top-8 left-8 text-3xl opacity-10" style={{ color: '#636262' }}>❧</div>
            <div className="absolute top-8 right-8 text-3xl opacity-10 scale-x-[-1]" style={{ color: '#636262' }}>❧</div>
            <div className="absolute bottom-8 left-8 text-3xl opacity-10 scale-y-[-1]" style={{ color: '#636262' }}>❧</div>
            <div className="absolute bottom-8 right-8 text-3xl opacity-10 scale-[-1]" style={{ color: '#636262' }}>❧</div>

            <div className="max-w-4xl mx-auto text-center">
              <div className="text-3xl mb-3" style={{ color: '#636262' }}>⚘</div>
              <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Mempelai —</p>
              <h2 className="text-4xl md:text-5xl font-serif mb-3" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                {coupleName}
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-6" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />
              <p className="text-lg mb-14 max-w-lg mx-auto leading-relaxed" style={{ color: '#636262' }}>
                {data.hero.greeting}
              </p>

              <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
                {/* Groom */}
                <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6 group">
                      <div className="absolute -inset-3 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom right, #D2D2D2, #E8E8E8, #D2D2D2)' }} />
                      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img src={groomImg} alt={data.groom.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white shadow-md px-5 py-1.5 rounded-full" style={{ border: '1px solid #D2D2D2' }}>
                        <span className="text-sm font-semibold tracking-wide" style={{ color: '#1F1C1D' }}>Mempelai Pria</span>
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2" style={{ color: '#1F1C1D' }}>{data.groom.name}</h3>
                    <p className="text-base leading-relaxed" style={{ color: '#636262' }}>
                      Putra Bpk. {data.groom.father}<br />& Ibu {data.groom.mother}
                    </p>
                  </div>
                </div>

                {/* Bride */}
                <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-200">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6 group">
                      <div className="absolute -inset-3 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to bottom right, #D2D2D2, #E8E8E8, #D2D2D2)' }} />
                      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img src={brideImg} alt={data.bride.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white shadow-md px-5 py-1.5 rounded-full" style={{ border: '1px solid #D2D2D2' }}>
                        <span className="text-sm font-semibold tracking-wide" style={{ color: '#1F1C1D' }}>Mempelai Wanita</span>
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2" style={{ color: '#1F1C1D' }}>{data.bride.name}</h3>
                    <p className="text-base leading-relaxed" style={{ color: '#636262' }}>
                      Putri Bpk. {data.bride.father}<br />& Ibu {data.bride.mother}
                    </p>
                  </div>
                </div>
              </div>

              <OrnamentalBorder />
            </div>
          </section>

          {/* Divider: Mempelai → Acara */}
          <FloralDivider />

          {/* ===== Section: Acara & Countdown ===== */}
          <section
            id="acara"
            className="min-h-screen flex items-center justify-center py-28 px-4 relative z-10"
            style={{ backgroundColor: '#EBEBEB' }}
          >
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <div className="text-3xl mb-3" style={{ color: '#636262' }}>✿</div>
              <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Acara —</p>
              <h2 className="text-3xl md:text-4xl font-serif mb-2" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                Resepsi Pernikahan
              </h2>
              <div className="w-16 h-0.5 mx-auto mb-10" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />

              <div className="mb-10 reveal opacity-0 translate-y-8 transition-all duration-700">
                <p className="text-base mb-4 font-medium" style={{ color: '#636262' }}>Menuju hari bahagia</p>
                <CountdownTimer targetDate={data.reception.date} />
              </div>

              <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-200">
                <div className="rounded-3xl p-8 shadow-lg max-w-md mx-auto hover:shadow-xl transition-shadow" style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #D2D2D2' }}>
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: '#F5F5F5' }}>
                    <FiHeart className="text-2xl" style={{ color: '#1F1C1D' }} />
                  </div>

                  <h3 className="text-xl font-semibold mb-5 font-serif" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                    Akad Nikah & Resepsi
                  </h3>

                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-4 p-3 rounded-xl" style={{ backgroundColor: '#F5F5F5' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E8E8' }}>
                        <FiCalendar className="text-sm" style={{ color: '#1F1C1D' }} />
                      </div>
                      <div>
                        <p className="text-base font-medium" style={{ color: '#1F1C1D' }}>{formatDate(data.reception.date)}</p>
                        <p className="text-sm" style={{ color: '#636262' }}>{data.reception.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-xl" style={{ backgroundColor: '#F5F5F5' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E8E8' }}>
                        <FiMapPin className="text-sm" style={{ color: '#1F1C1D' }} />
                      </div>
                      <div>
                        <p className="text-base font-medium" style={{ color: '#1F1C1D' }}>{data.reception.location}</p>
                        <p className="text-sm" style={{ color: '#636262' }}>{data.reception.address}</p>
                      </div>
                    </div>
                  </div>

                  {data.reception.mapUrl && (
                    <a
                      href={data.reception.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 text-white rounded-full text-sm transition-all shadow-md hover:shadow-lg hover:opacity-90"
                      style={{ backgroundColor: '#1F1C1D' }}
                    >
                      <FiMapPin className="text-sm" />
                      Buka Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Divider: Acara → Love Story */}
          <FloralDivider />

          {/* ===== Section: Love Story ===== */}
          {data.loveStory.length > 0 && (
            <>
              <section className="py-28 px-4 relative z-10" style={{ backgroundColor: '#F2F2F2' }}>
                {/* Subtle diagonal pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1F1C1D 0, #1F1C1D 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

                <div className="relative z-10 max-w-3xl mx-auto">
                  <div className="text-center mb-14">
                    <div className="text-3xl mb-3" style={{ color: '#636262' }}>❀</div>
                    <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Cerita —</p>
                    <h2 className="text-3xl md:text-4xl font-serif" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                      Perjalanan Cinta
                    </h2>
                    <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />
                  </div>

                  <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5" style={{ background: 'linear-gradient(to bottom, #D2D2D2, #E8E8E8, transparent)' }} />

                    {data.loveStory.map((story, index) => (
                      <div
                        key={index}
                        className={`reveal opacity-0 translate-y-8 transition-all duration-700 relative flex items-start mb-12 ${
                          index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        } flex-row`}
                      >
                        <div className={`w-[calc(100%-3rem)] md:w-5/12 ml-12 md:ml-0 ${
                          index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                        }`}>
                          <div className={`rounded-2xl p-5 shadow-md hover:shadow-lg transition-all ${
                            index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                          }`} style={{ backgroundColor: '#F9F9F9', border: '1px solid #E8E8E8' }}>
                            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2" style={{ backgroundColor: '#E8E8E8', color: '#1F1C1D' }}>
                              {story.date}
                            </div>
                            <h4 className="font-semibold text-base mb-1" style={{ color: '#1F1C1D' }}>{story.title}</h4>
                            <p className="text-base leading-relaxed" style={{ color: '#636262' }}>{story.description}</p>
                          </div>
                        </div>

                        <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-6 flex justify-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10" style={{ backgroundColor: '#1F1C1D' }}>
                            <FiHeart className="text-white text-sm" />
                          </div>
                        </div>

                        <div className="hidden md:block w-5/12" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Divider: Love Story → Gallery */}
              <FloralDivider />
            </>
          )}

          {/* ===== Section: Gallery ===== */}
          <section
            id="galeri"
            className="py-28 px-4 relative z-10"
            style={{ backgroundColor: '#EBEBEB' }}
          >
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="text-3xl mb-3" style={{ color: '#636262' }}>✽</div>
                <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Galeri —</p>
                <h2 className="text-3xl md:text-4xl font-serif" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                  Gallery Foto
                </h2>
                <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {galleryImages.slice(0, 10).map((url, i) => (
                  <div
                    key={i}
                    className="reveal opacity-0 translate-y-8 transition-all duration-700 group relative rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-xl"
                    style={{ transitionDelay: `${(i % 5) * 100}ms` }}
                  >
                    <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                        <FiHeart className="text-xs" style={{ color: '#1F1C1D' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Divider: Gallery → Ucapan */}
          <FloralDivider />

          {/* ===== Section: Ucapan ===== */}
          <section
            id="ucapan"
            className="py-28 pb-36 px-4 relative z-10"
            style={{ backgroundColor: '#F0F0F0' }}
          >
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1F1C1D 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div className="text-3xl mb-3" style={{ color: '#636262' }}>✉</div>
                <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Ucapan —</p>
                <h2 className="text-3xl md:text-4xl font-serif" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                  Beri Ucapan & Doa
                </h2>
                <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />
              </div>

              {/* Comment Form */}
              <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
                <form
                  onSubmit={e => { e.preventDefault(); handleAddComment(); }}
                  className="rounded-3xl p-6 shadow-lg mb-8"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #D2D2D2' }}
                >
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="Nama Anda *"
                      required
                      className="w-full px-5 py-3 rounded-xl text-base transition-all focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#F5F5F5', border: '1px solid #D2D2D2', color: '#1F1C1D', '--tw-ring-color': '#D2D2D2' } as React.CSSProperties}
                    />
                    <textarea
                      value={commentMsg}
                      onChange={e => setCommentMsg(e.target.value)}
                      placeholder="Tulis ucapan & doa... *"
                      rows={3}
                      required
                      className="w-full px-5 py-3 rounded-xl text-base resize-none transition-all focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#F5F5F5', border: '1px solid #D2D2D2', color: '#1F1C1D', '--tw-ring-color': '#D2D2D2' } as React.CSSProperties}
                    />
                    <button
                      type="submit"
                      className="w-full py-3 text-white rounded-xl transition-all font-medium text-base shadow-md hover:shadow-lg hover:opacity-90"
                      style={{ backgroundColor: '#1F1C1D' }}
                    >
                      <FiSend className="inline mr-2" />
                      Kirim Ucapan
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {commentList.slice(0, 20).map((c) => (
                  <div
                    key={c.id}
                    className="reveal opacity-0 translate-y-8 transition-all duration-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    style={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #E8E8E8' }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8E8E8' }}>
                        <span className="text-sm font-bold" style={{ color: '#1F1C1D' }}>
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-base" style={{ color: '#1F1C1D' }}>{c.name}</p>
                        <p className="text-sm" style={{ color: '#636262' }}>
                          {new Date(c.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-base ml-12 leading-relaxed" style={{ color: '#636262' }}>{c.message}</p>
                  </div>
                ))}
                {commentList.length === 0 && (
                  <div className="text-center text-base py-12 rounded-2xl" style={{ color: '#636262', backgroundColor: 'rgba(255,255,255,0.5)', border: '2px dashed #D2D2D2' }}>
                    <FiHeart className="text-2xl mx-auto mb-2 opacity-50" />
                    Belum ada ucapan. Jadilah yang pertama!
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Divider: Ucapan → Penutup */}
          <FloralDivider />

          {/* ===== Section: Penutup ===== */}
          <section className="py-28 px-4 relative z-10" style={{ backgroundColor: '#F2F2F2' }}>
            {/* Corner ornaments */}
            <div className="absolute top-8 left-8 text-3xl opacity-10" style={{ color: '#636262' }}>❧</div>
            <div className="absolute top-8 right-8 text-3xl opacity-10 scale-x-[-1]" style={{ color: '#636262' }}>❧</div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <div className="text-3xl mb-3" style={{ color: '#636262' }}>﷽</div>
              <p className="text-base tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: '#636262' }}>— Penutup —</p>
              <div className="w-16 h-0.5 mx-auto mb-10" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />

              {data.hero.footer && (
                <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
                  <p className="text-lg leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: '#636262' }}>
                    {data.hero.footer}
                  </p>
                </div>
              )}

              <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-100">
                <p className="text-xl md:text-2xl font-medium mb-4" style={{ color: '#1F1C1D' }}>
                  Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
                </p>
              </div>

              <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-200 mt-10">
                <div className="inline-block px-8 py-6 rounded-3xl shadow-md" style={{ backgroundColor: '#F9F9F9', border: '1px solid #D2D2D2' }}>
                  <p className="text-2xl md:text-3xl font-serif" style={{ color: '#1F1C1D', fontFamily: "'Georgia', serif" }}>
                    {coupleName}
                  </p>
                  <div className="w-12 h-0.5 mx-auto my-3" style={{ background: 'linear-gradient(to right, transparent, #D2D2D2, transparent)' }} />
                  <p className="text-base" style={{ color: '#636262' }}>
                    {data.groom.name} & {data.bride.name}
                  </p>
                </div>
              </div>

              <OrnamentalBorder />
            </div>
          </section>

          {/* ===== Footer ===== */}
          <footer className="py-16 pb-28 px-4 text-center relative z-10" style={{ backgroundColor: '#1F1C1D' }}>
            <div className="relative z-10 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3))' }} />
                <FiHeart style={{ color: 'rgba(255,255,255,0.3)' }} />
                <FiHeart className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }} />
                <FiHeart style={{ color: 'rgba(255,255,255,0.3)' }} />
                <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.3))' }} />
              </div>

              <h3 className="text-2xl font-serif mb-2 text-white" style={{ fontFamily: "'Georgia', serif" }}>
                {coupleName}
              </h3>
              <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Terima kasih atas doa & restunya
              </p>

              <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Support By <span className="font-semibold text-white">Tong Tong</span>
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Build with Tong Tong AI Assisted
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
