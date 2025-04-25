import { useState } from 'react';
import { Message } from '@/types/message';
import useChat from './use-chat';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'text',
      sender: 'Bot',
      content: 'Hello, how can I help you today?',
      timestamp: new Date(Date.now()),
    },
  ]);

  const { sendChatRequest, loading, error } = useChat();

  const createMessage = (type: Message['type'], sender: string, content: string, additionalProps = {}): Message => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    sender,
    content,
    timestamp: new Date(),
    ...additionalProps,
  });

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const createErrorMessage = (content: string) => {
    return createMessage('system', 'System', content);
  };

  const resetMessages = () => {
    setMessages([createMessage('text', 'Bot', 'Hello, how can I help you today?')]);
  };

  const handleApiError = () => {
    addMessage(createErrorMessage('Failed to send message. Please try again.'));
  };

  const sendMessage = async (content: string) => {
    const userMessage = createMessage('text', 'You', content);
    addMessage(userMessage);

    try {
      const chatResponse = await sendChatRequest({
        type: 'text',
        message: content,
      });

      const botMessage = createMessage('text', 'Bot', chatResponse.response);
      addMessage(botMessage);
    } catch (err) {
      handleApiError();
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    createMessage,
    addMessage,
    createErrorMessage,
    resetMessages,
    sendChatRequest,
  };
};
