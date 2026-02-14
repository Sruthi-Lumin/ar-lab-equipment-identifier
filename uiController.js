// UI Controller - Manages UI updates and user interactions

export class UIController {
  constructor() {
    this.statusBar = document.getElementById('statusBar');
    this.equipmentInfo = document.getElementById('equipmentInfo');
    this.thresholdSlider = document.getElementById('thresholdSlider');
    this.languageSelect = document.getElementById('languageSelect');
    this.setupLanguageSupport();
  }

  updateStatus(message, type = 'info') {
    this.statusBar.textContent = message;
    this.statusBar.className = `status-bar status-${type}`;
  }

  displayEquipmentInfo(equipment, confidence) {
    let html = `<h3>${equipment.name}</h3>`;
    html += `<p><strong>Confidence:</strong> ${(confidence * 100).toFixed(1)}%</p>`;
    
    if (equipment.description) {
      html += `<h4>Description</h4><p>${equipment.description}</p>`;
    }

    if (equipment.uses && equipment.uses.length > 0) {
      html += `<h4>Common Uses</h4><ul>`;
      equipment.uses.forEach(use => {
        html += `<li>${use}</li>`;
      });
      html += `</ul>`;
    }

    if (equipment.safetyTips && equipment.safetyTips.length > 0) {
      html += `<h4>⚠️ Safety Tips</h4><ul>`;
      equipment.safetyTips.forEach(tip => {
        html += `<li>${tip}</li>`;
      });
      html += `</ul>`;
    }

    if (equipment.specifications) {
      html += `<h4>Specifications</h4><p>${equipment.specifications}</p>`;
    }

    this.equipmentInfo.innerHTML = html;
  }

  setupLanguageSupport() {
    this.languageSelect.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });
  }

  setLanguage(language) {
    const translations = {
      'en-US': {
        start: 'Start',
        stop: 'Stop',
        voice: '🎤 Voice',
        torch: '💡 Torch',
        initializing: 'Initializing...',
        ready: 'Ready for detection',
        running: 'Detection running...',
        stopped: 'Detection stopped',
        loading: 'Loading detection model...'
      },
      'es-ES': {
        start: 'Comenzar',
        stop: 'Detener',
        voice: '🎤 Voz',
        torch: '💡 Linterna',
        initializing: 'Inicializando...',
        ready: 'Listo para detección',
        running: 'Detección en ejecución...',
        stopped: 'Detección detenida',
        loading: 'Cargando modelo...'
      },
      'fr-FR': {
        start: 'Démarrer',
        stop: 'Arrêter',
        voice: '🎤 Voix',
        torch: '💡 Lampe',
        initializing: 'Initialisation...',
        ready: 'Prêt pour la détection',
        running: 'Détection en cours...',
        stopped: 'Détection arrêtée',
        loading: 'Chargement du modèle...'
      }
    };

    // Store selected language
    this.currentLanguage = language;
    localStorage.setItem('preferredLanguage', language);
  }

  showEquipmentGuide(equipment) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <h2>${equipment.name}</h2>
          <p>${equipment.description}</p>
          
          <h3>How to Use</h3>
          <ol>
            ${equipment.usageSteps ? equipment.usageSteps.map(step => `<li>${step}</li>`).join('') : '<li>No usage information available</li>'}
          </ol>

          <h3>Safety Precautions</h3>
          <div class="warning">Always follow lab safety guidelines when using this equipment.</div>
          <ul>
            ${equipment.safetyTips ? equipment.safetyTips.map(tip => `<li>${tip}</li>`).join('') : '<li>No safety information available</li>'}
          </ul>

          <button onclick="this.closest('.modal').remove()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showErrorNotification(message) {
    this.updateStatus(message, 'error');
  }

  showSuccessNotification(message) {
    this.updateStatus(message, 'success');
  }
}
