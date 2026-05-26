'use client';

import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';

interface EventDetailsProps {
  reception: {
    date: string;
    time: string;
    location: string;
    address: string;
    mapUrl: string;
    googleMapsEmbed: string;
  };
  themeName?: string;
}

export default function EventDetails({ reception }: EventDetailsProps) {
  return (
    <section id="event" className="py-20 px-4" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="acara-title text-3xl md:text-4xl font-display text-[#8B5E3C] mb-4" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Acara Resepsi
          </h2>
          <p className="text-[#7A6B5D] text-sm md:text-base">
            Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir
          </p>
          <div className="floral-divider mt-4">
            <span className="center">✦</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-14 h-14 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-[#8B5E3C] text-xl" />
            </div>
            <h3 className="text-sm uppercase tracking-wider text-[#C9A96E] mb-2">Tanggal</h3>
            <p className="text-[#8B5E3C] font-semibold">{formatDate(reception.date)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-14 h-14 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-[#8B5E3C] text-xl" />
            </div>
            <h3 className="text-sm uppercase tracking-wider text-[#C9A96E] mb-2">Waktu</h3>
            <p className="text-[#8B5E3C] font-semibold">{reception.time}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-14 h-14 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMapPin className="text-[#8B5E3C] text-xl" />
            </div>
            <h3 className="text-sm uppercase tracking-wider text-[#C9A96E] mb-2">Lokasi</h3>
            <p className="text-[#8B5E3C] font-semibold">{reception.location}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 shadow-lg text-center mb-8"
        >
          <p className="text-[#7A6B5D] mb-4">{reception.address}</p>
          <a
            href={reception.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B5E3C] text-white rounded-full hover:bg-[#7A4E2C] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiMapPin />
            Lihat di Google Maps
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="maps rounded-2xl overflow-hidden shadow-lg"
        >
          <a
            href={reception.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-[300px] md:h-[400px] bg-[#8B5E3C]/5 flex items-center justify-center rounded-2xl hover:bg-[#8B5E3C]/10 transition-colors"
          >
            <div className="text-center p-4">
              <FiMapPin className="text-4xl text-[#8B5E3C] mx-auto mb-3" />
              <p className="text-[#8B5E3C] font-semibold">Klik untuk lihat di Google Maps</p>
              <p className="text-[#7A6B5D] text-sm mt-2">{reception.address}</p>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
