# Development Guide

## Project Architecture

### Module System

The project uses ES6 modules with a modular architecture:

```
Application Controller (main.js)
├── CameraModule (WebRTC)
├── ObjectDetectionModule (TensorFlow.js)
├── AROverlayModule (Three.js)
├── VoiceModule (Web Speech API)
├── BayesianRecognizer (Probability Engine)
└── LabEquipmentDB (Equipment Database)
```

### Data Flow

```
Camera Input
    ↓
Frame Capture
    ↓
TensorFlow Detection
    ↓
Bayesian Update
    ↓
AR Rendering
    ↓
UI Display & Voice Output
```

---

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

- Hot module replacement enabled
- Source maps for debugging
- Webpack dev server at localhost:8080
- Auto-open browser

### Building for Production

```bash
npm run build
```

- Minified output
- Optimized assets
- Tree-shaking enabled
- Output in `dist/` folder

### Running Production Build

```bash
npm start
```

- Express server
- Static file serving
- Proper error handling
- Production mode

---

## Adding New Features

### Example: Add Equipment Type

1. **Update Database** (`src/data/labEquipmentDB.js`)

```javascript
'spectrophotometer': {
  name: 'Spectrophotometer',
  aliases: ['spectrometer'],
  description: 'Instrument for measuring light absorption',
  safetyWarnings: [
    'Do not look directly into light beam',
    'Handle cuvettes carefully'
  ],
  usage: [
    'Measuring light absorption',
    'Determining concentration'
  ],
  steps: [
    'Turn on device',
    'Select wavelength',
    'Insert blank cuvette',
    'Calibrate',
    'Insert sample',
    'Record reading'
  ]
}
```

2. **Update Bayesian Recognizer** (in `main.js`)

```javascript
setupBayesianRecognizer() {
  const equipment = Object.keys(LAB_EQUIPMENT_DB);
  this.bayesian.initializeUniformPriors(equipment);
  // New equipment automatically included
}
```

3. **Test**
- Run `npm run dev`
- Point camera at spectrophotometer
- Verify detection and manual display

### Example: Add Voice Command

In `src/main.js`:

```javascript
setupVoiceCommands() {
  this.voice.registerCommand('manual', () => this.showManual());
  this.voice.registerCommand('brightness', () => this.adjustBrightness());
}

adjustBrightness() {
  // Implementation
}
```

### Example: Custom Detection Model

In `src/modules/ObjectDetectionModule.js`:

```javascript
async loadModel() {
  // Replace COCO-SSD with custom model
  const modelUrl = 'https://your-server.com/model.json';
  this.model = await tf.loadGraphModel(modelUrl);
}
```

---

## Debugging

### Browser Console

```javascript
// Access app instance
window.app

// Check current detections
window.app.currentDetections

// Bayesian statistics
window.app.bayesian.getStatistics()

// Check camera status
window.app.camera.getDimensions()
```

### Debug Detection

```javascript
// In main.js, add logging
async updateDetections(predictions) {
  console.log('Detections:', predictions);
  console.log('Beliefs:', beliefs);
}
```

### Network Debugging

Browser DevTools → Network tab:
- Check model download
- Monitor WebRTC data
- Check API calls

### Performance Profiling

DevTools → Performance tab:
- Record detection cycle
- Analyze frame time
- Identify bottlenecks

---

## Testing

### Manual Testing

1. **Basic Functionality**
   - [ ] Camera initialization
   - [ ] Model loading
   - [ ] Detection working
   - [ ] AR overlay rendering

2. **Voice Features**
   - [ ] Start command
   - [ ] Stop command
   - [ ] Manual retrieval
   - [ ] Audio guidance

3. **Different Equipment**
   - [ ] Beaker detection
   - [ ] Microscope detection
   - [ ] Multiple objects
   - [ ] Confidence threshold

4. **Cross-Browser**
   - [ ] Chrome latest
   - [ ] Firefox latest
   - [ ] Safari latest
   - [ ] Edge latest

5. **Device Testing**
   - [ ] Desktop camera
   - [ ] Laptop webcam
   - [ ] Mobile camera
   - [ ] Tablet camera

### Automated Testing (Future)

```bash
npm install --save-dev jest @testing-library/dom
```

Example test:

```javascript
describe('CameraModule', () => {
  test('initializes with video element', async () => {
    const video = document.createElement('video');
    const camera = new CameraModule();
    const stream = await camera.initialize(video);
    expect(stream).toBeDefined();
  });
});
```

---

## Performance Tips

### JavaScript Optimization

1. **Lazy Load Models**
```javascript
// Load model on demand
async loadDetectionModel() {
  if (!this.detector.model) {
    await this.detector.loadModel();
  }
}
```

2. **Throttle Detection**
```javascript
this.detectionInterval = 500; // Run every 500ms, not every frame
```

3. **Memory Management**
```javascript
// Dispose unused resources
dispose() {
  this.detector.dispose();
  this.arOverlay.dispose();
}
```

### Rendering Optimization

1. **Three.js Best Practices**
```javascript
// Reuse geometries
const geometry = new THREE.BoxGeometry(...);

// Use efficient materials
const material = new THREE.MeshBasicMaterial({...});

// Limit overdraw
renderer.setPixelRatio(window.devicePixelRatio);
```

2. **Canvas Optimization**
```javascript
// Reuse canvas
canvas.width = width;
canvas.height = height;
ctx.drawImage(...);
```

### Network Optimization

1. **Model Caching**
```javascript
// Leverage browser cache for model
// Check Network headers in DevTools
```

2. **Compression**
```javascript
// Enable gzip in server
app.use(compression());
```

---

## Code Style

### JavaScript Standards

- Use ES6+ features
- Const/let, no var
- Arrow functions for callbacks
- Template literals for strings
- Destructuring where applicable

### JSDoc Comments

```javascript
/**
 * Detect objects in image
 * @param {Canvas|HTMLVideoElement} input - Input image
 * @returns {Promise<Array>} Predictions
 */
async detect(input) {
  // Implementation
}
```

### Naming Conventions

- Classes: PascalCase (CameraModule)
- Functions: camelCase (performDetection)
- Constants: UPPER_CASE (MAX_HISTORY_SIZE)
- Private: prefix with _ (_internalMethod)

---

## Common Tasks

### Add New CSS Styling

Edit `index.html` style section or extract to `style.css`

### Add New UI Element

1. Add HTML in `index.html`
2. Reference in `main.js` setupUI()
3. Add event listener if needed
4. Add CSS styling

### Integrate New API

1. Create module in `src/modules/`
2. Initialize in `main.js`
3. Add error handling
4. Test thoroughly

### Deploy to Production

```bash
npm run build     # Create optimized build
npm start         # Start production server
# Or deploy dist/ folder to CDN/hosting
```

---

## Troubleshooting Development

### Module Not Found

```bash
# Check import paths
# Ensure files exist
# Check file extensions
# npm install missing dependencies
```

### Webpack Errors

```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall
npm install

# Check webpack config
npm run dev
```

### TensorFlow Issues

```bash
# Model download failed - check internet
# Memory limit - increase in Node
node --max-old-space-size=4096 server.js
```

### WebRTC Not Working

- Check browser console
- Verify HTTPS or localhost
- Check camera permissions
- Try different browser

---

## Resources

### Documentation
- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [Three.js Docs](https://threejs.org/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [WebRTC Docs](https://webrtc.org/)

### Tutorials
- TensorFlow.js with Object Detection
- Three.js Getting Started
- Web Audio API Guide
- Progressive Web Apps

### Tools
- Chrome DevTools
- Webpack Dashboard
- VS Code Extensions

---

**Development Version**: 1.0.0
