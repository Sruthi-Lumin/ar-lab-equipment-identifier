/**
 * VoiceModule - Web Speech API integration for voice commands and audio guidance
 */
class VoiceModule {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.commandCallbacks = new Map();
    
    this.setupRecognition();
  }

  /**
   * Setup speech recognition
   */
  setupRecognition() {
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.language = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      this.processCommand(transcript.toLowerCase().trim());
    };
  }

  /**
   * Start listening for voice commands
   */
  startListening() {
    if (!this.isListening) {
      this.recognition.start();
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Register voice command
   * @param {string} command 
   * @param {Function} callback 
   */
  registerCommand(command, callback) {
    this.commandCallbacks.set(command.toLowerCase(), callback);
  }

  /**
   * Process voice command
   * @param {string} transcript 
   */
  processCommand(transcript) {
    console.log('Command received:', transcript);
    
    for (const [command, callback] of this.commandCallbacks.entries()) {
      if (transcript.includes(command)) {
        callback();
        break;
      }
    }
  }

  /**
   * Speak text (text-to-speech)
   * @param {string} text 
   * @param {Object} options 
   */
  speak(text, options = {}) {
    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.lang || 'en-US';

    return new Promise((resolve) => {
      utterance.onend = resolve;
      utterance.onerror = resolve;
      this.synthesis.speak(utterance);
    });
  }

  /**
   * Speak equipment name and description
   * @param {string} equipmentName 
   * @param {string} description 
   */
  async speakEquipment(equipmentName, description) {
    const text = `Detected: ${equipmentName}. ${description}`;
    await this.speak(text, { rate: 0.9, pitch: 1.0 });
  }

  /**
   * Speak step-by-step instructions
   * @param {Array<string>} steps 
   */
  async speakInstructions(steps) {
    for (let i = 0; i < steps.length; i++) {
      const step = `Step ${i + 1}: ${steps[i]}`;
      await this.speak(step, { rate: 0.85 });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Speak alert
   * @param {string} message 
   */
  speakAlert(message) {
    return this.speak(message, { pitch: 1.2, rate: 1.1 });
  }

  /**
   * Available languages
   * @returns {Array<string>}
   */
  getAvailableLanguages() {
    return ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'ja-JP'];
  }

  /**
   * Set language
   * @param {string} lang 
   */
  setLanguage(lang) {
    this.recognition.language = lang;
  }

  /**
   * Check if speech synthesis supported
   * @returns {boolean}
   */
  isSynthesisSupported() {
    return !!this.synthesis;
  }

  /**
   * Check if speech recognition supported
   * @returns {boolean}
   */
  isRecognitionSupported() {
    return !!this.recognition;
  }

  /**
   * Get available voices
   * @returns {Array}
   */
  getAvailableVoices() {
    return this.synthesis.getVoices();
  }

  /**
   * Set voice
   * @param {number} voiceIndex 
   */
  setVoice(voiceIndex) {
    const voices = this.getAvailableVoices();
    if (voiceIndex >= 0 && voiceIndex < voices.length) {
      // Store for use in speak method
      this.selectedVoiceIndex = voiceIndex;
    }
  }

  /**
   * Stop all speech
   */
  stopSpeech() {
    this.synthesis.cancel();
  }

  /**
   * Cleanup
   */
  dispose() {
    this.stopListening();
    this.stopSpeech();
    this.commandCallbacks.clear();
  }
}

export default VoiceModule;
