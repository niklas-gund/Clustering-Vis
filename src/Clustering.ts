import {
  generateNormalRandomPoints,
  generateUniformRandomPoints,
  type Point2D,
} from "./Point";
import { hashCode } from "./Util";

export abstract class Clustering {
  protected clusters: Point2D[][] = [];
  constructor(protected points: Point2D[]) {}
  abstract clusterStep(): void;
  abstract clusterAllSteps(): void;
  public getClusters(): Point2D[] {
    const pseudoPoints: Point2D[] = [];
    for (let i = 0; i < this.clusters.length; i++) {
      this.clusters[i].forEach((point) => {
        pseudoPoints.push({ x: point.x, y: point.y, data: "" + i });
      });
    }
    return pseudoPoints;
  }
}

export class KMeans extends Clustering {
  private means: Point2D[] = [];
  constructor(
    points: Point2D[],
    private k: number,
    domain: [number, number, number, number],
    means: Point2D[] = []
  ) {
    super(points);
    // initialize means:
    if (means.length == 0) {
      this.means = generateUniformRandomPoints(
        k,
        domain[0],
        domain[1],
        domain[2],
        domain[3]
      );
    } else {
      this.means = means;
    }
  }

  private clusterByMeans(): void {
    this.clusters = [];
    for (let i = 0; i < this.k; i++) {
      this.clusters.push([]);
    }
    for (const point of this.points) {
      let minDistance = Infinity;
      let closestK = -1;
      for (let i = 0; i < this.k; i++) {
        const distance = Math.sqrt(
          Math.pow(point.x - this.means[i].x, 2) +
            Math.pow(point.y - this.means[i].y, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestK = i;
        }
      }
      this.clusters[closestK].push(point);
    }
  }

  private updateMeans(): void {
    for (let i = 0; i < this.k; i++) {
      let sumX = 0;
      let sumY = 0;
      for (const point of this.clusters[i]) {
        sumX += point.x;
        sumY += point.y;
      }
      this.means[i].x = sumX / this.clusters[i].length;
      this.means[i].y = sumY / this.clusters[i].length;
    }
  }

  clusterStep(): void {
    this.clusterByMeans();
    this.updateMeans();
  }

  public getClusterCenters(): Point2D[] {
    return this.means.map((point, index) => ({
      x: point.x,
      y: point.y,
      data: "" + index,
    }));
  }

  clusterAllSteps(): void {
    const maxSteps = 100000;
    for (let i = 0; i < maxSteps; i++) {
      const oldHash = hashCode(JSON.stringify(this.getClusters()));
      this.clusterStep();
      const newHash = hashCode(JSON.stringify(this.getClusters()));
      if (oldHash === newHash) {
        console.log("done in " + i + " steps");
        break;
      }
    }
    console.log("Loss: " + this.calculateTotalLoss());
  }

  public calculateTotalLoss(): number {
    let loss = 0;
    for (let i = 0; i < this.k; i++) {
      const cluster = this.clusters[i];
      for (const point of cluster) {
        loss += Math.sqrt(
          Math.pow(point.x - this.means[i].x, 2) +
            Math.pow(point.y - this.means[i].y, 2)
        );
      }
    }
    return loss;
  }
}
