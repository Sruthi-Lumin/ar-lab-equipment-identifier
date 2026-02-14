// Configuration file for Lab AR Identifier
// Centralized settings for the application

export const CONFIG = {
  // Model Configuration
  model: {
    // Primary model: EfficientDet from TensorFlow Hub
    efficientDet: {
      url: 'https://tfhub.dev/tensorflow/efficientdet/d0/1',
      enabled: true,
      description: 'EfficientDet-D0: Optimized for accuracy and speed'
    },
    
    // Fallback model: COCO-SSD
    cocoSSD: {
      url: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2',
      enabled: true,
      description: 'COCO-SSD: Reliable fallback option'
    },

    // Default confidence threshold
    defaultThreshold: 0.5,
    minThreshold: 0.0,
    maxThreshold: 1.0,
    
    // Detection parameters
    maxDetections: 20,
    scoreThreshold: 0.3,
    iouThreshold: 0.5
  },

  // Camera Configuration
  camera: {
    // Preferred facing mode: 'environment' for rear camera, 'user' for front
    facingMode: 'environment',
    
    // Video constraints
    constraints: {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    },

    // Frame processing
    fps: 30,
    frameInterval: 33 // ms (1000/30)
  },

  // UI Configuration
  ui: {
    // Default language
    defaultLanguage: 'en-US',
    
    // Supported languages
    languages: {
      'en-US': 'English (US)',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German',
      'zh-CN': 'Chinese (Simplified)',
      'ja-JP': 'Japanese'
    },

    // Status message durations
    messageDuration: 3000, // ms

    // Status bar styling
    statusStyles: {
      info: 'status-info',
      success: 'status-success',
      error: 'status-error',
      loading: 'status-loading'
    }
  },

  // Performance Settings
  performance: {
    // Enable performance monitoring
    monitorPerformance: true,
    
    // Display FPS counter
    showFPS: true,
    
    // Temporal filtering window size
    temporalFilterWindow: 5,
    
    // Non-maximum suppression IoU threshold
    nmsIouThreshold: 0.5,

    // Memory settings
    maxDetectionHistory: 1000
  },

  // Detection Settings
  detection: {
    // Lab equipment classes
    labEquipmentClasses: [
      'microscope',
      'bunsen_burner',
      'beaker',
      'flask',
      'pipette',
      'test_tube',
      'thermometer',
      'graduated_cylinder',
      'petri_dish',
      'dropper',
      'funnel',
      'stirring_rod',
      'tripod',
      'wire_gauze'
    ],

    // Keywords for lab equipment filtering
    labEquipmentKeywords: [
      'microscope',
      'bunsen',
      'beaker',
      'flask',
      'pipette',
      'test',
      'tube',
      'thermometer',
      'cylinder',
      'petri',
      'dropper',
      'funnel',
      'rod',
      'tripod',
      'gauze'
    ],

    // Enable equipment filtering
    filterLabEquipment: true,

    // Confidence thresholds
    thresholds: {
      high: 0.8,
      medium: 0.6,
      low: 0.4
    }
  },

  // AR Rendering Settings
  ar: {
    // Enable AR visualization
    enabled: true,

    // Canvas settings
    canvas: {
      clearColor: 'rgba(0, 0, 0, 0)',
      lineWidth: 3,
      globalAlpha: 0.9
    },

    // Bounding box colors
    colors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
    ],

    // Text styling
    text: {
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      padding: 8
    },

    // Confidence bar
    confidenceBar: {
      height: 6,
      colors: {
        high: '#4CAF50',    // Green
        medium: '#FFC107',  // Yellow
        low: '#FF9800'      // Orange
      }
    },

    // Glow effects
    glow: {
      enabled: true,
      shadowBlur: 15
    }
  },

  // Storage Settings
  storage: {
    // Enable localStorage
    enabled: true,

    // Storage keys
    keys: {
      language: 'lab-ar-language',
      threshold: 'lab-ar-threshold',
      settings: 'lab-ar-settings',
      history: 'lab-ar-detection-history'
    }
  },

  // Logging Settings
  logging: {
    // Enable debug logging
    debug: false,

    // Log detection results
    logDetections: true,

    // Max log entries
    maxLogs: 1000
  },

  // Voice Settings (Future)
  voice: {
    enabled: false,
    language: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  },

  // Torch Settings (Future)
  torch: {
    enabled: false,
    supportedDevices: ['mobile', 'tablet']
  },

  // Error Handling
  errors: {
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000, // ms

    // Timeout settings
    modelLoadTimeout: 30000, // ms
    detectionTimeout: 5000   // ms
  },

  // Development Settings
  development: {
    // Enable development mode
    devMode: false,

    // Show diagnostics
    showDiagnostics: false,

    // Log all events
    logAllEvents: false
  }
};

// Helper functions for configuration

export function getModelConfig() {
  return CONFIG.model;
}

export function getCameraConfig() {
  return CONFIG.camera;
}

export function getUIConfig() {
  return CONFIG.ui;
}

export function getDetectionConfig() {
  return CONFIG.detection;
}

export function getARConfig() {
  return CONFIG.ar;
}

export function getStorageConfig() {
  return CONFIG.storage;
}

export function setConfig(path, value) {
  const keys = path.split('.');
  let obj = CONFIG;
  
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  
  obj[keys[keys.length - 1]] = value;
}

export function getConfig(path) {
  const keys = path.split('.');
  let obj = CONFIG;
  
  for (const key of keys) {
    obj = obj[key];
  }
  
  return obj;
}

export default CONFIG;
