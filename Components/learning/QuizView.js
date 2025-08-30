import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

export default function QuizView({ module, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < module.quiz_questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    module.quiz_questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        correctCount++;
      }
    });
    return Math.round((correctCount / module.quiz_questions.length) * 100);
  };
  
  if (showResults) {
    const score = calculateScore();
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-4xl font-bold my-6">Your Score: {score}%</p>
        <div className="space-y-4 text-left my-8">
          {module.quiz_questions.map((q, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${selectedAnswers[index] === q.correct_answer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <p className="font-semibold">{q.question}</p>
              <p className="text-sm mt-2">
                Your answer: {q.options[selectedAnswers[index]]}
                {selectedAnswers[index] !== q.correct_answer && ` | Correct answer: ${q.options[q.correct_answer]}`}
              </p>
              {selectedAnswers[index] !== q.correct_answer && <p className="text-xs text-gray-600 mt-1">{q.explanation}</p>}
            </div>
          ))}
        </div>
        <Button onClick={() => onComplete({ score })}>
          Finish Module <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  const currentQuestion = module.quiz_questions[currentQuestionIndex];

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {module.quiz_questions.length}</p>
      <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
      
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswers[currentQuestionIndex] === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestionIndex] === undefined}>
          {currentQuestionIndex < module.quiz_questions.length - 1 ? 'Next Question' : 'Show Results'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}