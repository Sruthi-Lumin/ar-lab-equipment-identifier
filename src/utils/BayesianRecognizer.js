/**
 * BayesianRecognizer - Bayesian probability-based object recognition
 * Implements Bayes' theorem for improved detection accuracy
 */
class BayesianRecognizer {
  constructor() {
    this.priors = new Map(); // P(Equipment)
    this.likelihoods = new Map(); // P(Detection | Equipment)
    this.posteriors = new Map(); // P(Equipment | Detection)
    this.detectionHistory = [];
    this.maxHistorySize = 50;
  }

  /**
   * Set prior probability for an equipment type
   * @param {string} equipment 
   * @param {number} probability - Between 0 and 1
   */
  setPrior(equipment, probability) {
    if (probability >= 0 && probability <= 1) {
      this.priors.set(equipment, probability);
    }
  }

  /**
   * Initialize uniform priors (equal probability for all)
   * @param {Array<string>} equipmentList 
   */
  initializeUniformPriors(equipmentList) {
    const probability = 1 / equipmentList.length;
    equipmentList.forEach(eq => {
      this.priors.set(eq, probability);
    });
  }

  /**
   * Set likelihood of detection given equipment
   * @param {string} equipment 
   * @param {number} likelihood 
   */
  setLikelihood(equipment, likelihood) {
    if (likelihood >= 0 && likelihood <= 1) {
      this.likelihoods.set(equipment, likelihood);
    }
  }

  /**
   * Calculate posterior probability using Bayes' theorem
   * P(Equipment | Detection) = P(Detection | Equipment) * P(Equipment) / P(Detection)
   * @param {string} equipment 
   * @param {number} detectionConfidence 
   * @returns {number}
   */
  calculatePosterior(equipment, detectionConfidence) {
    const prior = this.priors.get(equipment) || 0.1;
    const likelihood = this.likelihoods.get(equipment) || detectionConfidence;
    
    // P(Detection) - marginalized over all equipment
    let totalProbability = 0;
    for (const eq of this.priors.keys()) {
      const p = this.priors.get(eq);
      const l = this.likelihoods.get(eq) || detectionConfidence;
      totalProbability += l * p;
    }
    
    if (totalProbability === 0) totalProbability = 0.0001;

    const posterior = (likelihood * prior) / totalProbability;
    this.posteriors.set(equipment, posterior);
    return posterior;
  }

  /**
   * Update beliefs based on observation
   * @param {string} detectedClass - Class from TensorFlow detection
   * @param {number} confidence - Confidence score
   * @param {Array<string>} possibleEquipment - List of possible equipment
   * @returns {Object} Posterior probabilities
   */
  updateBelief(detectedClass, confidence, possibleEquipment) {
    const result = {};

    possibleEquipment.forEach(equipment => {
      // Update likelihood based on how similar detected class is to equipment
      const similarity = this.calculateSimilarity(detectedClass, equipment);
      this.setLikelihood(equipment, similarity * confidence);

      // Calculate posterior
      const posterior = this.calculatePosterior(equipment, confidence);
      result[equipment] = posterior;
    });

    // Sort by posterior probability
    const sorted = Object.entries(result)
      .sort(([, a], [, b]) => b - a);

    return Object.fromEntries(sorted);
  }

  /**
   * Calculate semantic similarity between detected class and equipment
   * @param {string} detectedClass 
   * @param {string} equipment 
   * @returns {number} Similarity score (0-1)
   */
  calculateSimilarity(detectedClass, equipment) {
    // String similarity using Levenshtein distance concept
    const detected = detectedClass.toLowerCase();
    const equip = equipment.toLowerCase();

    // Exact match
    if (detected === equip) return 1.0;

    // Partial match
    if (detected.includes(equip) || equip.includes(detected)) return 0.8;

    // Check common lab equipment keywords
    const labKeywords = {
      'beaker': ['cup', 'bottle', 'container'],
      'flask': ['bottle', 'container'],
      'test tube': ['cup', 'bottle', 'bottle'],
      'pipette': ['stick', 'tool'],
      'burette': ['stick', 'tool', 'bottle'],
      'microscope': ['instrument', 'device'],
      'bunsen burner': ['lamp', 'light'],
    };

    const keywords = labKeywords[equip] || [];
    if (keywords.some(kw => detected.includes(kw))) return 0.6;

    return 0.1; // Default low similarity
  }

  /**
   * Track detection history for temporal reasoning
   * @param {string} equipment 
   * @param {number} confidence 
   */
  addToHistory(equipment, confidence) {
    this.detectionHistory.push({
      equipment,
      confidence,
      timestamp: Date.now()
    });

    // Keep history size bounded
    if (this.detectionHistory.length > this.maxHistorySize) {
      this.detectionHistory.shift();
    }
  }

  /**
   * Get most likely equipment from history
   * @returns {Object} Most detected equipment
   */
  getMostLikelyFromHistory() {
    const equipmentCount = new Map();
    const equipmentConfidence = new Map();

    this.detectionHistory.forEach(({ equipment, confidence }) => {
      equipmentCount.set(equipment, (equipmentCount.get(equipment) || 0) + 1);
      const current = equipmentConfidence.get(equipment) || 0;
      equipmentConfidence.set(equipment, current + confidence);
    });

    let maxEquipment = null;
    let maxScore = 0;

    for (const [equipment, count] of equipmentCount.entries()) {
      const avgConfidence = equipmentConfidence.get(equipment) / count;
      const score = count * avgConfidence; // Weighted score
      
      if (score > maxScore) {
        maxScore = score;
        maxEquipment = equipment;
      }
    }

    return { equipment: maxEquipment, score: maxScore };
  }

  /**
   * Get detection statistics
   * @returns {Object}
   */
  getStatistics() {
    return {
      totalDetections: this.detectionHistory.length,
      uniqueEquipment: new Set(this.detectionHistory.map(d => d.equipment)).size,
      mostLikely: this.getMostLikelyFromHistory(),
      posteriors: Object.fromEntries(this.posteriors),
    };
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.detectionHistory = [];
    this.posteriors.clear();
  }

  /**
   * Reset all probabilities
   */
  reset() {
    this.priors.clear();
    this.likelihoods.clear();
    this.posteriors.clear();
    this.clearHistory();
  }
}

export default BayesianRecognizer;
