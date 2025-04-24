import { AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SystemBubbleProps {
  message: {
    content: string;
    timestamp: Date;
  };
}

export default function SystemBubble({ message }: SystemBubbleProps) {
  return (
    <div className="flex justify-center px-4">
      <Alert variant="default" className="max-w-[80%] border-muted-foreground/20 bg-muted/50">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription className="flex items-center gap-2 text-muted-foreground text-sm">
          {message.content}
          <span className="text-xs opacity-70">{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
