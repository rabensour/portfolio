export interface Planet {
  name: string;
  sign: string;
  degree: string;
  house: number;
  retrograde?: boolean;
  explanation: string;
}

export interface House {
  number: number;
  sign: string;
  degree: string;
  explanation: string;
}

export interface Aspect {
  planet1: string;
  aspect: string;
  planet2: string;
  orb: number;
  explanation: string;
  type: 'harmonious' | 'difficult' | 'neutral';
}

export interface BirthChart {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant: string;
  descendant: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
