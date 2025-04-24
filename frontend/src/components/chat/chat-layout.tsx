'use client';

import {useRef, useState} from 'react';
import {MessageSquare, Settings} from 'lucide-react';
import ChatInput from './chat-input';
import MessageText from './message-text';
import MessageImage from './message-image';
import MessageFile from './message-file';
import SystemBubble from './system-bubble';
import useAutoScroll from '@/hooks/use-auto-scroll';

type MessageType = 'text' | 'image' | 'file' | 'system';

interface Message {
  id: string;
  type: MessageType;
  sender: string;
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      sender: 'You',
      content: 'Hello, how are you?',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: '2',
      type: 'text',
      sender: 'Bot',
      content: 'I am good, thank you!',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      type: 'system',
      sender: 'System',
      content: 'Chat history has been reset',
      timestamp: new Date(Date.now() - 3200000),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useAutoScroll(messagesEndRef, messages);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      sender: 'You',
      content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const handleFileUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');

    const newMessage: Message = {
      id: Date.now().toString(),
      type: isImage ? 'image' : 'file',
      sender: 'You',
      content: isImage ? 'Sent an image' : `Sent a file: ${file.name}`,
      timestamp: new Date(),
      ...(isImage
        ? {
            imageUrl: URL.createObjectURL(file),
            imageWidth: 400,
            imageHeight: 300,
            imageAlt: file.name,
          }
        : {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
    };

    setMessages([...messages, newMessage]);
  };

  const handleReset = () => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      sender: 'System',
      content: 'Chat history has been reset',
      timestamp: new Date(),
    };
    setMessages([systemMessage]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => {
          switch (message.type) {
            case 'text':
              return <MessageText key={message.id} message={message} />;
            case 'image':
              return <MessageImage key={message.id} message={message} />;
            case 'file':
              return <MessageFile key={message.id} message={message} />;
            case 'system':
              return <SystemBubble key={message.id} message={message} />;
            default:
              return null;
          }
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}
