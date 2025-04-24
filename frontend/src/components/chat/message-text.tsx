import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MessageTextProps {
  message: {
    sender: string;
    content: string;
    timestamp: Date;
  };
}

export default function MessageText({ message }: MessageTextProps) {
  const isCurrentUser = message.sender === 'You';
  const initials = message.sender
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={cn('flex items-start gap-2', isCurrentUser && 'flex-row-reverse')}>
      <Avatar className="mt-0.5">
        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${initials}`} alt={message.sender} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{message.sender}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        <Card className={cn('shadow-sm', isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
          <CardContent className="p-3 text-sm">{message.content}</CardContent>
        </Card>
      </div>
    </div>
  );
}
