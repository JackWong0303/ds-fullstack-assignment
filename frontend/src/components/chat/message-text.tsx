import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <motion.div
      className={cn('flex items-start gap-2', isCurrentUser && 'flex-row-reverse')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Card className={cn('shadow-sm', isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
            <CardContent className="p-3 text-sm">{message.content}</CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
