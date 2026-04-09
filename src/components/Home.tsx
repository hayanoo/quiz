import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpenCheck } from 'lucide-react';

export default function Home({ onStart }: { onStart: (id: string) => void }) {
  const [quizId, setQuizId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizId.trim()) {
      onStart(quizId.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-indigo-500/10 rounded-full">
            <BookOpenCheck className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Hệ thống Trắc nghiệm
          </h1>
          <p className="text-gray-400">
            Nhập mã bài thi của bạn để bắt đầu làm bài.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="quizId" className="text-sm font-medium text-gray-300">
              Mã bài thi (ID)
            </label>
            <input
              id="quizId"
              type="text"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              placeholder="VD: DANG1, DANG2..."
              className="w-full px-4 py-3 text-lg bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-white placeholder-gray-600 uppercase"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors"
          >
            Bắt đầu làm bài
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
