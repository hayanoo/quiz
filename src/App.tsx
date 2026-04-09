/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Home from './components/Home';
import QuizComponent from './components/Quiz';
import Result from './components/Result';
import { Quiz, UserAnswers } from './types';
import quizzesData from './data/quizzes.json';

export default function App() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStartQuiz = (quizId: string) => {
    const quiz = (quizzesData as Quiz[]).find((q) => q.id.toUpperCase() === quizId.toUpperCase());
    if (quiz) {
      setCurrentQuiz(quiz);
      // Initialize empty answers
      setUserAnswers({
        multipleChoice: Array(quiz.keys.multipleChoice.length).fill(''),
        trueFalse: Array(quiz.keys.trueFalse.length).fill(null).map(() => Array(4).fill('')),
        shortAnswer: Array(quiz.keys.shortAnswer.length).fill(''),
      });
      setIsSubmitted(false);
    } else {
      alert('Không tìm thấy mã bài thi này! Vui lòng thử lại (VD: DANG1, DANG2).');
    }
  };

  const handleSubmit = (answers: UserAnswers) => {
    setUserAnswers(answers);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setCurrentQuiz(null);
    setUserAnswers(null);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      {!currentQuiz && <Home onStart={handleStartQuiz} />}
      {currentQuiz && !isSubmitted && userAnswers && (
        <QuizComponent quiz={currentQuiz} initialAnswers={userAnswers} onSubmit={handleSubmit} onBack={handleReset} />
      )}
      {currentQuiz && isSubmitted && userAnswers && (
        <Result quiz={currentQuiz} userAnswers={userAnswers} onBack={handleReset} />
      )}
    </div>
  );
}
