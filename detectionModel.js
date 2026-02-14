// Detection Model - EfficientDet Integration
// Handles model loading and inference

export class DetectionModel {
  constructor() {
    this.model = null;
    this.confidenceThreshold = 0.5;
    this.labels = [
      'microscope', 'bunsen_burner', 'beaker', 'flask', 'pipette',
      'test_tube', 'thermometer', 'graduated_cylinder', 'petri_dish',
      'dropper', 'funnel', 'stirring_rod', 'tripod', 'wire_gauze'
    ];
  }

  async load() {
    try {
      // Load TensorFlow.js and EfficientDet model
      await this.loadTensorFlowJS();
      await this.loadEfficientDetModel();
      console.log('Detection model loaded successfully');
    } catch (error) {
      throw new Error(`Failed to load detection model: ${error.message}`);
    }
  }

  async loadTensorFlowJS() {
    if (typeof tf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0';
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  }

  async loadEfficientDetModel() {
    try {
      // Load a pre-trained EfficientDet model
      // Using a COCO-trained model or custom lab equipment model
      this.model = await tf.loadGraphModel(
        'https://tfhub.dev/tensorflow/efficientdet/d0/1'
      );
      console.log('EfficientDet model loaded');
    } catch (error) {
      // Fallback to a simpler COCO-SSD model if EfficientDet fails
      console.warn('Falling back to COCO-SSD:', error.message);
      await this.loadCocoSSD();
    }
  }

  async loadCocoSSD() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2';
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    this.model = await cocoSsd.load();
  }

  async detect(videoElement) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    try {
      // Run detection on the video frame
      const predictions = await this.model.estimateObjects(videoElement, {
        maxDetections: 20,
        score: this.confidenceThreshold
      });

      // Filter for lab equipment classes
      return this.filterLabEquipment(predictions);
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }

  filterLabEquipment(predictions) {
    // Filter predictions to only lab equipment
    const labEquipmentKeywords = [
      'microscope', 'bunsen', 'beaker', 'flask', 'pipette',
      'test', 'tube', 'thermometer', 'cylinder', 'petri',
      'dropper', 'funnel', 'rod', 'tripod', 'gauze'
    ];

    return predictions.filter(pred => {
      const className = pred.class?.toLowerCase() || '';
      return labEquipmentKeywords.some(keyword => className.includes(keyword));
    });
  }

  setConfidenceThreshold(threshold) {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
}
