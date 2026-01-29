# Installation & Environment Setup

## System Requirements

### Minimum Requirements
- **OS**: Windows 7+, macOS 10.12+, or Linux (any modern distro)
- **RAM**: 2 GB
- **Storage**: 500 MB free space
- **Internet**: Required for initial setup and model download

### Recommended Specifications
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 4 GB or more
- **Storage**: 1 GB free space
- **CPU**: Intel/AMD processor with AVX support
- **GPU**: Optional (speeds up TensorFlow.js)

---

## Prerequisites

### 1. Node.js Installation

#### Windows
1. Download from [nodejs.org](https://nodejs.org/)
2. Choose LTS version (16.x or higher)
3. Run installer and follow prompts
4. Check installation:
```cmd
node --version
npm --version
```

#### macOS
Using Homebrew:
```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

#### Linux (Fedora)
```bash
sudo dnf install nodejs npm
```

### 2. Git Installation (Optional but Recommended)

#### Windows
Download from [git-scm.com](https://git-scm.com/)

#### macOS
```bash
brew install git
```

#### Linux
```bash
sudo apt install git    # Ubuntu/Debian
sudo dnf install git    # Fedora
```

---

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd c:\Users\[YourUsername]\OneDrive\Desktop\project\demo
```

Or on macOS/Linux:
```bash
cd ~/Desktop/project/demo
```

### Step 2: Install Dependencies

```bash
npm install
```

This will:
- Download all required packages from npm registry
- Install into `node_modules/` folder
- May take 2-5 minutes depending on connection

**Expected output:**
```
added 400+ packages in 2m
```

### Step 3: Verify Installation

```bash
npm --version
node --version
```

Should show version numbers like:
- npm 7.0.0+
- node 16.0.0+

---

## Running the Application

### Development Mode

```bash
npm run dev
```

This will:
1. Start webpack dev server
2. Auto-compile source files
3. Enable hot module replacement
4. Open browser at `http://localhost:8080`
5. Watch for changes automatically

**First run**: Takes 20-30 seconds for initial build + model download

### Production Build

```bash
npm run build
```

This will:
1. Optimize all code
2. Minify assets
3. Create production bundle
4. Output to `dist/` folder
5. Takes 10-15 seconds

### Run Production Server

```bash
npm start
```

This will:
1. Start Express server
2. Serve from `dist/` folder
3. Run on `http://localhost:3000`
4. Require prior `npm run build`

---

## Browser Setup

### Required Permissions

When first accessing the application, grant:

1. **Camera Access**
   - Click "Allow" when prompted
   - Different for each browser

2. **Microphone** (Optional, for voice commands)
   - Click "Allow" when prompted
   - Can be enabled/disabled anytime

### Browser Configuration

#### Google Chrome
1. Open `chrome://settings/content`
2. Find "Camera" and "Microphone"
3. Add `localhost:8080` to "Allow"

#### Firefox
1. Open `about:preferences#privacy`
2. Find "Camera" and "Microphone" sections
3. Allow for `localhost`

#### Safari (macOS)
1. Allow in system preferences when prompted
2. Check Security & Privacy settings

#### Edge
1. Open `edge://settings/privacy`
2. Configure Camera and Microphone permissions

---

## First-Time Setup Checklist

- [ ] Node.js installed (16.x or higher)
- [ ] Dependencies installed (`npm install`)
- [ ] Browser has camera permission
- [ ] Can access `localhost:8080`
- [ ] Model loads without errors (5-10 sec)
- [ ] Can start detection

---

## Troubleshooting Installation

### "npm: command not found"
- Node.js not properly installed
- Restart terminal/command prompt
- Verify `npm --version` works

### "Module not found" errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 8080 already in use
```bash
# Change port in webpack.config.js
port: 8081  # or another port
```

### Model download fails
- Check internet connection
- Try again (sometimes temporary)
- May take 5-10 minutes first time

### Camera not working
- Check browser permissions
- Try different browser
- Ensure camera isn't used by other app
- Restart browser

---

## Environment Variables

### Development (.env file)

Create `.env` file in project root:

```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production

Create `.env` for production server:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

---

## Using Different Ports

### Change Development Port

Edit `webpack.config.js`:
```javascript
devServer: {
  port: 8081,  // Change this
}
```

### Change Production Port

Environment variable:
```bash
PORT=4000 npm start
```

Or in `.env`:
```env
PORT=4000
```

---

## Memory Optimization

### For Low-End Devices

```bash
# Increase Node memory
node --max-old-space-size=2048 server.js
```

Or in `package.json`:
```json
"start": "node --max-old-space-size=2048 server.js"
```

---

## Updating Dependencies

### Check for Updates

```bash
npm outdated
```

### Update Specific Package

```bash
npm update package-name
```

### Update All

```bash
npm update
```

### Major Version Update

```bash
npm install package-name@latest
```

---

## Uninstalling

### Remove Application

```bash
# Clean up
rm -rf node_modules
rm -rf dist
rm package-lock.json
```

### Keep Source Only

All source code in `src/` folder remains intact.

---

## IDE Setup (Optional)

### Visual Studio Code

1. Install [VS Code](https://code.visualstudio.com/)
2. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - ES Lint
   - Prettier
   - Three.js Snippets

3. Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"]
}
```

### WebStorm/IntelliJ IDEA

- Open project folder
- Auto-detects Node.js and npm
- Built-in debugging support
- Run `npm run dev` from terminal

### Sublime Text

- Install Node.js plugin
- Install Babel syntax highlighting
- Configure build system for webpack

---

## Troubleshooting Common Issues

### Port Already in Use (Windows)

Find process:
```cmd
netstat -ano | findstr :8080
taskkill /PID [PID] /F
```

### Port Already in Use (macOS/Linux)

```bash
lsof -i :8080
kill -9 <PID>
```

### EACCES Permission Denied

```bash
# Don't use sudo, fix npm instead
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Module Compilation Errors

```bash
# Clear cache
rm -rf node_modules/.cache
npm run dev
```

### WebGL Not Supported

- Check browser GPU support
- Try different browser
- May need to disable hardware acceleration

---

## Network Configuration

### Behind Proxy

Create `.npmrc`:
```
proxy=http://proxy.company.com:8080
https-proxy=http://proxy.company.com:8080
```

### Self-Signed Certificate

For development with HTTPS:
```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Use in webpack.config.js
devServer: {
  https: {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
}
```

---

## Docker Setup (Alternative)

### Build Image

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Run Container

```bash
docker build -t ar-lab .
docker run -p 3000:3000 ar-lab
```

---

## Performance Tips

1. **Use SSD**: Faster npm install
2. **Use local npm cache**: Faster reinstalls
3. **Use latest npm**: Better dependency resolution
4. **Disable antivirus temporarily**: During npm install
5. **Use npm ci for CI/CD**: Instead of npm install

---

## Getting Help

### Check Versions
```bash
node --version
npm --version
npm list  # List installed packages
```

### View Logs
```bash
npm install --verbose
npm run dev  # Shows console logs
```

### Clear Everything
```bash
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Quick Reference

```bash
# Installation
npm install                 # Install dependencies
npm ci                      # Clean install (for CI/CD)

# Development
npm run dev                 # Start dev server (port 8080)
npm run build               # Build for production

# Production
npm start                   # Run production server
npm run build && npm start  # Build then run

# Maintenance
npm update                  # Update dependencies
npm outdated                # Check for updates
npm cache clean             # Clear npm cache
npm list                    # List installed packages
```

---

## Next Steps

After installation:

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for basic usage
2. ✅ Review [README.md](README.md) for features
3. ✅ Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
4. ✅ Start development with `npm run dev`

---

**Installation Complete!** 🎉

You're now ready to use the AR Lab Equipment Identifier.

**Questions?** Check the documentation files or review the code comments.

