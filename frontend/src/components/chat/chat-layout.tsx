'use client';

import { useRef, useState } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
      sender: 'Bot',
      content: 'Hello, how can I help you today?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      type: 'text',
      sender: 'You',
      content: 'I need help with my website',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: '3',
      type: 'file',
      sender: 'You',
      content: 'Here is the document',
      fileName: 'project_brief.pdf',
      fileType: 'application/pdf',
      fileSize: 2500000,
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: '4',
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
    <Card className="flex flex-col h-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="flex flex-col gap-4 p-4">
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
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <ChatInput onSendMessage={handleSendMessage} onFileUpload={handleFileUpload} />
      </CardFooter>
    </Card>
  );
}
