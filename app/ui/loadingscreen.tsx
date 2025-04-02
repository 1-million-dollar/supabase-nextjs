export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="text-center">
        {/* Sophisticated animated logo/mark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20"></div>
          <div className="absolute inset-4 rounded-full border-t-2 border-blue-600 animate-spin"></div>
          <div className="absolute inset-6 rounded-full border-b-2 border-blue-400 animate-spin-reverse"></div>
          <div className="absolute inset-8 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Elegant loading text */}
        <h2 className="text-3xl font-light text-gray-800 mb-2">
          <span className="font-medium text-blue-600">Loading</span> your content
        </h2>
        
        {/* Minimal progress indicator */}
        <div className="w-64 mx-auto mt-6 h-0.5 bg-gray-200 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-slide"></div>
        </div>

        {/* Subtle status text */}
        <p className="mt-6 text-sm text-gray-500 font-light tracking-wider">
          JUST A MOMENT PLEASE
        </p>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
        .animate-slide {
          animation: slide 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}