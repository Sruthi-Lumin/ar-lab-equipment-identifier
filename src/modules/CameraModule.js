/**
 * CameraModule - Handles WebRTC camera access and video streaming
 */
class CameraModule {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment'
      },
      audio: false
    };
  }

  /**
   * Initialize camera and attach to video element
   * @param {HTMLVideoElement} videoElement - Target video element
   * @returns {Promise<MediaStream>}
   */
  async initialize(videoElement) {
    try {
      this.videoElement = videoElement;
      
      // Check browser compatibility
      const getUserMedia = navigator.mediaDevices?.getUserMedia 
        || navigator.mediaDevices?.webkitGetUserMedia;
      
      if (!getUserMedia) {
        throw new Error('WebRTC not supported in this browser');
      }

      console.log('Requesting camera permissions...');
      
      // Request camera access with a timeout
      const cameraPromise = navigator.mediaDevices.getUserMedia(this.constraints);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Camera permission request timeout')), 10000)
      );
      
      this.stream = await Promise.race([cameraPromise, timeoutPromise]);
      console.log('✓ Camera permission granted');
      
      // Attach stream to video element
      this.videoElement.srcObject = this.stream;
      
      // Play video
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error('Video playback timeout')), 5000);
        this.videoElement.onloadedmetadata = () => {
          clearTimeout(timeoutId);
          this.videoElement.play()
            .then(resolve)
            .catch(err => {
              console.warn('Autoplay prevented:', err);
              resolve();
            });
        };
      });

      console.log('Camera initialized successfully');
      return this.stream;
    } catch (error) {
      console.error('Camera initialization failed:', error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError' || error.message.includes('permission')) {
        throw new Error('Camera permission denied. Please allow access and reload the page.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera device found. Please check your device.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Camera request timed out. Please reload and try again.');
      }
      
      throw error;
    }
  }

  /**
   * Capture frame from video stream
   * @returns {Canvas}
   */
  captureFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoElement, 0, 0);
    
    return canvas;
  }

  /**
   * Get video dimensions
   * @returns {Object} {width, height}
   */
  getDimensions() {
    return {
      width: this.videoElement.videoWidth,
      height: this.videoElement.videoHeight
    };
  }

  /**
   * Stop camera stream
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
   * Switch camera (front/back)
   */
  async switchCamera() {
    this.stop();
    this.constraints.video.facingMode = 
      this.constraints.video.facingMode === 'environment' ? 'user' : 'environment';
    return this.initialize(this.videoElement);
  }

  /**
   * Toggle torch/flashlight (if supported)
   */
  async toggleTorch() {
    try {
      const track = this.stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (!capabilities.torch) {
        console.warn('Torch not supported on this device');
        return false;
      }

      const settings = track.getSettings();
      await track.applyConstraints({
        advanced: [{ torch: !settings.torch }]
      });
      return true;
    } catch (error) {
      console.error('Torch toggle failed:', error);
      return false;
    }
  }
}

export default CameraModule;
