/* eslint-disable react/prop-types */
import { useSpeech } from "../hooks/useSpeech";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { isListeningState, voiceState } from "../store/voiceState";

const MicrophoneButton = () => {
  const { startListening, stopListening } = useSpeech();
  const [isListening, setIsListening] = useRecoilState(isListeningState);
  const [transcript, ] = useRecoilState(voiceState);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Microphone Button */}
      <button
        onClick={handleMicClick}
        className={`relative p-6 rounded-full shadow-xl transition-all duration-300 transform ${
          isListening
            ? "bg-red-500 text-white scale-110 hover:scale-110"
            : "bg-blue-500 text-white scale-100 hover:scale-110 hover:bg-blue-600"
        } focus:outline-none focus:ring-4 focus:ring-blue-300 active:ring-2 active:ring-blue-500`}
        aria-label="Toggle Microphone"
      >
        {/* Microphone Icon */}
        {isListening ? (
          <FaMicrophoneAltSlash className="text-2xl" />
        ) : (
          <FaMicrophone className="text-2xl" />
        )}

        {/* Sound Wave Animation */}
        {isListening && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center pointer-events-none">
            <div className="wave-container">
              <div className="wave wave-1"></div>
              <div className="wave wave-2"></div>
              <div className="wave wave-3"></div>
            </div>
          </div>
        )}
      </button>

      {/* Transcript / Listening Status */}
      <div className="mt-0">
        <p className="text-center text-sm font-medium text-gray-500 max-h-10 overflow-hidden">
          {transcript ||
            (isListening ? "Listening..." : "Tap the mic to start")}
        </p>
      </div>

      <style>{`
        .wave-container {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .wave {
          width: 10px;
          height: 10px;
          margin: 0 3px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.6);
          animation: wave-animation 1.5s infinite ease-in-out;
        }

        .wave-1 {
          animation-delay: 0s;
        }

        .wave-2 {
          animation-delay: 0.3s;
        }

        .wave-3 {
          animation-delay: 0.6s;
        }

        @keyframes wave-animation {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MicrophoneButton;
