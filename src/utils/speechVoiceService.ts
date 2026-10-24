/**
 * Voice Typing (Speech Recognition) and Read Aloud (Text-to-Speech) service
 */

// Declare WebkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechVoiceService {
  private static recognitionInstance: any = null;
  private static isListening: boolean = false;

  /**
   * Check if speech recognition is supported in this browser
   */
  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && 
      (Boolean(window.SpeechRecognition) || Boolean(window.webkitSpeechRecognition));
  }

  /**
   * Start dictation voice typing
   */
  public static startDictation(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onStateChange: (listening: boolean) => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        this.isListening = true;
        onStateChange(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error !== 'no-speech') {
          onError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        this.isListening = false;
        onStateChange(false);
      };

      recognition.start();
      this.recognitionInstance = recognition;
      return true;
    } catch (err: any) {
      onError(err.message || 'Failed to start voice recognition');
      return false;
    }
  }

  /**
   * Stop dictation
   */
  public static stopDictation(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch (e) {
        // ignore
      }
      this.recognitionInstance = null;
      this.isListening = false;
    }
  }

  /**
   * Read aloud (Text-to-Speech)
   */
  public static speakText(
    text: string, 
    rate: number = 1.0, 
    voiceName?: string,
    onEnd?: () => void
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Text-to-speech is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voiceName) {
      const match = voices.find(v => v.name === voiceName);
      if (match) utterance.voice = match;
    } else {
      // Pick natural sounding voice if available
      const english = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (english) utterance.voice = english;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public static pauseSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public static resumeSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public static stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public static isSpeaking(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
}
