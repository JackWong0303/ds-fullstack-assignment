export type ChatRequestType = 'text' | 'file' | 'image';

export interface ChatRequest {
  type: ChatRequestType;
  message?: string;
  fileInfo?: {
    name?: string;
    type?: string;
    size?: number;
    width?: number;
    height?: number;
  };
}

export interface ChatResponse {
  response: string;
}
