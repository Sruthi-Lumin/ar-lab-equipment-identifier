// AR Renderer - Handles canvas drawing and AR overlays

export class ARRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
    ];
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawDetections(detections) {
    detections.forEach((detection, index) => {
      this.drawBoundingBox(detection, index);
      this.drawLabel(detection, index);
      this.drawConfidenceBar(detection, index);
    });
  }

  drawBoundingBox(detection, index) {
    const color = this.colors[index % this.colors.length];
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.globalAlpha = 0.9;

    const [x, y, width, height] = detection.bbox;
    this.ctx.strokeRect(x, y, width, height);

    // Add a glow effect
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 15;
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.shadowBlur = 0;

    this.ctx.globalAlpha = 1.0;
  }

  drawLabel(detection, index) {
    const color = this.colors[index % this.colors.length];
    const [x, y, width, height] = detection.bbox;
    const label = detection.class || 'Unknown';
    const score = (detection.score * 100).toFixed(1);
    const text = `${label} ${score}%`;

    // Background for text
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = 0.85;
    const fontSize = 16;
    const padding = 8;
    const textMetrics = this.ctx.measureText(text);
    const textWidth = textMetrics.width + padding * 2;
    const textHeight = fontSize + padding * 2;

    this.ctx.fillRect(x, y - textHeight, textWidth, textHeight);

    // Text
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = `bold ${fontSize}px Arial`;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x + padding, y - textHeight + padding);

    this.ctx.globalAlpha = 1.0;
  }

  drawConfidenceBar(detection, index) {
    const [x, y, width, height] = detection.bbox;
    const barHeight = 6;
    const barWidth = width;
    const score = detection.score;

    // Background bar
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x, y + height + 5, barWidth, barHeight);

    // Score bar
    const color = score > 0.8 ? '#4CAF50' : score > 0.6 ? '#FFC107' : '#FF9800';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y + height + 5, barWidth * score, barHeight);
  }

  drawDiagnosticsOverlay(detections, frameCount, fps) {
    const padding = 10;
    const lineHeight = 20;
    const bgColor = 'rgba(0, 0, 0, 0.7)';
    const textColor = '#00FF00';

    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(padding, padding, 250, lineHeight * 4);

    this.ctx.fillStyle = textColor;
    this.ctx.font = '12px monospace';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(`FPS: ${fps.toFixed(1)}`, padding + 5, padding + 5);
    this.ctx.fillText(`Detections: ${detections.length}`, padding + 5, padding + lineHeight);
    this.ctx.fillText(`Frame: ${frameCount}`, padding + 5, padding + lineHeight * 2);
    this.ctx.fillText(`Res: ${this.width}x${this.height}`, padding + 5, padding + lineHeight * 3);
  }
}
