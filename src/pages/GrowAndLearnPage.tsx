import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, Award, X } from 'lucide-react';
import { videos, quizzes } from '../data/learnData';
import { Video, Quiz, VideoProgress } from '../types/learn';
import { loadVideoProgress, updateVideoProgress, getVideoProgress } from '../utils/learnStorage';

const GrowAndLearnPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);

  useEffect(() => {
    setVideoProgress(loadVideoProgress());
  }, []);

  const handleVideoComplete = (videoId: string) => {
    const quiz = quizzes.find(q => q.videoId === videoId);
    if (quiz) {
      setCurrentQuiz(quiz);
      setShowQuiz(true);
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;

    let correctCount = 0;
    currentQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / currentQuiz.questions.length) * 100;
    const passed = score >= 70;

    updateVideoProgress(currentQuiz.videoId, true, score, passed);
    setVideoProgress(loadVideoProgress());
    setQuizSubmitted(true);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setCurrentQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const getVideoProgressData = (videoId: string): VideoProgress | null => {
    return videoProgress.find(p => p.videoId === videoId) || null;
  };

  const calculateOverallProgress = () => {
    const completed = videoProgress.filter(p => p.completed && p.quizPassed).length;
    return Math.round((completed / videos.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Grow & Learn</h1>
          <p className="text-slate-600">Enhance your financial knowledge with our curated video library</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Your Learning Progress</h3>
              <p className="text-slate-600">
                {videoProgress.filter(p => p.completed && p.quizPassed).length} of {videos.length} courses completed
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Award className="text-yellow-500" size={48} />
              <span className="text-4xl font-bold text-slate-800">{calculateOverallProgress()}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 mt-4">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${calculateOverallProgress()}%` }}
            />
          </div>
        </div>

        {selectedVideo ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <button
              onClick={() => setSelectedVideo(null)}
              className="mb-4 px-4 py-2 text-slate-600 hover:text-slate-800 flex items-center gap-2"
            >
              ← Back to Videos
            </button>
            <div className="aspect-video bg-slate-900 rounded-xl mb-4 flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedVideo.title}</h2>
                <p className="text-slate-600 mb-4">{selectedVideo.description}</p>
                <div className="flex gap-3">
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {selectedVideo.category}
                  </span>
                  <span className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-full flex items-center gap-1">
                    <Clock size={14} />
                    {selectedVideo.duration}
                  </span>
                </div>
              </div>
              {getVideoProgressData(selectedVideo.id)?.completed && (
                <CheckCircle className="text-green-500" size={32} />
              )}
            </div>
            <button
              onClick={() => handleVideoComplete(selectedVideo.id)}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              Complete Video & Take Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => {
              const progress = getVideoProgressData(video.id);
              return (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition">
                      <Play className="text-white" size={48} />
                    </div>
                    {progress?.completed && progress?.quizPassed && (
                      <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2">
                        <CheckCircle className="text-white" size={20} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 mb-2">{video.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {video.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {video.duration}
                      </span>
                    </div>
                    {progress?.quizScore !== undefined && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">Quiz Score</span>
                          <span className={`text-xs font-bold ${
                            progress.quizPassed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {progress.quizScore.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showQuiz && currentQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Video Quiz</h2>
                <button
                  onClick={handleQuizClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {!quizSubmitted ? (
                <>
                  <p className="text-slate-600 mb-6">
                    Answer all questions to complete this video. You need 70% or higher to pass.
                  </p>

                  <div className="space-y-6">
                    {currentQuiz.questions.map((question, qIndex) => (
                      <div key={question.id} className="border border-slate-200 rounded-xl p-4">
                        <p className="font-medium text-slate-800 mb-4">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                                quizAnswers[question.id] === oIndex
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                checked={quizAnswers[question.id] === oIndex}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [question.id]: oIndex })}
                                className="mr-3"
                              />
                              <span className="text-slate-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== currentQuiz.questions.length}
                    className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  {currentQuiz && (() => {
                    let correctCount = 0;
                    currentQuiz.questions.forEach(q => {
                      if (quizAnswers[q.id] === q.correctAnswer) {
                        correctCount++;
                      }
                    });
                    const score = (correctCount / currentQuiz.questions.length) * 100;
                    const passed = score >= 70;

                    return (
                      <>
                        <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          passed ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {passed ? (
                            <CheckCircle className="text-green-500" size={48} />
                          ) : (
                            <X className="text-red-500" size={48} />
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                          {passed ? 'Congratulations!' : 'Keep Learning!'}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          You scored {score.toFixed(0)}% ({correctCount} out of {currentQuiz.questions.length} correct)
                        </p>
                        <p className="text-slate-600 mb-6">
                          {passed
                            ? 'You have successfully completed this video!'
                            : 'You need 70% or higher to pass. Review the video and try again!'}
                        </p>
                        <button
                          onClick={handleQuizClose}
                          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                          Continue Learning
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowAndLearnPage;
