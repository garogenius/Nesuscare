import { Bot } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === 'ai';

  return (
    <div
      className={cn(
        'flex items-start space-x-3',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      {isAI && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50">
          <Bot className="h-4 w-4 text-rose-600" />
        </span>
      )}
      <div
        className={cn(
          'rounded-lg px-4 py-2 text-sm',
          isAI
            ? 'bg-gray-100 text-gray-900'
            : 'bg-rose-500 text-white'
        )}
      >
        {message.content}
      </div>
    </div>
  );
}