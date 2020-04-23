import SvgHandler from './drawSVG';

function getMidpoint(p0, p1) {
  const xMidpoint = (p0[0] + p1[0]) / 2;
  const yMidpoint = (p0[1] + p1[1]) / 2;
  return [xMidpoint, yMidpoint];
}

function getLineLength(p0, p1) {
  const length = Math.sqrt((p1[0] ** 2 - p0[0] ** 2) + (p1[1] ** 2 - p0[1] ** 2));
  return length;
}

function checkDelta(p0, p1, p2, delta) {
  const p0p1 = getLineLength(p0, p1);
  const p1p2 = getLineLength(p1, p2);
  const p0p2 = getLineLength(p0, p2);
  if ((p0p1 + p1p2 - p0p2) < delta) {
    return true;
  }
  return false;
}

// Рекурсивный алгоритм построения кривой Безье.
// Он не очень стабилен и я от него отказался
function bezier(p0, p1, p2, delta, handler) {
  const m0 = getMidpoint(p0, p1);
  const m2 = getMidpoint(p1, p2);
  const m1 = getMidpoint(m0, m2);
  if (checkDelta(p0, m0, m1, delta) && checkDelta(m1, m2, p2, delta)) {
    handler.drawLine(p0, m1);
    handler.drawLine(m1, p2);
  } else if (checkDelta(p0, m0, m1, delta) && !checkDelta(m1, m2, p2, delta)) {
    handler.drawLine(p0, m1);
    bezier(m1, m2, p2, delta, handler);
  } else if (!checkDelta(p0, m0, m1, delta) && checkDelta(m1, m2, p2, delta)) {
    handler.drawLine(m1, p2);
    bezier(p0, m0, m1, delta, handler);
  } else {
    bezier(m1, m2, p2, delta, handler);
    bezier(p0, m0, m1, delta, handler);
  }
}

export default class Bezier {
  constructor(p0, p1, p2, delta) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.startPointMoving = false;
    this.middlePointMoving = false;
    this.endPointMoving = false;
    this.delta = delta;
    this.svgHandler = new SvgHandler();
    this.svgHandler.field.mouseup((e) => {
      const { x, y } = e.target.getBoundingClientRect();
      const absoluteX = e.clientX;
      const absoluteY = e.clientY;
      const newX = absoluteX - x;
      const newY = absoluteY - y;
      if (this.startPointMoving) {
        this.p0 = [newX, newY];
        this.startPointMoving = false;
        this.svgHandler.field.clear();
        this.draw();
      } else if (this.middlePointMoving) {
        this.p1 = [newX, newY];
        this.middlePointMoving = false;
        this.svgHandler.field.clear();
        this.draw();
      } else if (this.endPointMoving) {
        this.p2 = [newX, newY];
        this.endPointMoving = false;
        this.svgHandler.field.clear();
        this.draw();
      }
    });
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
    bezier(this.p0, this.p1, this.p2, 0.05, this.svgHandler);
  }
}
