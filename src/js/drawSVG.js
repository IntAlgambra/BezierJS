import { SVG } from '@svgdotjs/svg.js';

export default class SvgHandler {
  constructor() {
    this.field = SVG('#svgfield');
  }

  drawLine(p1, p2) {
    this.field.line(...p1, ...p2).stroke({ width: 1, color: '#569CD6' });
  }

  drawPolyline(points) {
    this.field.polyline(points).fill('none').stroke({ width: 1, color: '#f06' });
  }

  drawMainPoint(p) {
    const r = 10;
    const deltaX = p[0] - r / 2;
    const deltaY = p[1] - r / 2;
    const point = this.field.circle(r).fill('#f06').move(deltaX, deltaY);
    return point;
  }

  drawSecondaryPoint(p) {
    const r = 10;
    const deltaX = p[0] - r / 2;
    const deltaY = p[1] - r / 2;
    const point = this.field.circle(r).stroke({ width: 1, color: '#569CD6' }).fill('#fff').move(deltaX, deltaY);
    return point;
  }
}
