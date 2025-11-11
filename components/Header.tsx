import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Presentation Generator AT Bashundhara Group</h1>
      </div>
    </header>
  );
};
