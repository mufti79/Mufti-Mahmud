
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { PresentationViewer } from './components/PresentationViewer';
import { generateSlidesFromText } from './services/geminiService';
import type { Slide } from './types';

// Declare PptxGenJS for use with the window object
declare const PptxGenJS: any;

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError("Please enter some text or upload a document to generate a presentation.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSlides(null);
    setCurrentSlide(0);

    try {
      const generatedSlides = await generateSlidesFromText(text);
      if (generatedSlides && generatedSlides.length > 0) {
        setSlides(generatedSlides);
      } else {
        setError("The AI could not generate slides from the provided text. Please try again with different content.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the presentation. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDownload = useCallback(() => {
    if (!slides || slides.length === 0) return;

    const pptx = new PptxGenJS();
    
    slides.forEach(slideData => {
      const slide = pptx.addSlide();
      
      // Title
      slide.addText(slideData.title, { 
        x: 0.5, y: 0.25, w: '90%', h: 1, 
        fontSize: 32, 
        bold: true, 
        color: '363636',
        align: 'center'
      });

      // Content
      slide.addText(slideData.content.join('\n'), {
        x: 0.5, y: 1.5, w: '90%', h: 4,
        fontSize: 18,
        color: '4f4f4f',
        bullet: true,
      });
    });

    pptx.writeFile({ fileName: 'presentation.pptx' });
  }, [slides]);

  const goToNextSlide = () => {
    if (slides && currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <InputArea onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
        <div className="flex flex-col bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-6">
          <PresentationViewer
            slides={slides}
            currentSlide={currentSlide}
            isLoading={isLoading}
            error={error}
            onNext={goToNextSlide}
            onPrev={goToPrevSlide}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
