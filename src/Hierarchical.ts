import type { Clustering } from "./Clustering";
import type { Point2D } from "./Point";

export type HCluster = HClusterNode | HClusterLeaf;
export type HClusterNode = { type: "Node"; left: HCluster; right: HCluster };
export type HClusterLeaf = { type: "Leaf"; point: Point2D };

export function getClusterPoints(c: HCluster): Point2D[] {
  if (c.type == "Leaf") return [c.point];
  return [...getClusterPoints(c.left), ...getClusterPoints(c.right)];
}

function getSingleLinkageIndices(pool: HCluster[]) {
  const clusterPoints = pool.map((c) => getClusterPoints(c));
  let minDistance = Number.POSITIVE_INFINITY;
  let poolIndex1 = -1;
  let poolIndex2 = -1;
  for (let i1 = 0; i1 < pool.length; i1++) {
    for (let i2 = i1; i2 < pool.length; i2++) {
      if (i1 === i2) continue;
      // point-wise comparison
      for (const p1 of clusterPoints[i1]) {
        for (const p2 of clusterPoints[i2]) {
          const dist = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            poolIndex1 = i1;
            poolIndex2 = i2;
          }
        }
      }
    }
  }
  return [poolIndex1, poolIndex2] as [number, number];
}

export function agglomativeHierarchicalClustering(
  points: Point2D[],
  linkageFunction: (
    pool: HCluster[]
  ) => [number, number] = getSingleLinkageIndices
) {
  // every point is converted to a leaf cluster
  const pool = points.map((p) => ({ type: "Leaf", point: p } as HCluster));
  // move one random cluster to the clustered pool as a starting point
  const maxSteps = 2 * points.length + 10; // safety net
  for (let i = 0; i < maxSteps; i++) {
    console.log("step " + i + " of " + maxSteps);
    const nextLinkage = linkageFunction(pool);
    const c1 = pool[nextLinkage[0]];
    const c2 = pool[nextLinkage[1]];
    // remove indices from pool
    pool.splice(nextLinkage[0], 1);
    if (nextLinkage[0] < nextLinkage[1]) {
      pool.splice(nextLinkage[1] - 1, 1);
    } else {
      pool.splice(nextLinkage[1], 1);
    }
    pool.push({ type: "Node", left: c1, right: c2 });
    if (pool.length === 1) {
      break;
    }
  }
  return pool[0];
}
