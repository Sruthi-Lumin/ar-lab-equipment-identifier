/**
 * AROverlayModule - Three.js based AR visualization
 */
import * as THREE from 'three';

class AROverlayModule {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.overlays = new Map();
    this.labels = new Map();
    this.animationFrameId = null;

    this.initializeRenderer();
    this.setupLighting();
    this.setupEventListeners();
  }

  /**
   * Initialize WebGL renderer
   */
  initializeRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  /**
   * Setup basic lighting
   */
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
  }

  /**
   * Setup window resize handler
   */
  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Create bounding box overlay
   * @param {Object} bbox - {x, y, width, height}
   * @param {string} label 
   * @param {number} confidence 
   * @returns {THREE.Group}
   */
  createBoundingBox(bbox, label, confidence) {
    const group = new THREE.Group();
    
    // Create box geometry
    const geometry = new THREE.BoxGeometry(bbox.width, bbox.height, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const box = new THREE.Mesh(geometry, material);
    
    // Position box
    box.position.x = bbox.x + bbox.width / 2;
    box.position.y = bbox.y + bbox.height / 2;
    
    group.add(box);

    // Create label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${label} (${(confidence * 100).toFixed(1)}%)`, 10, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const labelGeometry = new THREE.PlaneGeometry(bbox.width, 20);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    
    labelMesh.position.y = bbox.y + bbox.height / 2 + 20;
    labelMesh.position.z = 5;
    
    group.add(labelMesh);
    return group;
  }

  /**
   * Add detection overlay
   * @param {string} id - Unique identifier
   * @param {Object} detection - {bbox, class, score}
   */
  addDetection(id, detection) {
    const bbox = {
      x: detection.bbox[0] - window.innerWidth / 2,
      y: detection.bbox[1] - window.innerHeight / 2,
      width: detection.bbox[2],
      height: detection.bbox[3]
    };

    const box = this.createBoundingBox(bbox, detection.class, detection.score);
    this.scene.add(box);
    this.overlays.set(id, box);
  }

  /**
   * Remove detection overlay
   * @param {string} id 
   */
  removeDetection(id) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      this.scene.remove(overlay);
      this.overlays.delete(id);
    }
  }

  /**
   * Clear all overlays
   */
  clearOverlays() {
    this.overlays.forEach((overlay) => {
      this.scene.remove(overlay);
    });
    this.overlays.clear();
  }

  /**
   * Add text label
   * @param {string} id 
   * @param {string} text 
   * @param {Object} position - {x, y}
   */
  addLabel(id, text, position) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(text, 10, 80);

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(200, 50);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const label = new THREE.Mesh(geometry, material);
    
    label.position.x = position.x;
    label.position.y = position.y;
    label.position.z = 10;

    this.scene.add(label);
    this.labels.set(id, label);
  }

  /**
   * Remove label
   * @param {string} id 
   */
  removeLabel(id) {
    const label = this.labels.get(id);
    if (label) {
      this.scene.remove(label);
      this.labels.delete(id);
    }
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      
      // Rotate all overlays
      this.overlays.forEach((overlay) => {
        overlay.rotation.x += 0.005;
        overlay.rotation.y += 0.005;
      });

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  /**
   * Stop animation loop
   */
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Render scene
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.stopAnimation();
    this.clearOverlays();
    this.labels.forEach(label => this.scene.remove(label));
    this.labels.clear();
    this.renderer.dispose();
  }
}

export default AROverlayModule;
