export type UserState = 'tired' | 'energetic' | 'resistance' | null;

export interface Message {
  id: string;
  role: 'user' | 'coach';
  content: string;
  state?: UserState;
  timestamp: string;
}

export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatResponse {
  response: string;
  state: UserState;
  timestamp: string;
}

export interface WSMessage {
  message: string;
}
