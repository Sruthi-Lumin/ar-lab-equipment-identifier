# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Start Development Server (30 sec)
```bash
npm run dev
```

Browser will open at `http://localhost:8080`

### Step 3: Allow Camera Access
When prompted, click "Allow" to grant camera permissions

### Step 4: Wait for Model Load
TensorFlow.js model loads automatically (5-10 seconds)

### Step 5: Start Using
Click "Start" or say "start" to begin detection!

---

## Basic Usage

1. **Point camera** at lab equipment
2. **See detection** with AR overlay
3. **View equipment info** in right panel
4. **Click manual** for detailed instructions
5. **Click audio** for voice guidance

---

## Voice Commands (Hands-Free)

Click microphone button or just speak:

| Command | Action |
|---------|--------|
| "start" | Begin detection |
| "stop" | End detection |
| "manual" | Show full manual |
| "help" | Get instructions |
| "clear" | Clear detections |

---

## Troubleshooting

### Camera doesn't work
- Check browser permissions
- Use HTTPS or localhost
- Try different browser
- Restart the application

### Detection slow
- Reduce threshold slider
- Close other browser tabs
- Check internet connection
- Try lower browser zoom

### Voice not working
- Check microphone permissions
- Use Firefox or Chrome
- Speak clearly and slowly
- Check system microphone

---

## Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Application runs on http://localhost:3000
```

---

## Customization

### Add New Equipment

Edit `src/data/labEquipmentDB.js`:

```javascript
'your_equipment': {
  name: 'Equipment Name',
  aliases: ['alias1', 'alias2'],
  description: 'What it is...',
  safetyWarnings: ['Warning 1', 'Warning 2'],
  usage: ['Use 1', 'Use 2'],
  steps: ['Step 1...', 'Step 2...']
}
```

### Adjust Detection Speed

Edit `src/main.js` line 80:

```javascript
this.detectionInterval = 500; // Change to 300 for faster, 1000 for slower
```

### Change UI Colors

Edit `index.html` CSS section:

```css
/* Change primary color */
#667eea → your-color
#764ba2 → your-color
```

---

## System Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest 2 versions)
- **Camera**: Any USB/built-in camera
- **Microphone**: Optional (for voice commands)
- **Connection**: Internet required (for TensorFlow.js model)
- **Processor**: Any modern CPU
- **RAM**: 2GB minimum

---

## Tips for Best Results

✅ **Good Lighting**: Brightly lit environment
✅ **Clear View**: Equipment filling ~30% of frame
✅ **Steady Hand**: Keep camera still
✅ **Clean Lens**: Wipe camera before use
✅ **Close Range**: 30-60cm distance optimal

❌ **Avoid**: Dark, blurry, or angled views

---

## Need Help?

1. Check README.md for detailed documentation
2. Review API_DOCUMENTATION.md for technical details
3. Check browser console (F12) for error messages
4. Test with different browser or device
5. Ensure all permissions granted

---

**Happy Learning!** 🔬📱✨
