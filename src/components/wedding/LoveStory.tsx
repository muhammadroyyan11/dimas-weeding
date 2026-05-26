'use client';

import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

interface LoveStoryItem {
  date: string;
  title: string;
  description: string;
}

interface LoveStoryProps {
  stories: LoveStoryItem[];
  themeName?: string;
}

export default function LoveStory({ stories }: LoveStoryProps) {
  return (
    <section id="love-story" className="section-title py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display text-[#8B5E3C] mb-4" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Perjalanan Cinta
          </h2>
          <p className="text-[#7A6B5D] text-sm md:text-base">
            Setiap pertemuan adalah takdir, setiap kisah adalah anugerah
          </p>
          <div className="floral-divider mt-4">
            <span className="center">✦</span>
          </div>          </motion.div>

          <div className="main-timeline relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#C9A96E] via-[#D4A574] to-[#C9A96E]" />

          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`timeline relative flex items-center mb-12 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className={`timeline-content bg-[#FFF8F0] rounded-2xl p-6 shadow-lg border border-[#C9A96E]/10 hover:shadow-xl transition-shadow duration-300 ${
                  index % 2 === 0 ? 'text-right' : 'text-left'
                }`}>
                  <span className="date text-xs md:text-sm text-[#C9A96E] font-semibold uppercase tracking-wider">
                    {story.date}
                  </span>
                  <h3 className="title text-lg md:text-xl font-semibold text-[#8B5E3C] mt-1 mb-2">
                    {story.title}
                  </h3>
                  <p className="description text-sm md:text-base text-[#7A6B5D] leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>

              {/* Center icon */}
              <div className="w-2/12 flex justify-center">
                <div className="timeline-icon w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8B5E3C] flex items-center justify-center shadow-lg z-10">
                  <FiHeart className="text-white text-sm md:text-base" />
                </div>
              </div>

              {/* Empty space */}
              <div className="w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
