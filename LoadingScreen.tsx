
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 gap-4">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="font-black text-2xl tracking-tighter animate-pulse">
        XDEVIL<span className="text-blue-500">EARNING</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
