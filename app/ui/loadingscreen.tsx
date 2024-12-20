export default function LoadingScreen() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          {/* Loading Text */}
          <p className="text-gray-700 text-lg font-medium">Loading, please wait...</p>
        </div>
      </div>
    );
  }
  