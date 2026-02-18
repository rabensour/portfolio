import type { ChatMessage } from '../types/astro';

const STORAGE_KEY = 'astro-chat-history';
const API_KEY_STORAGE = 'astro-api-key';

export const storage = {
  saveConversation(messages: ChatMessage[]): void {
    try {
      const serialized = JSON.stringify(messages);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save conversation:', error);
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Keep only last 20 messages
        const truncated = messages.slice(-20);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(truncated));
        } catch {
          console.error('Failed to save even truncated conversation');
        }
      }
    }
  },

  loadConversation(): ChatMessage[] | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return null;
    }
  },

  clearConversation(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  },

  saveApiKey(apiKey: string): void {
    try {
      localStorage.setItem(API_KEY_STORAGE, apiKey);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  },

  loadApiKey(): string | null {
    try {
      return localStorage.getItem(API_KEY_STORAGE);
    } catch (error) {
      console.error('Failed to load API key:', error);
      return null;
    }
  },

  clearApiKey(): void {
    try {
      localStorage.removeItem(API_KEY_STORAGE);
    } catch (error) {
      console.error('Failed to clear API key:', error);
    }
  }
};
