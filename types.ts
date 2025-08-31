
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export enum InterviewState {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}
