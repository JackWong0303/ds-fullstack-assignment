import Image from 'next/image';
import {formatDistanceToNow} from 'date-fns';

interface MessageImageProps {
  message: {
    sender: string;
    content: string;
    timestamp: Date;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
  };
}

export default function MessageImage({message}: MessageImageProps) {
  const isCurrentUser = message.sender === 'You';

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] ${isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-2`}
      >
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{message.sender}</span>
          <span className="text-xs opacity-70">
            {formatDistanceToNow(message.timestamp, {addSuffix: true})}
          </span>
        </div>
        <p className="mt-1 mb-2">{message.content}</p>
        <div className="rounded-lg overflow-hidden">
          <Image
            src={message.imageUrl || '/placeholder.svg?height=300&width=400'}
            alt={message.imageAlt || 'Image'}
            width={message.imageWidth || 400}
            height={message.imageHeight || 300}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
