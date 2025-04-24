import {AlertCircle} from 'lucide-react';
import {formatDistanceToNow} from 'date-fns';

interface SystemBubbleProps {
  message: {
    content: string;
    timestamp: Date;
  };
}

export default function SystemBubble({message}: SystemBubbleProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 max-w-[80%] flex items-center">
        <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
        <span>{message.content}</span>
        <span className="text-xs ml-2 opacity-70">
          {formatDistanceToNow(message.timestamp, {addSuffix: true})}
        </span>
      </div>
    </div>
  );
}
