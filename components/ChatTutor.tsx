'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ChatTutor({ videoId }: { videoId: string }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  if (!token) {
    return (
      <div className="flex flex-col h-full min-h-[500px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return <ChatTutorInner videoId={videoId} token={token} />;
}

function ChatTutorInner({ videoId, token }: { videoId: string; token: string }) {
  const [input, setInput] = useState('');

  const { messages, status, error, sendMessage } = useChat({
    id: videoId,
    transport: new TextStreamChatTransport({
      api: 'http://127.0.0.1:5000/api/video/chat',
      body: { videoId },
      headers: { Authorization: `Bearer ${token}` }
    })
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add the user message and trigger generation
    sendMessage({ text: input });
    
    setInput('');
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-[500px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white font-semibold flex items-center gap-2">
        <Bot size={20} />
        AI Lecture Tutor
      </div>
      
      {/* Chat Messages */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm border-b border-red-200">
          Error: {error.message}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 mt-10 space-y-2">
            <Bot size={40} className="text-gray-300" />
            <p>I am your AI tutor for this video.</p>
            <p className="text-sm">Ask me anything about the content!</p>
          </div>
        )}
        
        {messages.map((m: any) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role !== 'user' && (
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                 <Bot size={16} />
               </div>
            )}
            
            <div className={`max-w-[80%] p-3 rounded-xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'}`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.text || m.content || (m.parts && m.parts.map((p: any) => p.text).join(''))}
              </p>
            </div>
            
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
           <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
               <Loader2 size={16} className="animate-spin" />
             </div>
             <div className="bg-gray-100 p-3 rounded-xl rounded-bl-none text-gray-500 text-sm">
               Thinking...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <form onSubmit={onFormSubmit} className="flex gap-2">
          <input 
            value={input} 
            onChange={handleInputChange} 
            placeholder="Ask a question..." 
            className="flex-1 bg-white px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input?.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
