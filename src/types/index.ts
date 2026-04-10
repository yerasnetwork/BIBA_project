export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  plan: 'free' | 'premium';
  createdAt: string;
  income?: number;
  isSingleMom?: boolean;
  kidsCount?: number;
  babyName?: string;
  babyBirthdate?: string;
}

export interface Vitals {
  heartRate: number;
  temperature: number;
  oxygen: number;
  movement: 'active' | 'calm' | 'still';
  timestamp: number;
}

export interface VitalsPoint {
  time: string;
  heartRate: number;
}

export interface Alert {
  id: string;
  type: 'heartRate' | 'temperature' | 'oxygen';
  value: number;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: 'health' | 'psychology' | 'legal' | 'finance';
  preview: string;
  content: string;
  readTime: number;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorCity: string;
  category: 'question' | 'experience' | 'support';
  title: string;
  content: string;
  likes: number;
  comments: ForumComment[];
  createdAt: string;
}

export interface ForumComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  tier: 'basic' | 'advanced' | 'live';
  duration: string;
  lessons: number;
}

export interface MoodEntry {
  date: string;
  score: number;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface LegalQuestion {
  id: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  createdAt: string;
}
