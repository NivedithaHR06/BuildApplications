
import React, { useState, useRef, useEffect } from 'react';
import { AppMode, Message, Quiz, StudyPlan, Summary } from './types';
import { getExplanation, generateQuiz, generateStudyPlan, generateSummary } from './services/geminiService';
import QuizView from './components/QuizView';
import StudyPlanView from './components/StudyPlanView';
import SummaryView from './components/SummaryView';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am OmniStudy AI. What subject are we mastering today? I can explain topics, quiz you, or help you create a study plan.',
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLAIN);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      let assistantMessage: Message;

      if (mode === AppMode.QUIZ) {
        const quizData = await generateQuiz(currentInput);
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've prepared a quiz on **${quizData.title}** for you!`,
          type: 'quiz',
          quizData,
        };
      } else if (mode === AppMode.STUDY_PLAN) {
        const planData = await generateStudyPlan(currentInput);
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Here is your custom study plan for **${planData.title}**:`,
          type: 'plan',
          planData,
        };
      } else if (mode === AppMode.SUMMARIZE) {
        const summaryData = await generateSummary(currentInput);
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've summarized that for you. Here are the key points:`,
          type: 'summary',
          summaryData,
        };
      } else {
        const response = await getExplanation(currentInput, mode);
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.text,
          sources: response.sources,
          type: 'text'
        };
      }
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I ran into an issue processing that. Could you try rephrasing or checking your connection?",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (message: Message) => {
    if (message.type === 'quiz' && message.quizData) {
      return <QuizView quiz={message.quizData} onComplete={(score) => console.log('Score:', score)} />;
    }
    
    if (message.type === 'plan' && message.planData) {
      return <StudyPlanView plan={message.planData} />;
    }

    if (message.type === 'summary' && message.summaryData) {
      return <SummaryView summary={message.summaryData} />;
    }

    // Default text/markdown rendering
    return (
      <div className="prose prose-slate max-w-none">
        {message.content.split('\n').map((line, i) => (
          <p key={i} className="mb-2 last:mb-0">
            {line.startsWith('#') ? (
              <span className="font-bold text-lg text-indigo-700 block mt-4 mb-2">{line.replace(/^#+\s/, '')}</span>
            ) : line.startsWith('- ') || line.startsWith('* ') ? (
              <li className="ml-4 list-disc">{line.substring(2)}</li>
            ) : (
              line
            )}
          </p>
        ))}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sources</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">OmniStudy AI</h1>
            <p className="text-xs text-slate-500">Your Personal Multi-Modality Tutor</p>
          </div>
        </div>
        
        <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg">
          {Object.values(AppMode).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 overflow-hidden relative flex flex-col items-center">
        <div 
          ref={scrollRef}
          className="w-full max-w-4xl flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-4 md:p-6 shadow-sm border ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                {renderContent(msg)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.15s]" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                <span className="text-sm text-slate-400 ml-2">Crafting your response...</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl p-4 md:p-6 bg-slate-50 border-t border-slate-200 md:border-none">
          <div className="md:hidden flex overflow-x-auto gap-2 mb-4 no-scrollbar">
            {Object.values(AppMode).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  mode === m ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                mode === AppMode.QUIZ ? "Enter a topic to generate a quiz..." :
                mode === AppMode.STUDY_PLAN ? "What's your goal? (e.g., Learn Calculus in 1 week)" :
                mode === AppMode.SUMMARIZE ? "Paste text here to condense it..." :
                "Ask anything... (e.g., 'Explain quantum physics')"
              }
              className="w-full bg-white border border-slate-300 rounded-2xl py-4 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-lg resize-none min-h-[64px] max-h-[300px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 bottom-3 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            AI can generate inaccurate information. Check important facts.
          </p>
        </div>
      </main>
      
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        textarea::placeholder { transition: color 0.3s ease; }
      `}</style>
    </div>
  );
};

export default App;
