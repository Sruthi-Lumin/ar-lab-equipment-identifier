import { DetectionModel } from './detectionModel.js';
import { ARRenderer } from './arRenderer.js';
import { UIController } from './uiController.js';
import { EquipmentDatabase } from './equipmentDatabase.js';

class LabARIdentifier {
  constructor() {
    this.model = null;
    this.arRenderer = null;
    this.uiController = null;
    this.equipmentDB = null;
    this.isRunning = false;
    this.videoElement = null;
    this.canvasElement = null;
  }

  async initialize() {
    try {
      // Initialize UI
      this.uiController = new UIController();
      this.uiController.updateStatus('Initializing...', 'info');

      // Load equipment database
      this.equipmentDB = new EquipmentDatabase();
      await this.equipmentDB.initialize();

      // Get video and canvas elements
      this.videoElement = document.getElementById('videoInput');
      this.canvasElement = document.getElementById('arCanvas');

      // Initialize AR Renderer
      this.arRenderer = new ARRenderer(this.canvasElement);

      // Initialize detection model (EfficientDet)
      this.uiController.updateStatus('Loading detection model...', 'loading');
      this.model = new DetectionModel();
      await this.model.load();

      // Setup event listeners
      this.setupEventListeners();

      this.uiController.updateStatus('Ready for detection', 'success');
    } catch (error) {
      console.error('Initialization error:', error);
      this.uiController.updateStatus(`Error: ${error.message}`, 'error');
    }
  }

  setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('stopBtn').addEventListener('click', () => this.stop());
    document.getElementById('voiceBtn').addEventListener('click', () => this.toggleVoice());
    document.getElementById('torchBtn').addEventListener('click', () => this.toggleTorch());
    document.getElementById('thresholdSlider').addEventListener('change', (e) => {
      this.model.setConfidenceThreshold(parseFloat(e.target.value));
      document.querySelector('[style*="font-size: 12px"]').textContent = 
        Math.round(parseFloat(e.target.value) * 100) + '%';
    });
  }

  async start() {
    try {
      if (!this.videoElement.srcObject) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        this.videoElement.srcObject = stream;
      }

      this.isRunning = true;
      this.uiController.updateStatus('Detection running...', 'success');
      this.detectFrame();
    } catch (error) {
      console.error('Camera error:', error);
      this.uiController.updateStatus(`Camera error: ${error.message}`, 'error');
    }
  }

  stop() {
    this.isRunning = false;
    if (this.videoElement.srcObject) {
      this.videoElement.srcObject.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
    this.uiController.updateStatus('Detection stopped', 'info');
  }

  async detectFrame() {
    if (!this.isRunning) return;

    try {
      // Run detection on current frame
      const detections = await this.model.detect(this.videoElement);

      // Filter and process detections
      const filteredDetections = this.filterDetections(detections);

      // Render AR overlays
      this.arRenderer.clear();
      this.arRenderer.drawDetections(filteredDetections);

      // Update UI with top detection info
      if (filteredDetections.length > 0) {
        this.updateEquipmentInfo(filteredDetections[0]);
      }

      requestAnimationFrame(() => this.detectFrame());
    } catch (error) {
      console.error('Detection error:', error);
      this.uiController.updateStatus(`Detection error: ${error.message}`, 'error');
    }
  }

  filterDetections(detections) {
    return detections
      .filter(det => det.score >= this.model.confidenceThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  updateEquipmentInfo(detection) {
    const equipment = this.equipmentDB.getEquipment(detection.class);
    if (equipment) {
      this.uiController.displayEquipmentInfo(equipment, detection.score);
    }
  }

  toggleVoice() {
    // Voice feedback implementation
    console.log('Voice toggle');
  }

  toggleTorch() {
    // Torch implementation
    console.log('Torch toggle');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  const app = new LabARIdentifier();
  await app.initialize();
});
