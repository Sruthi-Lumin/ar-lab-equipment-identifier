// Utility Functions - Helper functions for the application

export class PerformanceMonitor {
  constructor() {
    this.frames = 0;
    this.startTime = Date.now();
    this.fps = 0;
    this.lastFrameTime = 0;
  }

  recordFrame() {
    this.frames++;
    const now = Date.now();
    const elapsed = now - this.startTime;

    if (elapsed >= 1000) {
      this.fps = (this.frames * 1000) / elapsed;
      this.frames = 0;
      this.startTime = now;
    }

    this.lastFrameTime = now;
    return this.fps;
  }

  getFPS() {
    return this.fps.toFixed(1);
  }

  reset() {
    this.frames = 0;
    this.startTime = Date.now();
    this.fps = 0;
  }
}

export class TemporalFilter {
  constructor(windowSize = 5) {
    this.windowSize = windowSize;
    this.history = [];
  }

  addDetection(detection) {
    this.history.push(detection);
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }
  }

  getFilteredDetection() {
    if (this.history.length === 0) return null;

    // Average bounding boxes and confidence
    const avgBox = [0, 0, 0, 0];
    let totalConfidence = 0;

    this.history.forEach(det => {
      det.bbox.forEach((val, idx) => {
        avgBox[idx] += val / this.history.length;
      });
      totalConfidence += det.score / this.history.length;
    });

    return {
      bbox: avgBox,
      score: totalConfidence,
      class: this.history[this.history.length - 1].class
    };
  }

  clear() {
    this.history = [];
  }
}

export class NonMaximumSuppression {
  static apply(detections, iouThreshold = 0.5) {
    if (!detections || detections.length === 0) return [];

    // Sort by confidence
    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const kept = [];

    for (const detection of sorted) {
      let shouldKeep = true;

      for (const keptDetection of kept) {
        const iou = this.calculateIOU(detection.bbox, keptDetection.bbox);
        if (iou > iouThreshold) {
          shouldKeep = false;
          break;
        }
      }

      if (shouldKeep) {
        kept.push(detection);
      }
    }

    return kept;
  }

  static calculateIOU(boxA, boxB) {
    const [x1a, y1a, wa, ha] = boxA;
    const [x2a, y2a, x2wa, x2ha] = boxB;

    const x1b = x2a;
    const y1b = y2a;
    const wb = x2wa;
    const hb = x2ha;

    // Calculate intersection
    const xi1 = Math.max(x1a, x1b);
    const yi1 = Math.max(y1a, y1b);
    const xi2 = Math.min(x1a + wa, x1b + wb);
    const yi2 = Math.min(y1a + ha, y1b + hb);

    const interWidth = Math.max(0, xi2 - xi1);
    const interHeight = Math.max(0, yi2 - yi1);
    const interArea = interWidth * interHeight;

    // Calculate union
    const boxAArea = wa * ha;
    const boxBArea = wb * hb;
    const unionArea = boxAArea + boxBArea - interArea;

    return unionArea > 0 ? interArea / unionArea : 0;
  }
}

export class LocalStorageManager {
  static save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('localStorage save failed:', error);
      return false;
    }
  }

  static load(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.warn('localStorage load failed:', error);
      return defaultValue;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage remove failed:', error);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('localStorage clear failed:', error);
      return false;
    }
  }
}

export class DetectionLogger {
  constructor() {
    this.detections = [];
    this.maxSize = 1000;
  }

  log(detection, timestamp = Date.now()) {
    const entry = {
      ...detection,
      timestamp,
      id: `${detection.class}_${timestamp}`
    };

    this.detections.push(entry);
    if (this.detections.length > this.maxSize) {
      this.detections.shift();
    }
  }

  getDetectionStats(className = null) {
    const filtered = className 
      ? this.detections.filter(d => d.class === className)
      : this.detections;

    if (filtered.length === 0) return null;

    const scores = filtered.map(d => d.score);
    const avgScore = scores.reduce((a, b) => a + b) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    return {
      count: filtered.length,
      avgScore,
      maxScore,
      minScore,
      className,
      firstDetection: filtered[0].timestamp,
      lastDetection: filtered[filtered.length - 1].timestamp
    };
  }

  getTopDetections(limit = 10, className = null) {
    const filtered = className
      ? this.detections.filter(d => d.class === className)
      : this.detections;

    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  export() {
    return {
      detections: this.detections,
      exportDate: new Date().toISOString(),
      totalCount: this.detections.length
    };
  }

  clear() {
    this.detections = [];
  }
}

export class NotificationManager {
  constructor() {
    this.notifications = new Map();
    this.timeout = 3000;
  }

  show(message, type = 'info', duration = this.timeout) {
    const id = Math.random().toString(36);
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };

    this.notifications.set(id, notification);

    setTimeout(() => {
      this.notifications.delete(id);
    }, duration);

    return id;
  }

  remove(id) {
    this.notifications.delete(id);
  }

  getAll() {
    return Array.from(this.notifications.values());
  }

  clear() {
    this.notifications.clear();
  }
}

export class CameraManager {
  constructor() {
    this.stream = null;
    this.constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
  }

  async start(videoElement) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      videoElement.srcObject = this.stream;
      return true;
    } catch (error) {
      console.error('Camera access error:', error);
      throw new Error(`Camera access denied: ${error.message}`);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async toggleTorch(enable) {
    try {
      if (!this.stream) return false;

      const videoTrack = this.stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities?.();

      if (!capabilities?.torch) {
        console.warn('Torch not supported on this device');
        return false;
      }

      await videoTrack.applyConstraints({
        advanced: [{ torch: enable }]
      });

      return true;
    } catch (error) {
      console.warn('Torch control error:', error);
      return false;
    }
  }

  async speak(text, language = 'en-US') {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis error:', error);
    }
  }
}

export class BoundingBoxUtils {
  static normalizeBox(box, width, height) {
    const [x, y, w, h] = box;
    return [x / width, y / height, w / width, h / height];
  }

  static denormalizeBox(box, width, height) {
    const [x, y, w, h] = box;
    return [x * width, y * height, w * width, h * height];
  }

  static calculateArea(box) {
    return box[2] * box[3];
  }

  static calculateCenter(box) {
    return [box[0] + box[2] / 2, box[1] + box[3] / 2];
  }

  static expandBox(box, factor = 1.1) {
    const [x, y, w, h] = box;
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const newW = w * factor;
    const newH = h * factor;
    return [centerX - newW / 2, centerY - newH / 2, newW, newH];
  }
}

// Export all utilities
export default {
  PerformanceMonitor,
  TemporalFilter,
  NonMaximumSuppression,
  LocalStorageManager,
  DetectionLogger,
  NotificationManager,
  CameraManager,
  BoundingBoxUtils
};
