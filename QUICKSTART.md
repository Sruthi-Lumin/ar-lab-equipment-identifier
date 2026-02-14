# Quick Start Guide

## 5-Minute Setup

### Step 1: Open the Project

1. Download or clone the project
2. Navigate to the project directory
3. Open `index.html` in your web browser (or use a local server)

### Step 2: Grant Camera Permission

- When prompted, allow camera access
- This is required for the application to work

### Step 3: Start Detection

1. Click the **"Start"** button
2. Point your camera at lab equipment
3. Watch the detections appear in real-time!

### Step 4: Explore Equipment Info

- Detected equipment shows detailed information
- Read safety tips before using equipment
- Check specifications and usage steps

## Using the Controls

### Start/Stop Buttons
- **Start**: Begins camera stream and detection
- **Stop**: Stops detection and closes camera

### Confidence Threshold Slider
- Move slider to adjust detection sensitivity
- Higher = only very confident detections
- Lower = more detections (may include false positives)
- Recommended: 50-70%

### Language Selection
- Select your preferred language
- Affects equipment information display
- Choices: English, Spanish, French, German, Chinese, Japanese

### Future Features
- **🎤 Voice**: Audio feedback for detected equipment
- **💡 Torch**: Control device flashlight

## Tips for Best Results

### Lighting
- ✅ Use good, even lighting
- ✅ Avoid harsh shadows
- ❌ Don't use in very dim environments
- ❌ Avoid pointing at bright light sources

### Camera Positioning
- ✅ Point directly at equipment
- ✅ Keep equipment in center of frame
- ✅ Get within 1-2 feet of object
- ❌ Don't move camera too quickly
- ❌ Don't cover camera lens

### Equipment Visibility
- ✅ Make sure equipment is clearly visible
- ✅ Clean any dirt from camera lens
- ✅ Use front-facing orientation
- ❌ Don't partially hide equipment
- ❌ Don't use with damaged/dirty equipment

## Troubleshooting

### Issue: "Camera not working"
**Solution:**
1. Check browser permissions (Settings → Privacy)
2. Reload the page
3. Try a different browser
4. Restart your device

### Issue: "Model loading forever"
**Solution:**
1. Check internet connection
2. Wait 1-2 minutes (first load takes time)
3. Check browser console (F12) for errors
4. Try incognito/private mode

### Issue: "Not detecting equipment"
**Solution:**
1. Lower confidence threshold (try 40%)
2. Check lighting conditions
3. Get closer to equipment
4. Make sure equipment is in frame
5. Try different equipment

### Issue: "Page is slow/laggy"
**Solution:**
1. Close other browser tabs
2. Restart browser
3. Try a different browser
4. Use a more powerful device
5. Reduce video resolution

## What to Try Next

### Explore Each Equipment
- Point camera at different equipment
- Read all the safety information
- Learn the specifications
- Follow the usage steps

### Adjust Settings
- Experiment with threshold slider
- Try different languages
- Test with various equipment types
- Change lighting conditions

### Test Different Scenarios
- Try equipment from different angles
- Test with partial views
- See how it handles multiple items
- Test in different rooms

## Common Equipment Locations

**In Lab Setting:**
- **Microscope**: On dedicated work station
- **Bunsen Burner**: Under fume hood
- **Beakers/Flasks**: On shelves or benchtop
- **Graduated Cylinders**: Near measurement station
- **Petri Dishes**: In culture cabinet
- **Pipettes**: In dispenser rack
- **Thermometers**: In storage containers

## Safety Reminders

⚠️ **Always:**
- Follow lab safety rules
- Wear appropriate PPE
- Read equipment-specific safety tips
- Ask instructor when unsure
- Report damaged equipment

🚫 **Never:**
- Eat or drink in lab
- Taste chemicals
- Smell chemicals directly
- Touch hot equipment
- Point open flame at yourself

## Getting Help

1. **Read the equipment info panel** - Has detailed info
2. **Check the full documentation** - See ARCHITECTURE.md and README.md
3. **Try different angles** - Better detection from better positions
4. **Adjust threshold** - Lower threshold if nothing detected
5. **Contact support** - See README.md for contact info

## Performance Tips

### For Better Detection:
- Clear workspace clutter
- Use consistent lighting
- Position equipment clearly
- Get close to equipment
- Lower confidence threshold

### For Better Speed:
- Close background apps
- Use modern browser (Chrome recommended)
- Close other browser tabs
- Reduce other device load
- Use wired internet if available

## Keyboard Shortcuts (Future)

- `S` - Start/Stop
- `R` - Reset view
- `H` - Show/hide help
- `+/-` - Adjust threshold
- `Q` - Quit

## First Time Usage Timeline

| Time | Action |
|------|--------|
| 0-10s | Load page, grant permission |
| 10-30s | Model loads from internet |
| 30-60s | Start clicking, camera opens |
| 1-2min | Find equipment, see detection |
| 2-5min | Explore info panels |
| 5+min | Experiment with settings |

## Common Detectable Scenarios

✅ **Good:**
- Single item in frame
- Well-lit lab equipment
- Clean, visible items
- Close distance (1-2 feet)

✅ **Decent:**
- Multiple items
- Moderate lighting
- Item partially visible
- Normal distance (2-4 feet)

⚠️ **Challenging:**
- Very far distance (>4 feet)
- Poor lighting
- Hidden behind other items
- Very small in frame

## Data & Privacy

🔒 **Your Privacy:**
- All processing happens in your browser
- No data sent to servers
- No recording or storage
- You control everything

## Next Steps

1. **Try it out!** - Open index.html and start detecting
2. **Read full docs** - See README.md for complete guide
3. **Explore code** - Check individual files for details
4. **Experiment** - Try different equipment and settings
5. **Extend it** - Add new equipment or customize

## Questions?

See the main README.md for:
- Full API documentation
- Technical specifications
- Development guide
- Troubleshooting
- Future roadmap

---

**Ready to start? Open `index.html` in your browser!**

Happy detecting! 🔬
