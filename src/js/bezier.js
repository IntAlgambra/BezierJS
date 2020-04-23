import SvgHandler from './drawSVG';

export default class Bezier {
  constructor(p0, p1, p2) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.startPointMoving = false;
    this.middlePointMoving = false;
    this.endPointMoving = false;
    this.svgHandler = new SvgHandler();
    const { x, y } = this.svgHandler.field.node.getBoundingClientRect();
    this.svgHandlerX = x;
    this.svgHandlerY = y;
    this.svgHandler.field.mousemove((e) => {
      const absoluteX = e.clientX;
      const absoluteY = e.clientY;
      const newX = absoluteX - this.svgHandlerX;
      const newY = absoluteY - this.svgHandlerY;
      if (this.startPointMoving) {
        this.p0 = [newX, newY];
        this.svgHandler.field.clear();
        this.draw();
      } else if (this.middlePointMoving) {
        this.p1 = [newX, newY];
        this.svgHandler.field.clear();
        this.draw();
      } else if (this.endPointMoving) {
        this.p2 = [newX, newY];
        this.svgHandler.field.clear();
        this.draw();
      }
    });
    document.body.addEventListener('mouseup', () => {
      this.startPointMoving = false;
      this.middlePointMoving = false;
      this.endPointMoving = false;
    });
  }

  static getPointOnLine(p1, p2, rate) {
    const x1 = p1[0];
    const x2 = p2[0];
    const y1 = p1[1];
    const y2 = p2[1];
    const rateFactor = rate / (1 - rate);
    const x = (x1 + rateFactor * x2) / (1 + rateFactor);
    const y = (y1 + rateFactor * y2) / (1 + rateFactor);
    return [x, y];
  }

  bezierCycle(p0, p1, p2, step) {
    let rate = 0;
    const points = [];
    let m0;
    let m1;
    let m2;
    while (rate <= 1) {
      m0 = Bezier.getPointOnLine(p0, p1, rate);
      m2 = Bezier.getPointOnLine(p1, p2, rate);
      m1 = Bezier.getPointOnLine(m0, m2, rate);
      points.push(m1);
      rate += step;
    }
    points.push(p2);
    this.svgHandler.drawPolyline(points);
  }

  draw() {
    const startPoint = this.svgHandler.drawMainPoint(this.p0);
    const endPoint = this.svgHandler.drawMainPoint(this.p2);
    this.svgHandler.drawLine(this.p0, this.p1);
    this.svgHandler.drawLine(this.p1, this.p2);
    const middlePoint = this.svgHandler.drawSecondaryPoint(this.p1);
    startPoint.mousedown(() => {
      this.startPointMoving = true;
    });
    middlePoint.mousedown(() => {
      this.middlePointMoving = true;
    });
    endPoint.mousedown(() => {
      this.endPointMoving = true;
    });
    this.bezierCycle(this.p0, this.p1, this.p2, 0.01, this.svgHandler);
  }
}
