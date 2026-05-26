'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface HeroProps {
  data: {
    greeting: string;
    subtitle: string;
    date: string;
    footer: string;
  };
  groomName: string;
  brideName: string;
  themeName?: string;
}

export default function Hero({ data, groomName, brideName, themeName }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Lock/unlock body scroll — pakai inline style di body biar reliable
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = '';
    } else {
      // Reset scroll ke atas sebelum lock, biar ga 'stuck' di posisi lama setelah refresh
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    window.dispatchEvent(new CustomEvent('wedding:open'));
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 50%, #FFF8F0 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-[#C9A96E]/20 rounded-full" />
        <div className="absolute top-20 left-20 w-16 h-16 border border-[#C9A96E]/30 rounded-full" />
        <div className="absolute bottom-10 right-10 w-40 h-40 border border-[#C9A96E]/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-[#C9A96E]/30 rounded-full" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-radial from-[#C9A96E]/5 to-transparent rounded-full" />
        <div className="absolute top-1/3 right-0 w-48 h-48 bg-gradient-radial from-[#D4A574]/5 to-transparent rounded-full" />
      </div>

      {/* Overlay awal — absolute, full size, dihapus setelah exit animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="initial-overlay"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center z-20 px-4"
          >
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}      className="salam text-sm md:text-base tracking-[0.3em] uppercase text-[#8B5E3C]/70 mb-8"
            >
                {data.greeting}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, duration: 1 }}
                className="mempelai-pria-nama nama-mempelai text-5xl md:text-7xl lg:text-8xl font-display text-[#8B5E3C] mb-4"
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                {groomName}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="dengan flex items-center justify-center gap-4 my-6"
              >
                <span className="h-px w-16 bg-[#C9A96E]"></span>
                <span className="text-3xl text-[#C9A96E]">&</span>
                <span className="h-px w-16 bg-[#C9A96E]"></span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1, duration: 1 }}
                className="mempelai-wanita-nama nama-mempelai text-5xl md:text-7xl lg:text-8xl font-display text-[#8B5E3C] mb-6"
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              >
                {brideName}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="mempelai-intermezzo text-sm md:text-base text-[#7A6B5D] mb-2"
              >
                {data.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="tanggal-weddingnya text-lg md:text-xl text-[#8B5E3C] font-semibold mb-10"
              >
                {data.date}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.8, duration: 0.6 }}
                onClick={handleOpenInvitation}
                className="px-8 py-3 bg-[#8B5E3C] text-white rounded-full hover:bg-[#7A4E2C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Buka Undangan
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="mt-12 animate-float"
              >
                <FiChevronDown className="text-[#C9A96E] text-2xl mx-auto" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konten setelah dibuka — selalu ada di DOM (normal flow flex child), di-center oleh flex parent */}
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 px-4 w-full"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="salam text-sm md:text-base tracking-[0.3em] uppercase text-[#8B5E3C]/70 mb-8"
          >
            {data.greeting}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="mempelai-intermezzo text-base md:text-lg text-[#7A6B5D] mb-4 leading-relaxed">
              {data.subtitle}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isOpen ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="mempelai-pria-nama nama-mempelai text-4xl md:text-6xl lg:text-7xl font-display text-[#8B5E3C] mt-8 mb-2"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            {groomName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isOpen ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="dengan flex items-center justify-center gap-4 my-4"
          >
            <span className="h-px w-16 bg-[#C9A96E]"></span>
            <span className="text-2xl md:text-3xl text-[#C9A96E]">&</span>
            <span className="h-px w-16 bg-[#C9A96E]"></span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isOpen ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1, duration: 1 }}
            className="mempelai-wanita-nama nama-mempelai text-4xl md:text-6xl lg:text-7xl font-display text-[#8B5E3C] mb-6"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            {brideName}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isOpen ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="tanggal-weddingnya text-lg md:text-xl text-[#8B5E3C] font-semibold mb-8"
          >
            {data.date}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isOpen ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-sm md:text-base text-[#7A6B5D] max-w-xl mx-auto leading-relaxed italic"
          >
            &ldquo;{data.footer}&rdquo;
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isOpen ? { opacity: 1 } : {}}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-10"
          >
            <a
              href="#countdown"
              className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#7A4E2C] transition-colors"
            >
              <span className="text-sm tracking-wider uppercase">Scroll untuk info lengkap</span>
              <FiChevronDown className="animate-float" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
