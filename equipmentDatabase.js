// Equipment Database - Stores lab equipment information

export class EquipmentDatabase {
  constructor() {
    this.equipment = {};
    this.initialized = false;
  }

  async initialize() {
    this.loadEquipmentData();
    this.initialized = true;
  }

  loadEquipmentData() {
    this.equipment = {
      'microscope': {
        name: 'Microscope',
        description: 'Optical instrument used to magnify small objects and specimens for detailed observation.',
        uses: [
          'Observing cell structures',
          'Examining microorganisms',
          'Analyzing tissue samples',
          'Studying crystal formations'
        ],
        safetyTips: [
          'Handle with care - sensitive optical equipment',
          'Always use lens paper to clean',
          'Store in protective case when not in use',
          'Do not expose to direct sunlight'
        ],
        specifications: 'Magnification typically ranges from 40x to 1000x',
        usageSteps: [
          'Place specimen on glass slide',
          'Clip slide onto stage',
          'Start with lowest magnification',
          'Use coarse adjustment to focus',
          'Switch to fine adjustment for clarity'
        ]
      },

      'bunsen_burner': {
        name: 'Bunsen Burner',
        description: 'Gas burner used for heating, sterilization, and combustion reactions in laboratory.',
        uses: [
          'Heating substances and solutions',
          'Sterilizing equipment',
          'Flame tests for element detection',
          'Glassware bending and shaping'
        ],
        safetyTips: [
          'Never leave unattended while lit',
          'Keep away from flammable materials',
          'Use tripod and wire gauze for heating',
          'Ensure proper ventilation',
          'Allow to cool before touching'
        ],
        specifications: 'Temperature: up to 1500°C at the hottest part of the flame',
        usageSteps: [
          'Connect to gas source',
          'Turn on gas slowly',
          'Light with matchstick or lighter',
          'Adjust air intake for blue flame',
          'Use appropriate heat level'
        ]
      },

      'beaker': {
        name: 'Beaker',
        description: 'Cylindrical glass container with a pouring spout used for mixing, heating, and storing liquids.',
        uses: [
          'Mixing solutions',
          'Heating liquids',
          'Storing chemicals',
          'Performing reactions',
          'Measuring approximate volumes'
        ],
        safetyTips: [
          'Check for cracks before use',
          'Do not pour while hot',
          'Use tongs or heat-resistant gloves when hot',
          'Keep away from edges of work surface'
        ],
        specifications: 'Common volumes: 50mL, 100mL, 250mL, 500mL, 1000mL, 2000mL',
        usageSteps: [
          'Check beaker is clean and dry',
          'Pour liquid carefully',
          'Use graduated cylinder for accurate measurement',
          'Place on heat-resistant mat when heating'
        ]
      },

      'flask': {
        name: 'Conical Flask (Erlenmeyer Flask)',
        description: 'Cone-shaped glass container with a flat bottom, used for reactions and storing solutions.',
        uses: [
          'Performing chemical reactions',
          'Titration experiments',
          'Fermentation studies',
          'Storing volatile substances'
        ],
        safetyTips: [
          'Check for cracks and chips',
          'Use heat-resistant gloves when warm',
          'Never seal tightly when heating',
          'Ensure proper ventilation'
        ],
        specifications: 'Common volumes: 50mL to 2000mL; narrow neck prevents splashing',
        usageSteps: [
          'Inspect for defects',
          'Fill to appropriate level (below neck)',
          'Stir with appropriate implement',
          'Use on stable surface only'
        ]
      },

      'pipette': {
        name: 'Pipette',
        description: 'Precision glass tube used for transferring and measuring small volumes of liquids.',
        uses: [
          'Accurate liquid measurement',
          'Transferring solutions',
          'Performing titrations',
          'Adding precise amounts of reagents'
        ],
        safetyTips: [
          'Never pipette by mouth - always use pipette bulb',
          'Rinse immediately after use',
          'Handle gently - glass can break',
          'Store in designated holder'
        ],
        specifications: 'Accuracy ±0.02-0.05mL depending on type and size',
        usageSteps: [
          'Attach pipette bulb securely',
          'Immerse tip in solution',
          'Draw liquid using bulb',
          'Dispense into receiving container'
        ]
      },

      'test_tube': {
        name: 'Test Tube',
        description: 'Small glass tube used for holding, mixing, and heating small quantities of liquids.',
        uses: [
          'Small-scale reactions',
          'Testing solutions',
          'Heating small quantities',
          'Observing chemical changes'
        ],
        safetyTips: [
          'Point tube away from people when heating',
          'Use test tube holder when hot',
          'Never stopper a hot test tube',
          'Inspect for cracks before use'
        ],
        specifications: 'Common sizes: 10mL, 16mL, 20mL, 25mL test tubes',
        usageSteps: [
          'Place liquid in tube',
          'Hold at angle in test tube holder',
          'Heat gently if needed',
          'Observe changes carefully'
        ]
      },

      'thermometer': {
        name: 'Thermometer',
        description: 'Instrument for measuring temperature of liquids and gases in laboratory experiments.',
        uses: [
          'Monitoring reaction temperatures',
          'Measuring boiling points',
          'Tracking heat changes',
          'Controlling experimental conditions'
        ],
        safetyTips: [
          'Handle carefully - contains mercury in some older models',
          'Do not immerse bulb beyond safety line',
          'Remove before solution boils',
          'Avoid sudden temperature changes',
          'Use alcohol thermometers for safety'
        ],
        specifications: 'Range typically -10°C to 110°C or equivalent Fahrenheit',
        usageSteps: [
          'Check calibration before use',
          'Immerse bulb in liquid',
          'Wait for reading to stabilize',
          'Read at eye level'
        ]
      },

      'graduated_cylinder': {
        name: 'Graduated Cylinder',
        description: 'Precision glassware with volume markings used for accurate measurement of liquids.',
        uses: [
          'Measuring liquid volumes accurately',
          'Preparing solutions with specific concentrations',
          'Determining liquid density',
          'Preparing standard solutions'
        ],
        safetyTips: [
          'Check for cracks and graduations',
          'Do not heat directly on burner',
          'Read at eye level on flat surface',
          'Do not use for measuring hot liquids'
        ],
        specifications: 'Accuracy: ±0.5-1.0mL for 10-50mL cylinders; sizes: 10mL to 2000mL',
        usageSteps: [
          'Place on flat surface',
          'Pour liquid carefully',
          'Read at meniscus bottom',
          'Record volume measurement'
        ]
      },

      'petri_dish': {
        name: 'Petri Dish',
        description: 'Shallow cylindrical glass or plastic dish used for culturing microorganisms and cell growth.',
        uses: [
          'Growing bacterial cultures',
          'Fungal culture studies',
          'Microscopic organism observation',
          'Agar plate preparation',
          'Cell culture experiments'
        ],
        safetyTips: [
          'Handle with care when hot',
          'Seal with parafilm if not sterile',
          'Dispose of contaminated dishes properly',
          'Use sterile technique when inoculating',
          'Never open if microbial culture inside'
        ],
        specifications: 'Standard diameter: 90mm (90mm x 15mm typical)',
        usageSteps: [
          'Sterilize in autoclave if needed',
          'Pour agar medium carefully',
          'Allow to cool and solidify',
          'Inoculate with sterile technique'
        ]
      },

      'dropper': {
        name: 'Dropper (Pipette)',
        description: 'Simple device for dispensing small drops of liquid in controlled manner.',
        uses: [
          'Adding indicators to solutions',
          'Dispensing precise liquid drops',
          'Adding reagents to test tubes',
          'Sampling solutions'
        ],
        safetyTips: [
          'Rinse after each use',
          'Keep tip clean to avoid clogging',
          'Do not touch tip with hands',
          'Store in designated container'
        ],
        specifications: 'Typical drop size: 0.05mL per drop',
        usageSteps: [
          'Fill dropper by squeezing bulb and releasing',
          'Position over target container',
          'Gently squeeze to release drops',
          'Count drops for accurate measurement'
        ]
      },

      'funnel': {
        name: 'Funnel',
        description: 'Cone-shaped device used for transferring liquids and solids into narrow-necked containers.',
        uses: [
          'Transferring liquids into flasks',
          'Filtering solutions',
          'Adding powder to containers',
          'Preventing spills during transfers'
        ],
        safetyTips: [
          'Use appropriate size funnel',
          'Ensure proper fit in container',
          'Do not leave unattended while in use',
          'Rinse thoroughly after each use'
        ],
        specifications: 'Common sizes: 50mL, 75mL, 100mL, 150mL funnels',
        usageSteps: [
          'Position funnel in container',
          'Pour liquid slowly and steadily',
          'Keep funnel supported with stand',
          'Remove carefully and rinse'
        ]
      },

      'stirring_rod': {
        name: 'Stirring Rod',
        description: 'Glass or plastic rod used for stirring, mixing, and transferring liquids in laboratory.',
        uses: [
          'Stirring solutions during reactions',
          'Aiding in dissolution of solids',
          'Transferring liquid between containers',
          'Guiding liquid into funnels'
        ],
        safetyTips: [
          'Check for cracks and sharp edges',
          'Be careful when stirring hot liquids',
          'Do not stir too vigorously',
          'Inspect for glass fragments'
        ],
        specifications: 'Typical length: 12-15 inches; diameter: 5-8mm',
        usageSteps: [
          'Immerse rod in liquid',
          'Stir gently and smoothly',
          'Use back-and-forth motion primarily',
          'Remove and rinse when done'
        ]
      },

      'tripod': {
        name: 'Tripod',
        description: 'Three-legged stand used to support containers during heating with Bunsen burner.',
        uses: [
          'Supporting beakers and flasks during heating',
          'Holding containers steady',
          'Elevating glassware above heat source',
          'Providing stable platform for heating'
        ],
        safetyTips: [
          'Ensure stable placement on bench',
          'Use with wire gauze or clay triangle',
          'Keep away from bench edges',
          'Allow to cool before moving',
          'Position heat source appropriately'
        ],
        specifications: 'Typical height: 4-6 inches; supports up to 5kg weight',
        usageSteps: [
          'Place tripod on stable surface',
          'Position container on top',
          'Place burner below tripod',
          'Adjust for proper heat distribution'
        ]
      },

      'wire_gauze': {
        name: 'Wire Gauze',
        description: 'Heat-resistant wire mesh used to distribute heat evenly under containers being heated.',
        uses: [
          'Spreading flame from Bunsen burner',
          'Even heat distribution for vessels',
          'Protecting glassware from direct flame',
          'Supporting containers during heating'
        ],
        safetyTips: [
          'Always use with tripod',
          'Ensure gauze is free of holes',
          'Keep container stable on gauze',
          'Place on ceramic tile when cooling',
          'Use proper-sized gauze for container'
        ],
        specifications: 'Typical size: 5\"x5\" asbestos-free wire gauze',
        usageSteps: [
          'Place wire gauze on tripod',
          'Center container on gauze',
          'Position Bunsen burner below',
          'Heat gently and evenly'
        ]
      }
    };
  }

  getEquipment(className) {
    // Normalize class name
    const normalizedClass = className?.toLowerCase().replace(/\s+/g, '_') || '';
    
    // Try exact match first
    if (this.equipment[normalizedClass]) {
      return this.equipment[normalizedClass];
    }

    // Try partial match
    for (const [key, equipment] of Object.entries(this.equipment)) {
      if (normalizedClass.includes(key) || key.includes(normalizedClass)) {
        return equipment;
      }
    }

    return null;
  }

  getAllEquipment() {
    return Object.values(this.equipment);
  }

  searchEquipment(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.equipment).filter(eq =>
      eq.name.toLowerCase().includes(lowerQuery) ||
      eq.description.toLowerCase().includes(lowerQuery)
    );
  }
}
