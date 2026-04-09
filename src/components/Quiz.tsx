import { useState } from 'react';
import { motion } from 'motion/react';
import { Quiz, UserAnswers } from '../types';
import { ChevronLeft, Send } from 'lucide-react';

interface QuizProps {
  quiz: Quiz;
  initialAnswers: UserAnswers;
  onSubmit: (answers: UserAnswers) => void;
  onBack: () => void;
}

export default function QuizComponent({ quiz, initialAnswers, onSubmit, onBack }: QuizProps) {
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);

  const handleMCChange = (index: number, value: string) => {
    const newMC = [...answers.multipleChoice];
    newMC[index] = value;
    setAnswers({ ...answers, multipleChoice: newMC });
  };

  const handleTFChange = (qIndex: number, sIndex: number, value: string) => {
    const newTF = [...answers.trueFalse];
    newTF[qIndex] = [...newTF[qIndex]];
    newTF[qIndex][sIndex] = value;
    setAnswers({ ...answers, trueFalse: newTF });
  };

  const handleSAChange = (index: number, value: string) => {
    const newSA = [...answers.shortAnswer];
    newSA[index] = value;
    setAnswers({ ...answers, shortAnswer: newSA });
  };

  const handleSubmit = () => {
    if (window.confirm('Bạn có chắc chắn muốn nộp bài?')) {
      onSubmit(answers);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-24"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white uppercase">{quiz.name}</h1>
          <p className="text-gray-400">Dạng {quiz.type} • Điền đáp án của bạn bên dưới</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Phần 1: Trắc nghiệm nhiều lựa chọn */}
        <section className="space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-xl font-semibold text-indigo-400">Phần I. Câu trắc nghiệm nhiều phương án lựa chọn</h2>
            <p className="text-sm text-gray-500 mt-1">Mỗi câu trả lời đúng được 0,25 điểm.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {answers.multipleChoice.map((ans, i) => (
              <div key={`mc-${i}`} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-gray-400">Câu {i + 1}</span>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleMCChange(i, opt)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                        ans === opt
                          ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phần 2: Trắc nghiệm đúng sai */}
        <section className="space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-xl font-semibold text-emerald-400">Phần II. Câu trắc nghiệm đúng sai</h2>
            <p className="text-sm text-gray-500 mt-1">Điểm tối đa 1 điểm/câu. Đúng 1 ý: 0,1đ | 2 ý: 0,25đ | 3 ý: 0,5đ | 4 ý: 1đ.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {answers.trueFalse.map((qAns, qIndex) => (
              <div key={`tf-${qIndex}`} className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-4">
                <span className="text-base font-medium text-gray-300">Câu {qIndex + 1}</span>
                <div className="space-y-3">
                  {['a', 'b', 'c', 'd'].map((label, sIndex) => (
                    <div key={label} className="flex items-center justify-between bg-gray-950 p-3 rounded-lg border border-gray-800/50">
                      <span className="text-gray-400 font-medium uppercase">{label}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTFChange(qIndex, sIndex, 'T')}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            qAns[sIndex] === 'T'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          Đúng
                        </button>
                        <button
                          onClick={() => handleTFChange(qIndex, sIndex, 'F')}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            qAns[sIndex] === 'F'
                              ? 'bg-rose-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          Sai
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phần 3: Trả lời ngắn */}
        <section className="space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-xl font-semibold text-amber-400">Phần III. Câu trắc nghiệm trả lời ngắn</h2>
            <p className="text-sm text-gray-500 mt-1">Mỗi câu trả lời đúng được {quiz.type === 1 ? '0,25' : '0,5'} điểm.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {answers.shortAnswer.map((ans, i) => (
              <div key={`sa-${i}`} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col gap-2">
                <label htmlFor={`sa-input-${i}`} className="text-sm font-medium text-gray-400">
                  Câu {i + 1}
                </label>
                <input
                  id={`sa-input-${i}`}
                  type="text"
                  value={ans}
                  onChange={(e) => handleSAChange(i, e.target.value)}
                  placeholder="Nhập đáp án..."
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-white"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/80 backdrop-blur-md border-t border-gray-800 flex justify-center z-50">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" />
          Nộp bài
        </button>
      </div>
    </motion.div>
  );
}
