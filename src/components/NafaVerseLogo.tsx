import React from 'react';
import nafaverseLogo from '../public/logo/nafaverseLogo.png';

interface NafaVerseLogoProps {
  className?: string;
}

export const NafaVerseLogo: React.FC<NafaVerseLogoProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <img src={nafaverseLogo} alt="NafaVerse" className={`${className} object-contain`} />
  );
};