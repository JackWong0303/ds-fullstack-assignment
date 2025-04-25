'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface ResetChatButtonProps {
  onReset: () => void;
}

export default function ResetChatButton({ onReset }: ResetChatButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
              data-testid="reset-chat-button"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Reset Chat</span>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear chat history</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
