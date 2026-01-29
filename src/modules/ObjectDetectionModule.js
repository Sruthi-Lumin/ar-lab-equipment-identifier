/**
 * ObjectDetectionModule - TensorFlow.js based object detection
 */
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

class ObjectDetectionModule {
  constructor() {
    this.model = null;
    this.isLoading = false;
    this.detectionThreshold = 0.5;
  }

  /**
   * Load COCO-SSD model
   * @returns {Promise<void>}
   */
  async loadModel() {
    try {
      this.isLoading = true;
      console.log('Loading TensorFlow.js model...');
      this.model = await cocoSsd.load();
      console.log('Model loaded successfully');
      this.isLoading = false;
    } catch (error) {
      console.error('Model loading failed:', error);
      this.isLoading = false;
      throw error;
    }
  }

  /**
   * Detect objects in image
   * @param {Canvas|HTMLVideoElement} input - Input image or video
   * @returns {Promise<Array>} Array of predictions
   */
  async detect(input) {
    if (!this.model) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    try {
      const predictions = await this.model.detect(input);
      // filter by score/confidence
      const filtered = predictions.filter(p => (p.score || 0) >= this.detectionThreshold);
      return filtered;
    } catch (error) {
      console.error('Detection failed:', error);
      return [];
    }
  }

  /**
   * Detect objects and filter by confidence
   * @param {Canvas|HTMLVideoElement} input 
   * @param {number} threshold - Confidence threshold (0-1)
   * @returns {Promise<Array>} Filtered predictions
   */
  async detectWithThreshold(input, threshold = null) {
    const previousThreshold = this.detectionThreshold;
    if (threshold !== null) {
      this.detectionThreshold = threshold;
    }

    const predictions = await this.detect(input);
    this.detectionThreshold = previousThreshold;
    return predictions;
  }

  /**
   * Get high confidence detections
   * @param {Canvas|HTMLVideoElement} input 
   * @returns {Promise<Array>}
   */
  async getHighConfidenceDetections(input) {
    return this.detectWithThreshold(input, 0.7);
  }

  /**
   * Filter detections by class
   * @param {Array} predictions 
   * @param {string|Array} classes - Single class or array of classes
   * @returns {Array}
   */
  filterByClass(predictions, classes) {
    const classArray = Array.isArray(classes) ? classes : [classes];
    return predictions.filter(pred => classArray.includes(pred.class));
  }

  /**
   * Get predictions for lab equipment
   * @param {Canvas|HTMLVideoElement} input
   * @returns {Promise<Array>}
   */
  async detectLabEquipment(input) {
    const predictions = await this.detect(input);
    const labEquipmentClasses = [
      'bottle',
      'cup',
      'scissors',
      'knife',
      'spoon',
      'fork',
      'plate',
      'bowl',
      'clock',
      'lamp',
      'microscope',
      'telescope',
      'beaker',
      'flask',
      'test tube',
      'pipette',
      'burette',
      'tripod',
      'bunsen burner'
    ];
    
    return this.filterByClass(predictions, labEquipmentClasses);
  }

  /**
   * Set detection confidence threshold
   * @param {number} threshold 
   */
  setThreshold(threshold) {
    if (threshold >= 0 && threshold <= 1) {
      this.detectionThreshold = threshold;
    }
  }

  /**
   * Dispose model and free memory
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

export default ObjectDetectionModule;
