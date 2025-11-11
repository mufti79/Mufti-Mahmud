
import React from 'react';
import { Slide as SlideType } from '../types';

interface SlideProps {
  slide: SlideType;
}

export const Slide: React.FC<SlideProps> = ({ slide }) => {
  return (
    <div className="w-full h-full p-6 md:p-8 flex flex-col justify-center bg-white text-gray-800">
      <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
        {slide.title}
      </h3>
      <ul className="space-y-2 md:space-y-3 text-base md:text-lg">
        {slide.content.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className="text-indigo-500 mr-3 mt-1">&#8226;</span>
            <span className="flex-1 break-words">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
