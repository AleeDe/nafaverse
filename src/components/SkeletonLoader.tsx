import React from 'react';

interface SkeletonLoaderProps {
  type?: 'page' | 'card' | 'text' | 'button';
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'page', 
  className = '' 
}) => {
  if (type === 'page') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] p-4 ${className}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-12 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="h-4 bg-white/20 rounded mb-3"></div>
                  <div className="h-4 bg-white/20 rounded mb-3 w-5/6"></div>
                  <div className="h-4 bg-white/20 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`animate-pulse bg-white/10 rounded-xl p-6 ${className}`}>
        <div className="h-4 bg-white/20 rounded mb-3"></div>
        <div className="h-4 bg-white/20 rounded mb-3 w-5/6"></div>
        <div className="h-4 bg-white/20 rounded w-4/6"></div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-white/20 rounded mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-5/6"></div>
      </div>
    );
  }

  if (type === 'button') {
    return (
      <div className={`animate-pulse h-12 bg-white/10 rounded-xl ${className}`}></div>
    );
  }

  return null;
};