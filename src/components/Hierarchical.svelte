<script lang="ts">
  import { onMount } from "svelte";
  import { generateNormalRadius, type Point2D } from "../Point";
  import {
    agglomativeHierarchicalClustering,
    getClusterPoints,
  } from "../Hierarchical";
  import PointRenderer from "./PointRenderer.svelte";
  import { generateRainbowColorFunction } from "../Colors";
  const SVGDIM = [800, 800];

  let points = [] as Point2D[];

  points.push(
    ...generateNormalRadius(SVGDIM[0] / 2, SVGDIM[1] / 2, 100, 40, 200),
    ...generateNormalRadius(SVGDIM[0] / 2, SVGDIM[1] / 2, 300, 20, 200)
  );

  function clusterHierarchically() {
    const cluster = agglomativeHierarchicalClustering(points);
    if (cluster.type === "Leaf") {
      return;
    }
    const c1 = cluster.left;
    const c2 = cluster.right;
    const p1 = getClusterPoints(c1).map((p) => ({
      x: p.x,
      y: p.y,
      data: "0",
    }));
    const p2 = getClusterPoints(c2).map((p) => ({
      x: p.x,
      y: p.y,
      data: "1",
    }));
    points = [...p1, ...p2];
  }
</script>

<div>
  <PointRenderer
    {points}
    coloringFunction={generateRainbowColorFunction(2)}
    dimensionsConfiguration={{
      pointxMax: SVGDIM[0],
      pointxMin: 0,
      pointyMax: SVGDIM[1],
      pointyMin: 0,
    }}
    on:pointsChanged={(p) => (points = p.detail)}
  />
  <button on:click={clusterHierarchically}>Hierarchical Clustering!!!</button>
</div>
