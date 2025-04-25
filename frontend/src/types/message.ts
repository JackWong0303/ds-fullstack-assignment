type MessageType = 'text' | 'image' | 'file' | 'system';

export interface Message {
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
