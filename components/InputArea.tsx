
import React, { useState, useRef, useCallback } from 'react';

interface InputAreaProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l2.15-7.5H4.5a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
  </svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.5 3.75a2.25 2.25 0 0 0-2.25 2.25v10.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V6a2.25 2.25 0 0 0-2.25-2.25Z" clipRule="evenodd" />
        <path d="M16.5 6.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 0 0-1.06 0l-1.5 1.5a.75.75 0 1 0 1.06 1.06l1.19-1.19v.001Z" />
        <path d="M3 12a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Z" />
    </svg>
);

declare const pdfjsLib: any;
declare const mammoth: any;

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setText('');
    setIsParsing(true);

    const handleError = (message: string) => {
      alert(message);
      setFileName('');
      setText('');
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'pdf') {
      if (typeof pdfjsLib === 'undefined') {
        handleError("PDF processing library is not loaded. Please refresh the page.");
        return;
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;
      
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          setText(fullText);
        } catch (err) {
          console.error("Error parsing PDF:", err);
          handleError('Failed to parse PDF file.');
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileExtension === 'docx') {
      if (typeof mammoth === 'undefined') {
        handleError("DOCX processing library is not loaded. Please refresh the page.");
        return;
      }
      reader.onload = (e) => {
        mammoth.extractRawText({ arrayBuffer: e.target?.result as ArrayBuffer })
          .then((result: any) => {
            setText(result.value);
            setIsParsing(false);
          })
          .catch((err: any) => {
            console.error('Error parsing DOCX:', err);
            handleError('Failed to parse DOCX file.');
          });
      };
      reader.readAsArrayBuffer(file);
    } else if (['txt', 'md'].includes(fileExtension || '') || file.type.startsWith('text/')) {
      reader.onload = (e) => {
        setText(e.target?.result as string);
        setIsParsing(false);
      };
      reader.readAsText(file);
    } else {
        handleError(`Unsupported file type: .${fileExtension}. Please upload a .txt, .md, .pdf, or .docx file.`);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleGenerateClick = useCallback(() => {
    onGenerate(text);
  }, [onGenerate, text]);

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-6 space-y-4">
      <h2 className="text-xl font-bold text-indigo-300">1. Provide Content</h2>
      <p className="text-gray-400">
        Enter your text below or upload a document. The AI will use this content to create your presentation.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your presentation content here, or upload a supported document..."
        className="flex-grow w-full p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none min-h-[300px]"
        disabled={isLoading || isParsing}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.pdf,.docx"
        />
        <button
          onClick={triggerFileSelect}
          disabled={isLoading || isParsing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UploadIcon className="w-5 h-5"/>
          <span>
            {isParsing ? `Parsing...` : 
             fileName ? `Loaded: ${fileName.substring(0, 20)}...` : 'Upload Document'}
          </span>
        </button>
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || isParsing || !text.trim()}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
             <>
              <GenerateIcon className="w-5 h-5" />
              <span>Generate Presentation</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center">Supported formats: Plain Text (.txt, .md), PDF, and DOCX.</p>
    </div>
  );
};
