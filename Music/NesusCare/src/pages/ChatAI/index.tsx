import { useState } from 'react';
import { Send, Mic, Image, Bot } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { Layout } from '../../components/layout/Layout';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function ChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your health assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: 'I understand your concern. Let me help you with that...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Layout>
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-lg bg-white shadow-sm">
      <div className="flex items-center border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
            <Bot className="h-5 w-5 text-rose-600" />
          </span>
          <div className="ml-3">
            <h2 className="text-lg font-medium text-gray-900">Health Assistant</h2>
            <p className="text-sm text-gray-500">Always here to help</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <Image className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <Mic className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="block w-full rounded-full border-gray-300 pl-4 pr-12 focus:border-rose-500 focus:ring-rose-500"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-500"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}