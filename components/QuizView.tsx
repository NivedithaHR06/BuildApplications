
import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '../types';

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
      onComplete(score);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Quiz Complete!</h3>
        <p className="text-slate-600 mb-6">
          You scored <span className="font-bold text-indigo-600">{score}</span> out of {quiz.questions.length}
        </p>
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="text-3xl font-bold text-indigo-600">
            {Math.round((score / quiz.questions.length) * 100)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-indigo-600 uppercase tracking-wider text-xs">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </h3>
        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-lg font-semibold text-slate-800 mb-6">{currentQuestion.question}</p>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let bgColor = "bg-slate-50 border-slate-200 hover:border-indigo-300";
          if (showFeedback) {
            if (idx === currentQuestion.correctAnswer) bgColor = "bg-green-100 border-green-500 ring-1 ring-green-500";
            else if (idx === selectedOption) bgColor = "bg-red-100 border-red-500 ring-1 ring-red-500";
          } else if (idx === selectedOption) {
            bgColor = "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${bgColor}`}
              disabled={showFeedback}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-700">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mb-6 animate-fadeIn">
          <div className={`p-4 rounded-lg mb-4 ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="text-sm font-medium mb-1">
              {selectedOption === currentQuestion.correctAnswer ? '✨ Correct!' : '❌ Not quite right'}
            </p>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
