import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { isListeningState, voiceState } from "../store/voiceState";

export const useSpeech = () => {
  const [isListening, setIsListening] = useRecoilState(isListeningState);
  const [, setTranscript] = useRecoilState(voiceState);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.error("Browser does not support the Web Speech API");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true; // Keep listening until explicitly stopped
    recognitionRef.current.interimResults = true; // Emit partial results
    recognitionRef.current.lang = "en-US"; // Default language

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      setTranscript("");
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    startListening,
    stopListening,
    isListening,
  };
};
