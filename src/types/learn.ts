export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  videoId: string;
  questions: QuizQuestion[];
}

export interface VideoProgress {
  videoId: string;
  completed: boolean;
  quizScore?: number;
  quizPassed?: boolean;
}
