export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export enum InterviewState {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export type InterviewType = 'standard' | 'behavioral' | 'resume' | 'system-design';

export const INTERVIEW_TYPES: { id: InterviewType; title: string; description: string }[] = [
  {
    id: 'standard',
    title: 'Standard Technical',
    description: 'A mix of resume questions, data structures, algorithms, and system design concepts.',
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    description: 'Focuses on past experiences, problem-solving, and handling workplace situations.',
  },
  {
    id: 'resume',
    title: 'Resume Deep Dive',
    description: 'An in-depth conversation about specific projects and skills listed on your resume.',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'A focused session on designing scalable, distributed systems for real-world problems.',
  },
];
