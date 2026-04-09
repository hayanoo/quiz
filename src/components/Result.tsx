import { motion } from 'motion/react';
import { Quiz, UserAnswers } from '../types';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

interface ResultProps {
  quiz: Quiz;
  userAnswers: UserAnswers;
  onBack: () => void;
}

export default function Result({ quiz, userAnswers, onBack }: ResultProps) {
  // Tính điểm
  let mcScore = 0;
  let tfScore = 0;
  let saScore = 0;

  // 1. Multiple Choice
  const mcCorrect = userAnswers.multipleChoice.map((ans, i) => ans === quiz.keys.multipleChoice[i]);
  mcScore = mcCorrect.filter(Boolean).length * 0.25;

  // 2. True/False
  const tfCorrect = userAnswers.trueFalse.map((qAns, qIndex) => {
    return qAns.map((ans, sIndex) => ans === quiz.keys.trueFalse[qIndex][sIndex]);
  });
  
  tfCorrect.forEach((q) => {
    const correctCount = q.filter(Boolean).length;
    if (correctCount === 1) tfScore += 0.1;
    else if (correctCount === 2) tfScore += 0.25;
    else if (correctCount === 3) tfScore += 0.5;
    else if (correctCount === 4) tfScore += 1.0;
  });

  // 3. Short Answer
  const saCorrect = userAnswers.shortAnswer.map((ans, i) => {
    // Normalize string for comparison (trim, lowercase)
    const normalizedUser = ans.trim().toLowerCase();
    const normalizedKey = quiz.keys.shortAnswer[i].trim().toLowerCase();
    return normalizedUser === normalizedKey;
  });
  const saPointPerQuestion = quiz.type === 1 ? 0.25 : 0.5;
  saScore = saCorrect.filter(Boolean).length * saPointPerQuestion;

  const totalScore = mcScore + tfScore + saScore;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-24"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 mb-2">
          <Trophy className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Kết quả bài thi</h1>
        <p className="text-xl text-gray-400 uppercase">{quiz.name}</p>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-4">
          <ScoreCard label="Trắc nghiệm" score={mcScore} max={quiz.keys.multipleChoice.length * 0.25} />
          <ScoreCard label="Đúng/Sai" score={tfScore} max={quiz.keys.trueFalse.length * 1.0} />
          <ScoreCard label="Trả lời ngắn" score={saScore} max={quiz.keys.shortAnswer.length * saPointPerQuestion} />
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {totalScore.toFixed(2)} <span className="text-2xl text-gray-500 font-medium">/ 10</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-12">
        <h2 className="text-2xl font-bold text-white border-b border-gray-800 pb-4">Chi tiết đáp án</h2>

        {/* Phần 1 */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-indigo-400">Phần I. Trắc nghiệm nhiều lựa chọn</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userAnswers.multipleChoice.map((ans, i) => {
              const isCorrect = mcCorrect[i];
              return (
                <div key={`res-mc-${i}`} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${isCorrect ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-rose-900/20 border-rose-800/50'}`}>
                  <span className="text-sm font-medium text-gray-400">Câu {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ans || '-'}
                    </span>
                    {!isCorrect && (
                      <>
                        <span className="text-gray-600">→</span>
                        <span className="text-lg font-bold text-emerald-400">{quiz.keys.multipleChoice[i]}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Phần 2 */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-emerald-400">Phần II. Trắc nghiệm đúng sai</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userAnswers.trueFalse.map((qAns, qIndex) => {
              const correctCount = tfCorrect[qIndex].filter(Boolean).length;
              return (
                <div key={`res-tf-${qIndex}`} className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-300">Câu {qIndex + 1}</span>
                    <span className="text-sm font-medium text-emerald-400">{correctCount}/4 ý đúng</span>
                  </div>
                  <div className="space-y-2">
                    {['a', 'b', 'c', 'd'].map((label, sIndex) => {
                      const isCorrect = tfCorrect[qIndex][sIndex];
                      const uAns = qAns[sIndex];
                      const kAns = quiz.keys.trueFalse[qIndex][sIndex];
                      return (
                        <div key={label} className={`flex items-center justify-between p-3 rounded-lg border ${isCorrect ? 'bg-emerald-900/10 border-emerald-800/30' : 'bg-rose-900/10 border-rose-800/30'}`}>
                          <span className="text-gray-400 font-medium uppercase">{label}</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {uAns === 'T' ? 'Đúng' : uAns === 'F' ? 'Sai' : '-'}
                            </span>
                            {!isCorrect && (
                              <>
                                <span className="text-gray-600">→</span>
                                <span className="text-sm font-medium text-emerald-400">
                                  {kAns === 'T' ? 'Đúng' : 'Sai'}
                                </span>
                              </>
                            )}
                            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Phần 3 */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-amber-400">Phần III. Trả lời ngắn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userAnswers.shortAnswer.map((ans, i) => {
              const isCorrect = saCorrect[i];
              return (
                <div key={`res-sa-${i}`} className={`p-4 rounded-xl border flex flex-col gap-2 ${isCorrect ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-rose-900/20 border-rose-800/50'}`}>
                  <span className="text-sm font-medium text-gray-400">Câu {i + 1}</span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Bài làm:</span>
                      <span className={`font-medium ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {ans || '(Trống)'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-800/50">
                        <span className="text-xs text-gray-500">Đáp án:</span>
                        <span className="font-medium text-emerald-400">{quiz.keys.shortAnswer[i]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/80 backdrop-blur-md border-t border-gray-800 flex justify-center z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          Quay lại trang chủ
        </button>
      </div>
    </motion.div>
  );
}

function ScoreCard({ label, score, max }: { label: string; score: number; max: number }) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-950 rounded-2xl border border-gray-800 min-w-[120px]">
      <span className="text-sm text-gray-400 mb-1">{label}</span>
      <div className="text-2xl font-bold text-white">
        {score.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/ {max}</span>
      </div>
    </div>
  );
}
