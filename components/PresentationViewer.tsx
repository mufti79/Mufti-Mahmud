
import React from 'react';
import { Slide as SlideType } from '../types';
import { Slide } from './Slide';

interface PresentationViewerProps {
  slides: SlideType[] | null;
  currentSlide: number;
  isLoading: boolean;
  error: string | null;
  onNext: () => void;
  onPrev: () => void;
  onDownload: () => void;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);


export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides,
  currentSlide,
  isLoading,
  error,
  onNext,
  onPrev,
  onDownload
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg className="animate-spin h-10 w-10 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium">Generating your presentation...</p>
          <p className="text-sm">This may take a moment.</p>
        </div>
      );
    }
    if (error) {
      return <div className="flex items-center justify-center h-full text-red-400 p-4">{error}</div>;
    }
    if (!slides) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
          <h3 className="text-lg font-semibold">Your presentation will appear here</h3>
          <p className="mt-1">Provide some content and click "Generate Presentation" to begin.</p>
        </div>
      );
    }
    return <Slide slide={slides[currentSlide]} />;
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-indigo-300 mb-4">2. Review & Download</h2>
      <div className="flex-grow bg-gray-900 rounded-lg shadow-inner overflow-hidden flex items-center justify-center aspect-[16/9]">
        {renderContent()}
      </div>
      {slides && slides.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-gray-400 font-medium">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <button
            onClick={onNext}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
       {slides && slides.length > 0 && (
        <div className="mt-6">
            <button 
                onClick={onDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-200 disabled:bg-green-800 disabled:cursor-not-allowed shadow-lg"
            >
                <DownloadIcon className="w-5 h-5" />
                Download as PowerPoint (.pptx)
            </button>
        </div>
      )}
    </div>
  );
};
