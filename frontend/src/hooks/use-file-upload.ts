import { ChatRequest, ChatResponse } from '@/types/chat';
import { Message } from '@/types/message';
import { getFileType, getImageDimensions, validateFile } from '@/utils/file-utils';

interface UseFileUploadProps {
  addMessage: (message: Message) => void;
  createMessage: (type: Message['type'], sender: string, content: string, additionalProps?: object) => Message;
  createErrorMessage: (content: string) => Message;
  sendChatRequest: (request: ChatRequest) => Promise<ChatResponse>;
}

export const useFileUpload = ({
  addMessage,
  createMessage,
  createErrorMessage,
  sendChatRequest,
}: UseFileUploadProps) => {
  const handleFileUpload = async (file: File) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      addMessage(createErrorMessage(validation.errorMessage!));
      return;
    }

    const isImage = getFileType(file) === 'image';
    let imageWidth = 400;
    let imageHeight = 300;

    // Process image if needed
    if (isImage) {
      const objectUrl = URL.createObjectURL(file);
      try {
        const dimensions = await getImageDimensions(objectUrl);
        imageWidth = dimensions.width;
        imageHeight = dimensions.height;
      } catch (err) {
        console.error('Error getting image dimensions:', err);
      }
    }

    // Create user message with file
    const userMessage = createMessage(
      isImage ? 'image' : 'file',
      'You',
      isImage ? 'Sent an image' : `Sent a file: ${file.name}`,
      isImage
        ? {
            imageUrl: URL.createObjectURL(file),
            imageWidth,
            imageHeight,
            imageAlt: file.name,
          }
        : {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          },
    );

    addMessage(userMessage);

    // Send to API
    try {
      const chatResponse = await sendChatRequest({
        type: isImage ? 'image' : 'file',
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          width: isImage ? imageWidth : undefined,
          height: isImage ? imageHeight : undefined,
        },
      });

      const botMessage = createMessage('text', 'Bot', chatResponse.response);
      addMessage(botMessage);
    } catch (err) {
      addMessage(createErrorMessage('Failed to process file. Please try again.'));
    }
  };

  return { handleFileUpload };
};
