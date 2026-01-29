/**
 * Main Application Controller
 * Integrates all modules for AR lab equipment identification
 */
import CameraModule from './modules/CameraModule.js';
import ObjectDetectionModule from './modules/ObjectDetectionModule.js';
import AROverlayModule from './modules/AROverlayModule.js';
import VoiceModule from './modules/VoiceModule.js';
import BayesianRecognizer from './utils/BayesianRecognizer.js';
import LAB_EQUIPMENT_DB from './data/labEquipmentDB.js';

class LabEquipmentIdentifierApp {
  constructor() {
    this.camera = null;
    this.detector = null;
    this.arOverlay = null;
    this.voice = null;
    this.bayesian = new BayesianRecognizer();
    
    this.isRunning = false;
    this.detectionInterval = 500; // ms
    this.detectionIntervalId = null;
    
    this.currentDetections = new Map();
    this.detectionThreshold = 0.5;
    this.confidenceWeight = 0.7;
    
    this.ui = null;
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      console.log('Initializing Lab Equipment Identifier...');

      // Setup UI elements
      this.setupUI();

      // Initialize camera
      this.camera = new CameraModule();
      await this.camera.initialize(this.getElement('#videoInput'));
      console.log('✓ Camera initialized');

      // Initialize object detection
      this.detector = new ObjectDetectionModule();
      await this.detector.loadModel();
      console.log('✓ Object detection model loaded');

      // Initialize AR overlay
      this.arOverlay = new AROverlayModule(this.getElement('#arCanvas'));
      console.log('✓ AR overlay initialized');

      // Initialize voice
      this.voice = new VoiceModule();
      this.setupVoiceCommands();
      console.log('✓ Voice module initialized');

      // Setup Bayesian recognizer
      this.setupBayesianRecognizer();
      console.log('✓ Bayesian recognizer initialized');

      // Setup event listeners
      this.setupEventListeners();

      console.log('✅ Application fully initialized');
      this.updateStatus('Ready to identify equipment');

    } catch (error) {
      console.error('Initialization failed:', error);
      this.updateStatus('Error: ' + error.message, 'error');
    }
  }

  /**
   * Initialize system components
   */
  async initializeSystem() {
    try {
      const statusEl = document.getElementById('status');
      
      statusEl.textContent = 'Loading AI model... (may take 30-60 seconds)';
      await this.detector.loadModel();
      
      statusEl.textContent = 'Initializing camera...';
      await this.camera.initialize();
      
      statusEl.textContent = 'Ready!';
      document.getElementById('startBtn').disabled = false;
    } catch (error) {
      document.getElementById('status').textContent = `Error: ${error.message}. Reload page.`;
      console.error(error);
    }
  }

  /**
   * Setup UI elements
   */
  setupUI() {
    this.ui = {
      videoInput: this.getElement('#videoInput'),
      arCanvas: this.getElement('#arCanvas'),
      statusBar: this.getElement('#statusBar'),
      equipmentInfo: this.getElement('#equipmentInfo'),
      startBtn: this.getElement('#startBtn'),
      stopBtn: this.getElement('#stopBtn'),
      voiceBtn: this.getElement('#voiceBtn'),
      manualBtn: this.getElement('#manualBtn'),
      settingsPanel: this.getElement('#settingsPanel'),
      thresholdSlider: this.getElement('#thresholdSlider'),
      languageSelect: this.getElement('#languageSelect'),
      torchBtn: this.getElement('#torchBtn')
    };
  }

  /**
   * Setup voice commands
   */
  setupVoiceCommands() {
    this.voice.registerCommand('start', () => this.start());
    this.voice.registerCommand('stop', () => this.stop());
    this.voice.registerCommand('manual', () => this.showManual());
    this.voice.registerCommand('help', () => this.speakHelp());
    this.voice.registerCommand('clear', () => this.clearDetections());
  }

  /**
   * Setup Bayesian recognizer with lab equipment priors
   */
  setupBayesianRecognizer() {
    const equipment = Object.keys(LAB_EQUIPMENT_DB);
    this.bayesian.initializeUniformPriors(equipment);

    // Set likelihoods based on common lab equipment
    Object.entries(LAB_EQUIPMENT_DB).forEach(([key, value]) => {
      this.bayesian.setLikelihood(key, 0.8);
    });
  }

  /**
   * Start detection and AR overlay
   */
  async start() {
    if (this.isRunning) return;

    try {
      this.isRunning = true;
      this.updateStatus('Starting detection...');
      
      this.arOverlay.startAnimation();
      await this.voice.speak('AR system started. Initializing detection.');

      this.detectionIntervalId = setInterval(() => this.performDetection(), this.detectionInterval);
      this.updateStatus('Running - Point camera at lab equipment');

    } catch (error) {
      console.error('Start failed:', error);
      this.updateStatus('Error: ' + error.message, 'error');
      this.isRunning = false;
    }
  }

  /**
   * Stop detection
   */
  async stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    
    if (this.detectionIntervalId) {
      clearInterval(this.detectionIntervalId);
      this.detectionIntervalId = null;
    }

    this.arOverlay.stopAnimation();
    this.clearDetections();
    await this.voice.speak('AR system stopped');
    this.updateStatus('Stopped');
  }

  /**
   * Perform object detection on current camera frame
   */
  async performDetection() {
    try {
      const frame = this.camera.captureFrame();
      const predictions = await this.detector.detect(frame);

      // Filter by threshold
      const filteredPredictions = predictions.filter(
        p => p.score >= this.detectionThreshold
      );

      if (filteredPredictions.length === 0) {
        if (this.currentDetections.size > 0) {
          this.clearDetections();
        }
        return;
      }

      // Update detections with Bayesian reasoning
      await this.updateDetections(filteredPredictions);

    } catch (error) {
      console.error('Detection error:', error);
    }
  }

  /**
   * Update detections with Bayesian probability
   */
  async updateDetections(predictions) {
    const newDetections = new Map();
    const equipmentList = Object.keys(LAB_EQUIPMENT_DB);

    predictions.forEach((pred, index) => {
      const detectionId = `det_${index}_${pred.class}`;

      // Apply Bayesian reasoning
      const beliefs = this.bayesian.updateBelief(
        pred.class,
        pred.score,
        equipmentList
      );

      // Get most likely equipment
      const [mostLikely, probability] = Object.entries(beliefs)[0] || ['unknown', 0];

      // Add to history
      this.bayesian.addToHistory(mostLikely, pred.score * probability);

      newDetections.set(detectionId, {
        bbox: pred.bbox,
        detectedClass: pred.class,
        classConfidence: pred.score,
        equipment: mostLikely,
        equipmentConfidence: probability,
        beliefs
      });
    });

    // Update AR visualization
    this.updateAROverlay(newDetections);

    // Display equipment information
    if (newDetections.size > 0) {
      this.displayEquipmentInfo(Array.from(newDetections.values())[0]);
    }

    this.currentDetections = newDetections;
  }

  /**
   * Update AR overlay with detections
   */
  updateAROverlay(detections) {
    // Remove detections that are no longer present
    for (const [id, overlay] of this.arOverlay.overlays.entries()) {
      if (!detections.has(id)) {
        this.arOverlay.removeDetection(id);
      }
    }

    // Add or update detections
    detections.forEach((detection, id) => {
      if (!this.arOverlay.overlays.has(id)) {
        this.arOverlay.addDetection(id, {
          bbox: detection.bbox,
          class: detection.equipment,
          score: detection.equipmentConfidence
        });
      }
    });
  }

  /**
   * Display equipment information in UI
   */
  displayEquipmentInfo(detection) {
    const equipmentKey = Object.keys(LAB_EQUIPMENT_DB).find(
      key => key === detection.equipment
    );

    if (!equipmentKey) return;

    const equipment = LAB_EQUIPMENT_DB[equipmentKey];

    let html = `
      <h3>${equipment.name}</h3>
      <p><strong>Confidence:</strong> ${(detection.equipmentConfidence * 100).toFixed(1)}%</p>
      <p><strong>Description:</strong> ${equipment.description}</p>
      
      <h4>Safety Warnings:</h4>
      <ul>
        ${equipment.safetyWarnings.map(w => `<li>${w}</li>`).join('')}
      </ul>
      
      <h4>Common Uses:</h4>
      <ul>
        ${equipment.usage.map(u => `<li>${u}</li>`).join('')}
      </ul>
      
      <button onclick="app.showDetailedManual('${equipmentKey}')">
        Show Detailed Manual
      </button>
      <button onclick="app.playAudioGuidance('${equipmentKey}')">
        Play Audio Guidance
      </button>
    `;

    this.ui.equipmentInfo.innerHTML = html;
  }

  /**
   * Show detailed manual for equipment
   */
  showDetailedManual(equipmentKey) {
    const equipment = LAB_EQUIPMENT_DB[equipmentKey];
    if (!equipment) return;

    let html = `
      <div class="modal-content">
        <h2>${equipment.name}</h2>
        <p>${equipment.description}</p>
        
        <h3>Step-by-Step Instructions:</h3>
        <ol>
          ${equipment.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        
        <h3>Safety Warnings:</h3>
        <ul class="warnings">
          ${equipment.safetyWarnings.map(w => `<li class="warning">${w}</li>`).join('')}
        </ul>
        
        <h3>Common Uses:</h3>
        <ul>
          ${equipment.usage.map(u => `<li>${u}</li>`).join('')}
        </ul>
        
        <button onclick="this.parentElement.parentElement.style.display='none'">
          Close
        </button>
      </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-overlay">${html}</div>`;
    document.body.appendChild(modal);

    modal.style.display = 'block';
  }

  /**
   * Play audio guidance for equipment
   */
  async playAudioGuidance(equipmentKey) {
    const equipment = LAB_EQUIPMENT_DB[equipmentKey];
    if (!equipment) return;

    await this.voice.speak(`${equipment.name}. ${equipment.description}`);
    await this.voice.speak('Safety warnings:');
    await this.voice.speakInstructions(equipment.safetyWarnings);
    await this.voice.speak('Step by step instructions:');
    await this.voice.speakInstructions(equipment.steps);
  }

  /**
   * Show manual toggle
   */
  showManual() {
    if (this.currentDetections.size > 0) {
      const detection = Array.from(this.currentDetections.values())[0];
      this.showDetailedManual(detection.equipment);
    }
  }

  /**
   * Speak help
   */
  async speakHelp() {
    const helpText = `
      Welcome to the Augmented Reality Lab Equipment Identifier.
      Say 'start' to begin detection.
      Say 'stop' to stop detection.
      Say 'manual' to see detailed instructions.
      Say 'clear' to clear all detections.
    `;
    await this.voice.speak(helpText);
  }

  /**
   * Clear all detections
   */
  clearDetections() {
    this.arOverlay.clearOverlays();
    this.currentDetections.clear();
    this.ui.equipmentInfo.innerHTML = '<p>No equipment detected</p>';
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (this.ui.startBtn) {
      this.ui.startBtn.addEventListener('click', () => this.start());
    }

    if (this.ui.stopBtn) {
      this.ui.stopBtn.addEventListener('click', () => this.stop());
    }

    if (this.ui.voiceBtn) {
      this.ui.voiceBtn.addEventListener('click', () => {
        if (this.voice.isListening) {
          this.voice.stopListening();
        } else {
          this.voice.startListening();
        }
      });
    }

    if (this.ui.thresholdSlider) {
      this.ui.thresholdSlider.addEventListener('change', (e) => {
        this.detectionThreshold = parseFloat(e.target.value);
        this.updateStatus(`Detection threshold: ${(this.detectionThreshold * 100).toFixed(0)}%`);
      });
    }

    if (this.ui.languageSelect) {
      this.ui.languageSelect.addEventListener('change', (e) => {
        this.voice.setLanguage(e.target.value);
      });
    }

    if (this.ui.torchBtn) {
      this.ui.torchBtn.addEventListener('click', async () => {
        const success = await this.camera.toggleTorch();
        this.updateStatus(success ? 'Torch toggled' : 'Torch not supported');
      });
    }
  }

  /**
   * Update status bar
   */
  updateStatus(message, type = 'info') {
    if (this.ui.statusBar) {
      this.ui.statusBar.textContent = message;
      this.ui.statusBar.className = `status-${type}`;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  /**
   * Get HTML element safely
   */
  getElement(selector) {
    return document.querySelector(selector);
  }

  /**
   * Cleanup and dispose
   */
  async dispose() {
    await this.stop();
    
    if (this.camera) this.camera.stop();
    if (this.detector) this.detector.dispose();
    if (this.arOverlay) this.arOverlay.dispose();
    if (this.voice) this.voice.dispose();
  }
}

// Create global app instance
window.app = new LabEquipmentIdentifierApp();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app.initialize();
});

export default LabEquipmentIdentifierApp;
