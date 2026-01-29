/**
 * Lab Equipment Database with descriptions and instructions
 */
const LAB_EQUIPMENT_DB = {
  'beaker': {
    name: 'Beaker',
    aliases: ['cup', 'container'],
    description: 'A cylindrical glass container used for mixing, heating, and storing liquids in the laboratory.',
    safetyWarnings: [
      'Handle with care as glass can break',
      'Check for cracks before use',
      'Never fill above the marking line',
      'Allow to cool before touching after heating'
    ],
    usage: [
      'Mixing and stirring liquids',
      'Heating solutions (over direct heat)',
      'Temporary storage of chemicals',
      'Measuring and pouring'
    ],
    steps: [
      'Inspect the beaker for any cracks or chips',
      'Place on heat-resistant surface',
      'Use a stirring rod for mixing',
      'Add contents slowly to prevent splashing',
      'Use appropriate heating source if needed',
      'Allow to cool before handling if heated'
    ]
  },

  'flask': {
    name: 'Conical Flask (Erlenmeyer Flask)',
    aliases: ['erlenmeyer flask', 'conical container'],
    description: 'A conical glass flask with a flat bottom, used for mixing, heating, and storing solutions.',
    safetyWarnings: [
      'Check for cracks before use',
      'Never heat on direct flame without using appropriate heat source',
      'Ensure flat base is stable on surface',
      'Let cool before touching after heating'
    ],
    usage: [
      'Titrations and volumetric work',
      'Swirling and mixing solutions',
      'Heating liquids (with indirect heat)',
      'Reducing spill hazard during mixing'
    ],
    steps: [
      'Inspect flask for damage',
      'Place on stable, heat-resistant surface',
      'Add solution gradually',
      'Use appropriate heating equipment',
      'Swirl gently to mix contents',
      'Allow adequate cooling time'
    ]
  },

  'test tube': {
    name: 'Test Tube',
    aliases: ['tube', 'reaction vessel'],
    description: 'A small cylindrical glass tube, open at the top, used for holding small amounts of chemicals.',
    safetyWarnings: [
      'Never point opening toward yourself or others',
      'Use test tube holder when heating',
      'Check for cracks or rough edges',
      'Allow heated tubes to cool before touching'
    ],
    usage: [
      'Small-scale chemical reactions',
      'Testing substances',
      'Heating small volumes of liquid',
      'Mixing reagents'
    ],
    steps: [
      'Secure tube in test tube holder',
      'Add chemicals as required',
      'If heating, use gentle heat initially',
      'Heat from side to side, not straight up',
      'Remove from heat and allow to cool',
      'Use stopper if temporary storage needed'
    ]
  },

  'microscope': {
    name: 'Optical Microscope',
    aliases: ['optical instrument', 'magnification device'],
    description: 'An optical instrument used to view magnified images of small objects or organisms.',
    safetyWarnings: [
      'Handle with care - delicate instrument',
      'Never touch optical surfaces',
      'Protect from dust and moisture',
      'Do not force focusing mechanism'
    ],
    usage: [
      'Viewing microscopic organisms',
      'Examining small biological specimens',
      'Analyzing crystal structures',
      'Observing cell structures'
    ],
    steps: [
      'Ensure microscope is on stable surface',
      'Start with lowest magnification lens',
      'Place specimen on glass slide',
      'Adjust focus using coarse adjustment knob',
      'Use fine adjustment for sharp image',
      'Use higher magnifications for detail',
      'Clean objective lens with lens paper only'
    ]
  },

  'pipette': {
    name: 'Pipette (Dropper)',
    aliases: ['dropper', 'pipet'],
    description: 'A laboratory tool for transferring measured amounts of liquid from one container to another.',
    safetyWarnings: [
      'Never pipette by mouth',
      'Check for blockages before use',
      'Dry thoroughly before each new chemical',
      'Never leave filled pipette unattended'
    ],
    usage: [
      'Precise liquid transfer',
      'Adding reagents dropwise',
      'Sampling solutions',
      'Serial dilutions'
    ],
    steps: [
      'Ensure pipette is clean and dry',
      'Using bulb or pipette pump, draw liquid',
      'Hold pipette vertically for transfer',
      'Place tip at destination vessel',
      'Slowly release liquid',
      'Keep tip in liquid until release complete',
      'Clean immediately after use'
    ]
  },

  'burette': {
    name: 'Burette',
    aliases: ['buret', 'graduated tube'],
    description: 'A graduated glass tube with a valve at one end, used for precise volumetric measurement.',
    safetyWarnings: [
      'Check stopcock works smoothly',
      'Never force the stopcock',
      'Check for leaks before use',
      'Keep clean to prevent valve sticking'
    ],
    usage: [
      'Titrations',
      'Precise liquid measurement and dispensing',
      'Controlled addition of reagents',
      'Acid-base neutralization analysis'
    ],
    steps: [
      'Rinse burette three times with small portions of liquid to be used',
      'Fill burette above zero mark',
      'Remove air bubbles from tip',
      'Set initial reading at meniscus',
      'Open stopcock slowly to dispense',
      'Record final reading',
      'Calculate volume dispensed'
    ]
  },

  'bunsen burner': {
    name: 'Bunsen Burner',
    aliases: ['burner', 'heat source', 'lamp'],
    description: 'A gas burner used in laboratories for heating, sterilization, and combustion reactions.',
    safetyWarnings: [
      'Keep away from flammable materials',
      'Do not leave burning unattended',
      'Allow to cool before handling',
      'Ensure proper ventilation',
      'Secure all apparatus over flame',
      'Check gas connection is secure'
    ],
    usage: [
      'Heating solutions in beakers and flasks',
      'Sterilizing wire loops and needles',
      'Combustion analysis',
      'Melting substances'
    ],
    steps: [
      'Ensure gas supply is available',
      'Connect to gas line',
      'Turn gas valve on slightly',
      'Ignite with lighter at barrel opening',
      'Adjust air hole for blue flame',
      'Control heat by gas valve',
      'Turn off gas after use',
      'Wait for complete cooling'
    ]
  },

  'tripod': {
    name: 'Iron Tripod',
    aliases: ['stand', 'support'],
    description: 'A three-legged stand used to support flasks, beakers, and other apparatus during heating.',
    safetyWarnings: [
      'Ensure stable on flat surface',
      'Do not move while holding heated equipment',
      'Keep away from table edge',
      'Ensure all legs are fully extended'
    ],
    usage: [
      'Supporting beakers and flasks during heating',
      'Elevating apparatus over heat source',
      'Supporting apparatus during reactions'
    ],
    steps: [
      'Place tripod on stable, level surface',
      'Position legs equally for stability',
      'Place wire gauze on top',
      'Ensure apparatus is centered and stable',
      'Position Bunsen burner below',
      'Verify stability before adding contents'
    ]
  },

  'graduated cylinder': {
    name: 'Graduated Cylinder',
    aliases: ['measuring cylinder', 'measuring glass'],
    description: 'A graduated glass cylinder used for measuring volumes of liquids.',
    safetyWarnings: [
      'Do not use for heating',
      'Check for cracks before use',
      'Read at eye level for accuracy',
      'Do not exceed maximum marking'
    ],
    usage: [
      'Measuring liquid volumes',
      'Preparing solutions',
      'Pouring measured amounts',
      'Determining liquid density'
    ],
    steps: [
      'Place graduated cylinder on level surface',
      'Pour liquid slowly to prevent splashing',
      'Read volume at bottom of meniscus',
      'Keep eye level with graduation mark',
      'Pour liquid into separate container',
      'Clean immediately after use'
    ]
  },

  'wire gauze': {
    name: 'Wire Gauze',
    aliases: ['heat resistant mat', 'gauze pad'],
    description: 'A square of wire mesh used to distribute heat evenly under apparatus during heating.',
    safetyWarnings: [
      'Gets extremely hot - use tongs to handle',
      'Place on stable surface only',
      'Do not touch after heating',
      'Keep away from combustible materials'
    ],
    usage: [
      'Supporting flasks during heating',
      'Even heat distribution',
      'Preventing direct contact with flame',
      'Asbestos alternative for heat protection'
    ],
    steps: [
      'Place on top of tripod',
      'Ensure it sits flat and stable',
      'Center flask or beaker on gauze',
      'Verify stability before heating',
      'Use tongs to adjust after heating',
      'Wait for complete cooling'
    ]
  }
};

export default LAB_EQUIPMENT_DB;
