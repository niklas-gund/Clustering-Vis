import { gaussianRandom } from "./Util";

export type Point2D = {
  x: number;
  y: number;
  data?: string;
};

export function generateUniformRandomPoints(
  n: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): Point2D[] {
  const points: Point2D[] = [];
  for (let i = 0; i < n; i++) {
    points.push({
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    });
  }
  return points;
}

export function generateNormalRandomPoints(
  muX: number,
  muY: number,
  sigmaX: number,
  sigmaY: number,
  n: number
): Point2D[] {
  const points: Point2D[] = [];
  for (let i = 0; i < n; i++) {
    points.push({
      x: gaussianRandom(muX, sigmaX),
      y: gaussianRandom(muY, sigmaY),
    });
  }
  return points;
}

export function generateNormalRadius(
  cx: number,
  cy: number,
  radius: number,
  equiDistantSTD: number,
  n: number
) {
  let points: Point2D[] = [];
  // generate in a line
  for (let i = 0; i < n; i++) {
    const gaussianR = gaussianRandom(radius, equiDistantSTD);
    const t = Math.random();
    points.push({
      x: Math.sin(t * 2 * Math.PI) * gaussianR + cx,
      y: Math.cos(t * 2 * Math.PI) * gaussianR + cy,
    });
  }
  return points;
}
