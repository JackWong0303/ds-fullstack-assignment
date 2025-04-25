'use client';

import { useRef } from 'react';
import { MessageSquare, Settings, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ChatInput from './chat-input';
import MessageText from './message-text';
import MessageImage from './message-image';
import MessageFile from './message-file';
import SystemBubble from './system-bubble';
import ResetChatButton from './reset-chat-button';
import useAutoScroll from '@/hooks/use-auto-scroll';
import { useMessages } from '@/hooks/use-messages';
import { useFileUpload } from '@/hooks/use-file-upload';

export default function ChatLayout() {
  const {
    messages,
    loading,
    error,
    sendMessage,
    createMessage,
    addMessage,
    createErrorMessage,
    resetMessages,
    sendChatRequest,
  } = useMessages();

  const { handleFileUpload } = useFileUpload({
    addMessage,
    createMessage,
    createErrorMessage,
    sendChatRequest,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useAutoScroll(messagesEndRef, messages);

  return (
    <Card className="flex flex-col h-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat
        </CardTitle>
        <div className="flex items-center gap-2">
          <ResetChatButton onReset={resetMessages} />
        </div>
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
      <CardFooter className="p-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" role="status" data-testid="loading-spinner" />
          </div>
        )}
        <ChatInput onSendMessage={sendMessage} onFileUpload={handleFileUpload} />
      </CardFooter>
    </Card>
  );
}
