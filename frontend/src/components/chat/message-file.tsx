import { FileIcon, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

export default function MessageFile({ message }: MessageFileProps) {
  const isCurrentUser = message.sender === 'You';
  const initials = message.sender
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const formattedSize = message.fileSize
    ? message.fileSize < 1000000
      ? `${(message.fileSize / 1024).toFixed(1)} KB`
      : `${(message.fileSize / 1048576).toFixed(1)} MB`
    : 'Unknown size';

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
            <CardContent className="p-3">
              <p className="text-sm mb-2">{message.content}</p>
              <div
                className={cn(
                  'flex items-center p-3 rounded-md gap-2',
                  isCurrentUser ? 'bg-primary-foreground/10' : 'bg-background',
                )}
              >
                <FileIcon className="h-8 w-8 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{message.fileName}</p>
                  <p className="text-xs opacity-80">
                    {formattedSize} • {message.fileType}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
