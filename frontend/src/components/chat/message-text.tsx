import {formatDistanceToNow} from 'date-fns';

interface MessageTextProps {
  message: {
    sender: string;
    content: string;
    timestamp: Date;
  };
}

export default function MessageText({message}: MessageTextProps) {
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
        <p className="mt-1">{message.content}</p>
      </div>
    </div>
  );
}
