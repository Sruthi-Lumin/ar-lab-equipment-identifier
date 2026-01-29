# API Documentation

## Application Programming Interface

### CameraModule

#### Methods

##### `initialize(videoElement)`
Initialize camera and attach to video element.

**Parameters:**
- `videoElement` (HTMLVideoElement): Target video element

**Returns:** `Promise<MediaStream>`

**Example:**
```javascript
const camera = new CameraModule();
const stream = await camera.initialize(document.getElementById('videoInput'));
```

##### `captureFrame()`
Capture current frame from video stream.

**Returns:** `Canvas`

##### `getDimensions()`
Get video dimensions.

**Returns:** `Object` - `{width, height}`

##### `stop()`
Stop camera stream and cleanup.

##### `switchCamera()`
Switch between front and back camera.

**Returns:** `Promise<MediaStream>`

##### `toggleTorch()`
Toggle device flashlight (if supported).

**Returns:** `Promise<boolean>`

---

### ObjectDetectionModule

#### Methods

##### `loadModel()`
Load TensorFlow.js COCO-SSD model.

**Returns:** `Promise<void>`

##### `detect(input)`
Detect objects in image or video.

**Parameters:**
- `input` (Canvas|HTMLVideoElement): Input image

**Returns:** `Promise<Array>`

**Response Format:**
```javascript
[
  {
    bbox: [x, y, width, height],
    class: 'cup',
    score: 0.95
  }
]
```

##### `detectLabEquipment(input)`
Detect only lab equipment.

**Parameters:**
- `input` (Canvas|HTMLVideoElement): Input image

**Returns:** `Promise<Array>`

##### `setThreshold(threshold)`
Set confidence threshold.

**Parameters:**
- `threshold` (number): 0-1 confidence threshold

##### `dispose()`
Dispose model and free memory.

---

### AROverlayModule

#### Methods

##### `addDetection(id, detection)`
Add detection overlay to AR scene.

**Parameters:**
- `id` (string): Unique identifier
- `detection` (Object): Detection object

**Detection Format:**
```javascript
{
  bbox: [x, y, width, height],
  class: 'beaker',
  score: 0.95
}
```

##### `removeDetection(id)`
Remove detection overlay.

**Parameters:**
- `id` (string): Detection identifier

##### `clearOverlays()`
Clear all overlays from scene.

##### `addLabel(id, text, position)`
Add text label to AR scene.

**Parameters:**
- `id` (string): Label identifier
- `text` (string): Label text
- `position` (Object): `{x, y}` position

##### `removeLabel(id)`
Remove label from scene.

##### `startAnimation()`
Start animation loop.

##### `stopAnimation()`
Stop animation loop.

##### `render()`
Manually render the scene.

##### `dispose()`
Cleanup and free resources.

---

### VoiceModule

#### Methods

##### `startListening()`
Start listening for voice commands.

##### `stopListening()`
Stop listening for voice commands.

##### `registerCommand(command, callback)`
Register voice command handler.

**Parameters:**
- `command` (string): Command keyword
- `callback` (Function): Handler function

**Example:**
```javascript
voice.registerCommand('start', () => {
  app.start();
});
```

##### `speak(text, options)`
Text-to-speech.

**Parameters:**
- `text` (string): Text to speak
- `options` (Object): Optional settings
  - `rate` (number): Speech rate (0.1-10)
  - `pitch` (number): Pitch (0-2)
  - `volume` (number): Volume (0-1)
  - `lang` (string): Language code

**Returns:** `Promise<void>`

##### `speakEquipment(name, description)`
Speak equipment info.

**Parameters:**
- `name` (string): Equipment name
- `description` (string): Equipment description

**Returns:** `Promise<void>`

##### `speakInstructions(steps)`
Speak step-by-step instructions.

**Parameters:**
- `steps` (Array<string>): Array of instruction steps

**Returns:** `Promise<void>`

##### `getAvailableLanguages()`
Get available languages.

**Returns:** `Array<string>`

##### `setLanguage(lang)`
Set speech language.

**Parameters:**
- `lang` (string): Language code (e.g., 'en-US')

##### `getAvailableVoices()`
Get available system voices.

**Returns:** `Array`

##### `setVoice(voiceIndex)`
Select voice.

**Parameters:**
- `voiceIndex` (number): Voice index

##### `dispose()`
Cleanup voice module.

---

### BayesianRecognizer

#### Methods

##### `setPrior(equipment, probability)`
Set prior probability for equipment type.

**Parameters:**
- `equipment` (string): Equipment name
- `probability` (number): 0-1 probability

##### `initializeUniformPriors(equipmentList)`
Initialize equal priors for all equipment.

**Parameters:**
- `equipmentList` (Array<string>): Equipment names

##### `setLikelihood(equipment, likelihood)`
Set likelihood probability.

**Parameters:**
- `equipment` (string): Equipment name
- `likelihood` (number): 0-1 likelihood

##### `updateBelief(detectedClass, confidence, possibleEquipment)`
Update beliefs based on observation.

**Parameters:**
- `detectedClass` (string): Detected class
- `confidence` (number): Detection confidence
- `possibleEquipment` (Array<string>): Possible equipment

**Returns:** `Object` - Equipment probabilities

**Example:**
```javascript
const beliefs = bayesian.updateBelief(
  'cup',
  0.9,
  ['beaker', 'flask', 'cup']
);
// Result: {beaker: 0.6, flask: 0.3, cup: 0.1}
```

##### `addToHistory(equipment, confidence)`
Track detection in history.

**Parameters:**
- `equipment` (string): Equipment name
- `confidence` (number): Confidence score

##### `getMostLikelyFromHistory()`
Get most likely equipment from history.

**Returns:** `Object` - `{equipment, score}`

##### `getStatistics()`
Get detection statistics.

**Returns:** `Object`

##### `clearHistory()`
Clear detection history.

##### `reset()`
Reset all probabilities.

---

### LabEquipmentIdentifierApp

#### Properties

```javascript
app.camera           // CameraModule instance
app.detector         // ObjectDetectionModule instance
app.arOverlay        // AROverlayModule instance
app.voice            // VoiceModule instance
app.bayesian         // BayesianRecognizer instance
app.isRunning        // boolean
app.currentDetections // Map<string, Detection>
```

#### Methods

##### `initialize()`
Initialize the application.

**Returns:** `Promise<void>`

##### `start()`
Start detection and AR overlay.

**Returns:** `Promise<void>`

##### `stop()`
Stop detection.

**Returns:** `Promise<void>`

##### `showDetailedManual(equipmentKey)`
Display equipment manual.

**Parameters:**
- `equipmentKey` (string): Equipment key from database

##### `playAudioGuidance(equipmentKey)`
Play audio guidance for equipment.

**Parameters:**
- `equipmentKey` (string): Equipment key

**Returns:** `Promise<void>`

##### `showManual()`
Show manual for currently detected equipment.

##### `updateStatus(message, type)`
Update status bar.

**Parameters:**
- `message` (string): Status message
- `type` (string): 'info' | 'success' | 'error'

##### `clearDetections()`
Clear all detections.

##### `dispose()`
Cleanup and dispose all resources.

**Returns:** `Promise<void>`

---

## Equipment Database Structure

```javascript
{
  'beaker': {
    name: 'Beaker',
    aliases: ['cup', 'container'],
    description: '...',
    safetyWarnings: ['...'],
    usage: ['...'],
    steps: ['...']
  }
}
```

### Equipment Properties

- `name` (string): Display name
- `aliases` (Array<string>): Alternative names
- `description` (string): Equipment description
- `safetyWarnings` (Array<string>): Safety considerations
- `usage` (Array<string>): Common uses
- `steps` (Array<string>): Operational steps

---

## Events

### Voice Events

The VoiceModule triggers events through callbacks registered with `registerCommand()`.

### Detection Events

Detections update the `currentDetections` Map, triggering AR overlay updates.

---

## Error Handling

All modules include error handling and logging:

```javascript
try {
  await app.initialize();
} catch (error) {
  console.error('Error:', error);
  app.updateStatus(error.message, 'error');
}
```

---

## Performance Considerations

### Memory Usage
- Model: ~15-20 MB
- Detection history: Configurable (default 50 entries)
- AR overlays: Scales with detected objects

### CPU/GPU Usage
- Detection: ~100-300ms per frame
- AR rendering: Depends on overlay complexity
- Voice: Minimal impact when not active

### Optimization Tips
1. Increase `detectionInterval` for slower devices
2. Adjust `detectionThreshold` to reduce false positives
3. Disable AR animations on low-end devices
4. Use lower canvas resolution on mobile

---

**API Version**: 1.0.0
