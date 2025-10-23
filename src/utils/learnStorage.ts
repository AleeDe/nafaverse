import { VideoProgress } from '../types/learn';

const PROGRESS_KEY = 'nafaVerseVideoProgress';

export const loadVideoProgress = (): VideoProgress[] => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading video progress:', error);
    return [];
  }
};

export const saveVideoProgress = (progress: VideoProgress[]): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving video progress:', error);
  }
};

export const updateVideoProgress = (videoId: string, completed: boolean, quizScore?: number, quizPassed?: boolean): void => {
  const allProgress = loadVideoProgress();
  const existingIndex = allProgress.findIndex(p => p.videoId === videoId);

  const updatedProgress: VideoProgress = {
    videoId,
    completed,
    quizScore,
    quizPassed
  };

  if (existingIndex >= 0) {
    allProgress[existingIndex] = updatedProgress;
  } else {
    allProgress.push(updatedProgress);
  }

  saveVideoProgress(allProgress);
};

export const getVideoProgress = (videoId: string): VideoProgress | null => {
  const allProgress = loadVideoProgress();
  return allProgress.find(p => p.videoId === videoId) || null;
};
