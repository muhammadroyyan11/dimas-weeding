'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { formatDateTime } from '@/lib/utils';

interface Comment {
  id: number;
  name: string;
  message: string;
  attendance: string;
  createdAt: string;
  approved: boolean;
}

interface CommentsProps {
  initialComments: Comment[];
  themeName?: string;
}

export default function Comments({ initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments.filter(c => c.approved));
  const [form, setForm] = useState({ name: '', message: '', attendance: 'Hadir' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError('Nama dan ucapan harus diisi');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [...prev, newComment]);
        setSubmitted(true);
        setForm({ name: '', message: '', attendance: 'Hadir' });
      } else {
        setError('Gagal mengirim ucapan. Silakan coba lagi.');
      }
    } catch {
      setError('Gagal mengirim ucapan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="ucapan-konten" className="py-20 px-4 bg-[#FFF8F0]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display text-[#8B5E3C] mb-4" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Ucapan & Doa
          </h2>
          <p className="text-[#7A6B5D] text-sm md:text-base">
            Kirimkan ucapan dan doa restu untuk kedua mempelai
          </p>
          <div className="floral-divider mt-4">
            <span className="center">✦</span>
          </div>
        </motion.div>

        {/* Form */}
        {!submitted ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-10"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#7A6B5D] mb-2">Nama</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A96E]" />
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#C9A96E]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] transition-colors text-[#3D2B1F]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#7A6B5D] mb-2">Kehadiran</label>
                <select
                  value={form.attendance}
                  onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FFF8F0] border border-[#C9A96E]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] transition-colors text-[#3D2B1F]"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                  <option value="Ragu">Ragu</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-[#7A6B5D] mb-2">Ucapan & Doa</label>
              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-3 text-[#C9A96E]" />
                <textarea
                  placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#C9A96E]/20 rounded-xl focus:outline-none focus:border-[#C9A96E] transition-colors resize-none text-[#3D2B1F]"
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-[#8B5E3C] text-white rounded-xl hover:bg-[#7A4E2C] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Mengirim...' : (
                <>
                  <FiSend /> Kirim Ucapan
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center mb-10"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-[#8B5E3C] mb-2">Terima Kasih!</h3>
            <p className="text-[#7A6B5D] text-sm mb-4">Ucapan Anda telah terkirim dan akan ditampilkan setelah disetujui.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#8B5E3C] underline hover:text-[#7A4E2C] transition-colors text-sm"
            >
              Kirim ucapan lain
            </button>
          </motion.div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#7A6B5D]">Belum ada ucapan. Jadilah yang pertama!</p>
            </div>
          ) : (
            comments.slice().reverse().map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="komen bg-white rounded-xl p-5 shadow-md border border-[#C9A96E]/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                      <FiUser className="text-[#8B5E3C]" />
                    </div>
                    <div>
                      <h4 className="komen-nama font-semibold text-[#8B5E3C] text-sm">{comment.name}</h4>
                      <span className="text-xs text-[#C9A96E]">{formatDateTime(comment.createdAt)}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    comment.attendance === 'Hadir' 
                      ? 'bg-green-100 text-green-700' 
                      : comment.attendance === 'Tidak Hadir'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {comment.attendance}
                  </span>
                </div>
                <p className="komen-isi text-[#7A6B5D] text-sm leading-relaxed">{comment.message}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
