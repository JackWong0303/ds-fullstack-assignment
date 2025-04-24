'use client';

import type React from 'react';

import {useState, useRef} from 'react';
import {Send, Paperclip, X} from 'lucide-react';
import FileUpload from './file-upload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
}

export default function ChatInput({
  onSendMessage,
  onFileUpload,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center border rounded-lg overflow-hidden bg-white">
        <FileUpload
          onFileUpload={onFileUpload}
          onUploadStateChange={setIsUploading}
        >
          <button
            type="button"
            className="p-3 text-gray-500 hover:text-indigo-600 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </button>
        </FileUpload>

        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 focus:outline-none"
          disabled={isUploading}
        />

        <button
          type="submit"
          className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          disabled={!message.trim() || isUploading}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
            <span>Uploading...</span>
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
