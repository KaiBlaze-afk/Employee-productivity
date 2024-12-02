const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-teal-400">
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner Icon */}
      <div className="animate-spin rounded-full border-4 border-t-4 border-white w-16 h-16 mb-4"></div>

      {/* Loading Text with Animation */}
      <p className="text-white text-2xl font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  </div>
);

export default LoadingScreen;
