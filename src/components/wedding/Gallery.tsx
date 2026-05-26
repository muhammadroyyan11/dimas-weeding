'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
}

interface GalleryProps {
  images: GalleryItem[];
  themeName?: string;
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (images.length === 0) {
    return (
    <section id="gallery" className="gallery-section section-title py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display text-[#8B5E3C] mb-4" style={{ fontFamily: "'Brush Script MT', cursive" }}>
              Pre-Wedding Gallery
            </h2>
            <p className="text-[#7A6B5D] text-sm md:text-base">
              Galeri pre-wedding akan segera hadir
            </p>
            <div className="floral-divider mt-4">
              <span className="center">✦</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery-section section-title py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display text-[#8B5E3C] mb-4" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Pre-Wedding Gallery
          </h2>
          <p className="text-[#7A6B5D] text-sm md:text-base">
            Kenangan indah sebelum hari bahagia
          </p>
          <div className="floral-divider mt-4">
            <span className="center">✦</span>
          </div>
        </motion.div>

        <div className="gallery-grids grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="grid relative group cursor-pointer rounded-xl overflow-hidden shadow-md"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white text-sm p-4">{image.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-[#C9A96E] transition-colors z-10"
              >
                <FiX className="text-2xl" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 text-white hover:text-[#C9A96E] transition-colors disabled:opacity-30 z-10"
                    disabled={selectedIndex === 0}
                  >
                    <FiChevronLeft className="text-3xl" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 text-white hover:text-[#C9A96E] transition-colors disabled:opacity-30 z-10"
                    disabled={selectedIndex === images.length - 1}
                  >
                    <FiChevronRight className="text-3xl" />
                  </button>
                </>
              )}

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-4xl max-h-[80vh] mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].caption}
                  className="w-full h-full object-contain rounded-lg"
                />
                <p className="text-white text-center mt-4 text-sm">
                  {images[selectedIndex].caption}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
