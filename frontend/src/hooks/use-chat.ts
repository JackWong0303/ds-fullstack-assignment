import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ChatRequest, ChatResponse } from '@/types/chat';

const chat = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>('/api/chat', request);
  return response.data;
};

export const useChat = () => {
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: chat,
    onError: err => {
      const errorMessage = axios.isAxiosError(err)
        ? `Error: ${err.response?.status} ${err.response?.statusText || err.message}`
        : err instanceof Error
          ? err.message
          : 'Unknown error occurred';
      setError(errorMessage);
    },
  });

  const sendChatRequest = async (request: ChatRequest): Promise<ChatResponse> => {
    setError(null);
    return await mutation.mutateAsync(request);
  };

  return {
    sendChatRequest,
    loading: mutation.isPending,
    error,
  };
};

export default useChat;
