# System Architecture - Visual Diagrams

## 1. Overall Application Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   USER INTERFACE (HTML/CSS)                │
│         - Video display area                               │
│         - Control panel with buttons                       │
│         - Equipment info display                           │
│         - Settings (threshold, language)                   │
└────────────────────────────┬─────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
    ┌─────────┐        ┌──────────┐        ┌──────────┐
    │  Main   │        │   AR     │        │   UI     │
    │  App    │────→   │Renderer  │        │Controller│
    │(main.js)│        │(canvas)  │        │          │
    └────┬────┘        └──────────┘        └──────────┘
         │
         │ orchestrates
         ▼
    ┌─────────────────────────┬──────────────────────┐
    │                         │                      │
    ▼                         ▼                      ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│  Detection   │      │  Equipment   │     │ Performance  │
│  Model       │      │  Database    │     │  Monitoring  │
│              │      │              │     │              │
│ • TensorFlow │      │ • Microscope │     │ • FPS        │
│ • EfficientDet      │ • Bunsen     │     │ • Logs       │
│ • COCO-SSD  │      │ • Beaker     │     │ • Stats      │
└──────────────┘      │ • Flask      │     └──────────────┘
                      │ • ... (14)   │
                      └──────────────┘
```

## 2. Data Flow Diagram

```
                    VIDEO FRAME
                        │
                        ▼
                 ┌──────────────┐
                 │   Capture    │
                 │ Video Frame  │
                 └──────┬───────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │   Run TensorFlow.js       │
        │   EfficientDet Model      │
        │   on Canvas/WebGL         │
        └───────────┬───────────────┘
                    │
                    ▼ Raw Predictions
        ┌──────────────────────────────┐
        │  Filter Lab Equipment Only   │
        │  - Remove non-lab items      │
        │  - Focus on relevant classes │
        └──────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │  Temporal Filtering          │
        │  - Smooth across 5 frames    │
        │  - Reduce jitter             │
        └──────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │  Non-Max Suppression         │
        │  - Remove duplicates         │
        │  - IoU threshold: 0.5        │
        └──────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │  Confidence Filtering        │
        │  - User-set threshold        │
        │  - Adjustable 0-100%         │
        └──────────┬───────────────────┘
                   │
                   ├─────────────────────────┐
                   │                         │
                   ▼                         ▼
        ┌──────────────────────┐  ┌───────────────────┐
        │  AR Renderer         │  │  Equipment Info   │
        │  - Draw boxes        │  │  Lookup & Display │
        │  - Add labels        │  │  from Database    │
        │  - Confidence bars   │  │  - Safety tips    │
        │  - Glow effects      │  │  - Specs          │
        └──────────────────────┘  └───────────────────┘
                   │                         │
                   └──────────┬──────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   Display Results  │
                    │   to User          │
                    │   on Screen        │
                    └────────────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │  Record Statistics │
                    │  - Detection log   │
                    │  - FPS counter     │
                    │  - Performance     │
                    └────────────────────┘
```

## 3. Component Interaction Diagram

```
╔══════════════════════════════════════════════════════════╗
║                    MAIN APPLICATION                      ║
║                    (main.js)                             ║
║                                                          ║
║ ┌─ initialize()                                          ║
║ │ ├─→ Load Detection Model                             ║
║ │ ├─→ Initialize AR Renderer                           ║
║ │ ├─→ Setup UI Controller                              ║
║ │ └─→ Load Equipment Database                          ║
║ │                                                        ║
║ ┌─ start()                                               ║
║ │ ├─→ Request camera access                            ║
║ │ ├─→ Start video stream                               ║
║ │ └─→ Begin detection loop                             ║
║ │                                                        ║
║ ┌─ detectFrame() [RequestAnimationFrame Loop]           ║
║ │ ├─→ DetectionModel.detect(video)                     ║
║ │ │   ├─→ TensorFlow.js inference                      ║
║ │ │   └─→ Returns predictions                          ║
║ │ ├─→ filterDetections()                               ║
║ │ │   ├─→ Filter by confidence                         ║
║ │ │   └─→ Sort by score                                ║
║ │ ├─→ ARRenderer.drawDetections()                      ║
║ │ │   ├─→ Clear canvas                                 ║
║ │ │   ├─→ Draw bounding boxes                          ║
║ │ │   ├─→ Add labels & confidence                      ║
║ │ │   └─→ Render to user                               ║
║ │ ├─→ Equipment DB lookup                              ║
║ │ │   └─→ Get equipment info                           ║
║ │ └─→ UIController.displayEquipmentInfo()              ║
║ │     └─→ Update info panel                            ║
║ │                                                        ║
║ └─ stop()                                                ║
║   ├─→ Stop camera stream                               ║
║   ├─→ Clear canvas                                      ║
║   └─→ Update status                                     ║
╚══════════════════════════════════════════════════════════╝
```

## 4. Class Hierarchy

```
┌─────────────────────────────────────────────┐
│         LabARIdentifier (main.js)           │
│                                             │
│ Properties:                                 │
│ - model: DetectionModel                    │
│ - arRenderer: ARRenderer                   │
│ - uiController: UIController               │
│ - equipmentDB: EquipmentDatabase           │
│ - videoElement: HTMLVideoElement           │
│ - canvasElement: HTMLCanvasElement         │
│ - isRunning: boolean                       │
└─────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬────────────┐
        │             │             │            │
        ▼             ▼             ▼            ▼
   ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
   │Detection│  │ARRenderer│  │UIControl │  │EquipmentDB   │
   │ Model   │  │          │  │          │  │              │
   │         │  │          │  │          │  │              │
   │Functions:      Functions:  Functions:  Functions:     │
   │- load()│  │- clear()     │- updateSt│- initialize()  │
   │- detect()    │- drawDetect │- displayI│- getEquip()    │
   │- filter│  │- drawLabel   │- showGuid│- searchEquip() │
   │- set   │  │- drawConfBar │- setLang │- getAllEquip() │
   │ Thresh │  │- drawDiagnost│         │              │
   └─────────┘  └──────────────┘  └──────────┘  └──────────────┘
```

## 5. Configuration Hierarchy

```
┌─────────────────────────────────┐
│        CONFIG (config.js)        │
├─────────────────────────────────┤
│                                 │
├─ model                          │
│  ├─ efficientDet                │
│  ├─ cocoSSD                     │
│  └─ detection parameters        │
│                                 │
├─ camera                         │
│  ├─ facingMode                  │
│  ├─ constraints                 │
│  └─ fps settings                │
│                                 │
├─ ui                             │
│  ├─ languages (6 options)       │
│  ├─ status styles               │
│  └─ message durations           │
│                                 │
├─ detection                      │
│  ├─ lab equipment classes       │
│  ├─ keywords                    │
│  └─ thresholds                  │
│                                 │
├─ ar                             │
│  ├─ colors (10 options)         │
│  ├─ text styling                │
│  ├─ confidence bar              │
│  └─ glow effects                │
│                                 │
├─ storage (localStorage)         │
├─ logging                        │
├─ voice (future)                 │
├─ torch (future)                 │
└─ development                    │
```

## 6. Detection Pipeline

```
INPUT: Video Frame from Camera
   │
   ▼
┌─────────────────────────────────┐
│  TensorFlow.js + EfficientDet   │
│                                 │
│  Input:  RGB image              │
│  Process: Neural network        │
│  Output: Bounding boxes +       │
│          Class labels +         │
│          Confidence scores      │
└────────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Prediction Filtering   │
    │                         │
    │  - Keep class == lab    │
    │  - Score > 0.3          │
    │  - Max 20 results       │
    └────────────┬────────────┘
                 │
                 ▼
        ┌─────────────────────┐
        │ Temporal Smoothing  │
        │                     │
        │ Window: 5 frames    │
        │ Method: Average     │
        └────────────┬────────┘
                     │
                     ▼
            ┌─────────────────────────┐
            │  Non-Max Suppression    │
            │                         │
            │  IoU threshold: 0.5     │
            │  Removes overlaps       │
            └────────────┬────────────┘
                         │
                         ▼
                ┌─────────────────────────┐
                │ Confidence Filtering    │
                │                         │
                │ User threshold: 0-100%  │
                │ Default: 50%            │
                └────────────┬────────────┘
                             │
                             ▼
                OUTPUT: Filtered Detections
                (class, bbox, confidence)
```

## 7. User Interaction Flow

```
START: User Opens Page
   │
   ▼
┌──────────────────────────┐
│ Check Permissions        │
│ Load Saved Settings      │
│ Initialize Components    │
└────────────┬─────────────┘
             │
             ▼
    ┌───────────────────────┐
    │ Display Ready Status  │
    │ Enable "Start" button │
    └────────────┬──────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ User Clicks "Start"        │
    │ OR Adjusts Settings        │
    └────────────┬───────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────────┐  ┌────────────────────┐
│ Request Camera   │  │ Adjust Threshold   │
│ Start Detection  │  │ Change Language    │
│ Enable Controls  │  │ Save Preferences   │
└────────┬─────────┘  └────────────────────┘
         │
         ▼
   ┌───────────────────────────┐
   │ Detection Loop Running    │
   │ (30-60 FPS)               │
   │                           │
   │ • Capture frame           │
   │ • Run inference           │
   │ • Filter results          │
   │ • Render AR               │
   │ • Update info             │
   └─────────┬─────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Equipment Detected!  │
    │                      │
    │ • Show on canvas     │
    │ • Display info       │
    │ • Show safety tips   │
    │ • Update stats       │
    └────────────┬─────────┘
                 │
                 ├─ User points camera
                 │  elsewhere
                 │
                 ├─ User adjusts threshold
                 │
                 ├─ User changes language
                 │
                 └─ User clicks "Stop"
                    │
                    ▼
              ┌──────────────────┐
              │ Stop Detection   │
              │ Close Camera     │
              │ Clear Canvas     │
              │ Save History     │
              └──────────────────┘
                    │
                    ▼
                  END
```

## 8. Model Loading Strategy

```
┌──────────────────────────────────────┐
│  DetectionModel.load()               │
└────────────────┬─────────────────────┘
                 │
                 ▼
       ┌──────────────────────┐
       │ Load TensorFlow.js   │
       │ from CDN             │
       │ (if not present)     │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │ Try Load EfficientDet│
       │ from TensorFlow Hub  │
       │ (Primary - Best)     │
       └──────────┬───────────┘
                  │
          ┌───────┴────────┐
          │ Success        │ Error
          ▼                ▼
      ┌─────────┐    ┌──────────────────┐
      │ Ready!  │    │ Fallback:        │
      │ Use     │    │ Load COCO-SSD    │
      │ Eff.   │    │ from CDN          │
      │ Det    │    │ (Compatible)     │
      └─────────┘    └──────┬───────────┘
                            │
                     ┌──────┴────────┐
                     │ Success       │ Error
                     ▼               ▼
                 ┌─────────┐    ┌──────────┐
                 │ Ready!  │    │ Error!   │
                 │ Use     │    │ Show to  │
                 │ COCO-SSD│   │ user     │
                 └─────────┘    └──────────┘
```

## 9. Performance Optimization Strategy

```
GOAL: 30-60 FPS Real-time Detection

┌─────────────────────────────────────┐
│ Input: Video at 30 FPS              │
│ Target: Process each frame < 33ms   │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┬────────────┬──────────┐
    │                 │            │          │
    ▼                 ▼            ▼          ▼
┌────────┐      ┌──────────┐  ┌────────┐  ┌────────┐
│ Use    │      │Temporal  │  │ Non-Max│  │Filter  │
│Smaller │      │Filtering │  │Suppress│  │Confid. │
│Model   │      │          │  │        │  │        │
│D0 < D3 │      │Smooth    │  │Remove  │  │User    │
│        │      │jitter    │  │dups    │  │thresh  │
└────────┘      └──────────┘  └────────┘  └────────┘
    │                 │            │          │
    └─────────────────┴────────────┴──────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ Render Efficiently      │
         │ - Minimal canvas calls  │
         │ - Batch operations      │
         │ - Clear smartly         │
         └─────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ Monitor Performance     │
         │ - Track FPS             │
         │ - Log bottlenecks       │
         │ - Adjust if needed      │
         └─────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │ Result: 30-60 FPS ✓    │
         └─────────────────────────┘
```

---

## Summary

This architecture provides:
- **Modularity**: Each component has single responsibility
- **Scalability**: Easy to add new equipment or features
- **Performance**: Optimized for real-time web processing
- **Maintainability**: Clear separation of concerns
- **Extensibility**: Ready for future enhancements

All components work together to achieve the goal of **80-85% accuracy lab equipment detection** in real-time AR visualization.
