import {FileIcon, Download} from 'lucide-react';
import {formatDistanceToNow} from 'date-fns';

interface MessageFileProps {
  message: {
    sender: string;
    content: string;
    timestamp: Date;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };
}

export default function MessageFile({message}: MessageFileProps) {
  const isCurrentUser = message.sender === 'You';
  const formattedSize = message.fileSize
    ? message.fileSize < 1000000
      ? `${(message.fileSize / 1024).toFixed(1)} KB`
      : `${(message.fileSize / 1048576).toFixed(1)} MB`
    : 'Unknown size';

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
        <div
          className={`flex items-center p-3 rounded-lg ${isCurrentUser ? 'bg-indigo-700' : 'bg-gray-300'}`}
        >
          <FileIcon
            className={`h-8 w-8 ${isCurrentUser ? 'text-white' : 'text-gray-700'} mr-3`}
          />
          <div className="flex-1">
            <p className="font-medium truncate">{message.fileName}</p>
            <p className="text-sm opacity-80">
              {formattedSize} • {message.fileType}
            </p>
          </div>
          <button
            className={`p-2 rounded-full ${isCurrentUser ? 'hover:bg-indigo-800' : 'hover:bg-gray-400'} transition-colors`}
          >
            <Download
              className={`h-5 w-5 ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
