import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { ChatMessage, ResumeAnalysis, SkillGapAnalysisResult } from '../types';

interface ChatAssistantViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  careerGoal: string;
  resumeAnalysis: ResumeAnalysis | null;
  skillGapResult: SkillGapAnalysisResult | null;
  onClearChat: () => void;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({
  messages,
  onSendMessage,
  isSending,
  careerGoal,
  resumeAnalysis,
  skillGapResult,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I start preparing for an AI/ML interview?',
    'Which project should I build first to bridge my gaps?',
    'Explain the difference between LangChain and LlamaIndex',
    'How can I improve my Python and SQL skills faster?',
    'How do I explain my coursework projects on a resume?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;
    setInputText('');
    await onSendMessage(text.trim());
  };

  const handleCopy = (text: string, idx: number) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[760px] max-h-[82vh] rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/90 bg-slate-950/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-white">
                SkillPath AI Career Advisor
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized guidance for {resumeAnalysis?.personalInfo?.name || 'Student'} • Goal: {careerGoal}
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 text-xs flex items-center gap-1.5"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-base font-bold text-white">
                Hello {resumeAnalysis?.personalInfo?.name || 'there'}!
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                I have full awareness of your resume, your target role of <strong className="text-indigo-300">{careerGoal}</strong>, and your top skill gaps. Ask me anything!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-sm whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-opacity"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-2xl p-3 bg-slate-950/80 border border-slate-800 text-xs text-indigo-300 animate-pulse">
              Gemini is reasoning through your career trajectory...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex gap-2">
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            disabled={isSending}
            className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-slate-950 border-t border-slate-800/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask anything about ${careerGoal}, interview prep, or project ideas...`}
            disabled={isSending}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
