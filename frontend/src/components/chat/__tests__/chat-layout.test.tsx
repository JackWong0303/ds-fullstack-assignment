import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatLayout from '../chat-layout';
import * as useChatModule from '@/hooks/use-chat';
import { createEvent } from '@testing-library/react';

jest.mock('@/hooks/use-chat', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/hooks/use-auto-scroll', () => ({
  __esModule: true,
  default: () => {},
}));

// Create a wrapper with QueryClientProvider for the tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
};

describe('ChatLayout', () => {
  const mockSendChatRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useChatModule.default as jest.Mock).mockReturnValue({
      sendChatRequest: mockSendChatRequest,
      loading: false,
      error: null,
    });
  });

  test('user can type "hi" and see the bot reply', async () => {
    mockSendChatRequest.mockResolvedValueOnce({
      response: 'hello there',
    });

    renderWithClient(<ChatLayout />);

    const inputField = screen.getByPlaceholderText(/Type your message/i);

    // Type "hi" in the input field
    await userEvent.type(inputField, 'hi');

    // Find and click the send button
    const sendButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(sendButton);
    // Verify the user message appears in the chat
    expect(screen.getByText('hi')).toBeTruthy();

    // Verify that sendChatRequest was called with the correct parameters
    expect(mockSendChatRequest).toHaveBeenCalledWith({
      type: 'text',
      message: 'hi',
    });

    // Wait for the bot response to appear
    await waitFor(() => {
      expect(screen.getByText('hello there')).toBeTruthy();
    });
  });

  test('shows loading spinner while waiting for response', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    mockSendChatRequest.mockReturnValueOnce(promise);

    (useChatModule.default as jest.Mock).mockReturnValue({
      sendChatRequest: mockSendChatRequest,
      loading: true,
      error: null,
    });

    renderWithClient(<ChatLayout />);

    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
    await act(async () => {
      resolvePromise({ response: 'hello there' });
    });
  });

  test('rejects files that exceed size limit', async () => {
    const largeFile = new File(['test content'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB

    renderWithClient(<ChatLayout />);

    const fileInput = screen.getByTestId('file-input-for-test');
    await act(async () => {
      const event = createEvent.change(fileInput, {
        target: { files: [largeFile] },
      });
      fireEvent(fileInput, event);
    });

    expect(screen.getByText(/File too large. Maximum size is 5MB/i)).toBeTruthy();
    expect(mockSendChatRequest).not.toHaveBeenCalled();
  });

  test('resets chat history when reset button is clicked', async () => {
    mockSendChatRequest.mockResolvedValueOnce({
      response: 'hello there',
    });

    renderWithClient(<ChatLayout />);

    const inputField = screen.getByPlaceholderText(/Type your message/i);

    // Type a message in the input field
    await userEvent.type(inputField, 'test message');

    // Find and click the send button
    const sendButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(sendButton);

    // Verify the message appears in the chat
    expect(screen.getByText('test message')).toBeTruthy();

    // Wait for the bot response to appear
    await waitFor(() => {
      expect(screen.getByText('hello there')).toBeTruthy();
    });

    // Find and click the reset button
    const resetButton = screen.getByTestId('reset-chat-button');
    await userEvent.click(resetButton);

    // Verify the messages are cleared and welcome message is shown
    await waitFor(() => {
      expect(screen.queryByText('test message')).not.toBeInTheDocument();
      expect(screen.queryByText('hello there')).not.toBeInTheDocument();
      expect(screen.getByText('Hello, how can I help you today?')).toBeTruthy();
    });
  });
});
