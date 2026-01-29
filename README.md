# AR Lab Equipment Identifier

A comprehensive, AI-driven web-based augmented reality system designed to identify scientific lab equipment in real-time. The system overlays equipment names, descriptions, step-by-step manuals, and safety guidelines using device cameras with multimodal user interaction.

## 🌟 Features

### Core Capabilities
- **Real-time Object Detection**: TensorFlow.js-powered COCO-SSD model for identifying lab equipment
- **Augmented Reality Visualization**: Three.js 3D AR overlays with bounding boxes and labels
- **Voice Interaction**: Web Speech API for voice commands and audio guidance
- **Bayesian Recognition**: Advanced probability-based object recognition using Bayes' theorem
- **Interactive Manuals**: Detailed step-by-step instructions for 10+ lab equipment types
- **Accessibility**: Text-to-speech and speech-to-text capabilities in 6 languages
- **Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices

### Supported Equipment
- Beaker
- Conical Flask (Erlenmeyer Flask)
- Test Tube
- Optical Microscope
- Pipette (Dropper)
- Burette
- Bunsen Burner
- Iron Tripod
- Graduated Cylinder
- Wire Gauze

## 🛠️ Technology Stack

### Frontend
- **WebRTC**: Real-time camera access and video streaming
- **TensorFlow.js**: Machine learning for object detection
- **COCO-SSD**: Pre-trained model for object detection
- **Three.js**: 3D graphics and AR visualization
- **Web Speech API**: Voice recognition and synthesis
- **ES6 JavaScript**: Modern JavaScript with module support
- **HTML5 Canvas**: Image processing and overlay rendering

### Development Tools
- **Webpack 5**: Module bundler and development server
- **Babel 7**: JavaScript transpiler for cross-browser compatibility
- **Express.js**: Production web server

### Theory & Algorithms
- **Bayesian Inference**: Bayes' theorem implementation for probability-based recognition
- **Levenshtein Distance**: String similarity calculation for equipment matching
- **Temporal Reasoning**: Detection history analysis for improved accuracy

## 📦 Project Structure

```
demo/
├── src/
│   ├── modules/
│   │   ├── CameraModule.js         # WebRTC camera handling
│   │   ├── ObjectDetectionModule.js # TensorFlow.js detection
│   │   ├── AROverlayModule.js      # Three.js AR visualization
│   │   └── VoiceModule.js          # Web Speech API integration
│   ├── utils/
│   │   └── BayesianRecognizer.js   # Bayesian probability system
│   ├── data/
│   │   └── labEquipmentDB.js       # Equipment database with manuals
│   └── main.js                     # Main application controller
├── index.html                      # Application HTML
├── package.json                    # Dependencies and scripts
├── webpack.config.js               # Webpack configuration
├── .babelrc                        # Babel configuration
├── server.js                       # Express production server
└── README.md                       # Documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with WebRTC support

### Installation Steps

1. **Clone or download the project**
```bash
cd demo
```

2. **Install dependencies**
```bash
npm install
```

3. **Development Mode**
```bash
npm run dev
```
This starts the webpack dev server at `http://localhost:8080` with hot reload.

4. **Build for Production**
```bash
npm run build
```
This creates an optimized build in the `dist/` folder.

5. **Run Production Server**
```bash
npm start
```
This starts the Express server at `http://localhost:3000`.

## 📖 Usage Guide

### Getting Started

1. **Allow Camera Access**: When first launched, grant camera permissions
2. **Initialize Model**: Wait for TensorFlow.js model to load (~5-10 seconds)
3. **Start Detection**: Click "Start" or say "start" to begin

### Operating the System

#### Button Controls
- **Start/Stop**: Begin or end detection
- **Voice**: Toggle voice command listening
- **Torch**: Toggle device flashlight (if supported)

#### Voice Commands
- **"start"** - Begin detection and AR overlay
- **"stop"** - Stop detection
- **"manual"** - Show detailed manual for detected equipment
- **"help"** - Get usage instructions
- **"clear"** - Clear all detections

#### Settings
- **Confidence Threshold**: Adjust detection sensitivity (0-100%)
- **Language**: Change voice language and recognition language

### Understanding the Display

#### Video Panel (Left)
- Live camera feed
- Green bounding boxes around detected equipment
- Confidence percentages
- AR overlays and animations

#### Control Panel (Right)
- Status updates
- Detected equipment information
- Safety warnings
- Usage instructions
- Links to detailed manuals

### Workflow Example

1. Point camera at a beaker
2. System detects the beaker and displays AR overlay
3. Equipment info panel shows:
   - Equipment name and confidence score
   - Description
   - Safety warnings
   - Common uses
4. Click "Show Detailed Manual" for complete instructions
5. Click "Play Audio Guidance" for voice guidance
6. Follow step-by-step instructions

## 🧠 Technical Architecture

### Bayesian Recognition System

The system implements Bayes' theorem for improved recognition accuracy:

```
P(Equipment | Detection) = P(Detection | Equipment) × P(Equipment) / P(Detection)
```

**Components:**
- **Prior Probability** P(Equipment): Initial belief in equipment type
- **Likelihood** P(Detection | Equipment): How likely the detection given the equipment
- **Posterior Probability**: Updated belief after observation

**Features:**
- Temporal reasoning from detection history
- Semantic similarity calculation
- Multi-modal fusion of detections

### Real-time Detection Pipeline

1. **Capture Frame**: Extract current frame from camera
2. **Detect Objects**: TensorFlow.js processes the frame
3. **Filter Results**: Apply confidence threshold
4. **Bayesian Update**: Update probability beliefs
5. **AR Render**: Visualize with Three.js
6. **Audio Feedback**: Optional voice guidance

## 🔒 Safety & Privacy

### Security Features
- No data transmitted to external servers
- All processing occurs locally in the browser
- Camera access controlled by browser permissions
- No user data collection or storage

### Best Practices
- Always verify AI detection with visual inspection
- Use for educational purposes in controlled environments
- Follow all lab safety guidelines regardless of AR system
- Supervise students and inexperienced users

## 🌐 Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required APIs
- WebRTC (`getUserMedia`)
- WebGL (via Three.js)
- Web Audio API
- Web Speech API (voice features)

## 🔧 Configuration & Customization

### Adding New Equipment

Edit `src/data/labEquipmentDB.js`:

```javascript
'new_equipment': {
  name: 'Equipment Name',
  aliases: ['alias1', 'alias2'],
  description: 'Detailed description...',
  safetyWarnings: ['Warning 1', 'Warning 2'],
  usage: ['Use 1', 'Use 2'],
  steps: ['Step 1: ...', 'Step 2: ...']
}
```

### Adjusting Detection Parameters

In `src/main.js`:
```javascript
this.detectionThreshold = 0.5;    // Confidence threshold
this.detectionInterval = 500;     // Detection frequency (ms)
this.confidenceWeight = 0.7;      // Bayesian weight
```

### Custom ML Models

Replace COCO-SSD with custom models:
```javascript
// In ObjectDetectionModule.js
const model = await tf.loadGraphModel('custom_model_url');
```

## 📊 Performance Optimization

### Optimization Techniques
- Throttled detection (500ms intervals)
- Lazy model loading
- Memory-efficient canvas operations
- WebGL rendering optimization

### Performance Tips
- Adjust confidence threshold to reduce false positives
- Use lower resolution on slower devices
- Disable unnecessary AR animations
- Close other browser tabs for better performance

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser
- Check device camera functionality

### Detection Not Accurate
- Adjust confidence threshold
- Ensure adequate lighting
- Keep equipment in frame center
- Clear the camera lens

### Voice Not Working
- Check microphone permissions
- Ensure browser supports Web Speech API
- Test microphone in system settings
- Try a different browser

### Performance Issues
- Reduce detection frequency
- Lower canvas resolution
- Disable AR animations
- Use device with better GPU

## 📚 Learning Resources

### Included Documentation
- Equipment-specific safety guidelines
- Step-by-step operational instructions
- Audio guidance in multiple languages

### Bayesian Recognition Resources
- Detailed comments in `BayesianRecognizer.js`
- Prior/likelihood/posterior calculation examples
- Temporal reasoning implementation

## 🎓 Educational Use Cases

1. **Lab Induction**: Train new students on equipment use
2. **Safety Training**: Emphasize safety warnings and procedures
3. **Remote Learning**: Enable virtual lab assistance
4. **Accessibility**: Provide audio guidance for visual accessibility
5. **Research**: Study AI effectiveness in scientific education

## 🚀 Deployment

### Cloud Deployment
The system can be deployed to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Netlify
- Vercel
- GitHub Pages

### Docker Deployment
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Future Enhancements

Potential features for future versions:
- [ ] Advanced gesture recognition
- [ ] Multi-object tracking
- [ ] User progress analytics
- [ ] Offline mode with service workers
- [ ] Mobile app versions (React Native)
- [ ] Integration with LMS platforms
- [ ] Custom equipment training
- [ ] Attention tracking
- [ ] Real-time experiment simulation
- [ ] AR measurement tools

## 📄 License

MIT License - Feel free to use, modify, and distribute

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional equipment models
- Language support expansion
- Performance optimization
- UI/UX enhancement
- Testing coverage
- Documentation

## 📞 Support

For issues, questions, or suggestions:
1. Check troubleshooting section
2. Review browser console for errors
3. Verify browser compatibility
4. Test with different browser/device

## 🙏 Acknowledgments

- TensorFlow.js team for ML models
- Three.js community for graphics library
- Web standards organizations for APIs
- Educational institutions for use cases

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready

Built with ❤️ for science education
