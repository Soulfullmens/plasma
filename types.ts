
export interface SimulationState {
  t: number;
  electricFieldHistory: { time: number; amplitude: number }[];
  moments: number[];
  isRecurrence: boolean;
  resolution: number;
  k: number;
  alpha: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  phase: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
