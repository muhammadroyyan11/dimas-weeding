'use client';

import { motion } from 'framer-motion';

interface FooterProps {
  groomName: string;
  brideName: string;
}

export default function Footer({ groomName, brideName }: FooterProps) {
  return (
    <footer className="py-12 px-4" style={{ backgroundColor: '#3D2B1F' }}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-[#D4A574] font-display text-2xl md:text-3xl mb-4" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Terima Kasih
          </p>

          <p className="text-[#C9A96E]/70 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila 
            Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
          </p>

          <div className="w-16 h-px bg-[#C9A96E]/40 mx-auto mb-8" />

          <p className="text-white font-display text-3xl md:text-4xl mb-2" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            {groomName}
          </p>
          <p className="text-[#C9A96E] text-sm">&</p>
          <p className="text-white font-display text-3xl md:text-4xl mt-2 mb-8" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            {brideName}
          </p>

          <div className="w-16 h-px bg-[#C9A96E]/40 mx-auto mb-8" />

          <p className="text-[#7A6B5D] text-xs">
            &copy; {new Date().getFullYear()} Dimas & Laely Wedding. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
