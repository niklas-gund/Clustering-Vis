<script lang="ts">
  import { Clustering, KMeans } from "../Clustering";
  import { generateRainbowColorFunction } from "../Colors";
  import Katex from "katex";
  import {
    generateNormalRandomPoints,
    generateUniformRandomPoints,
    type Point2D,
  } from "../Point";
  import PointRenderer from "./PointRenderer.svelte";

  const DOMAIN_SIZE = [800, 800] as [number, number];
  let euclideanFractal = false;
  let points: Point2D[] = [];
  let k = 3;

  points = generateUniformRandomPoints(
    100,
    0,
    DOMAIN_SIZE[0],
    0,
    DOMAIN_SIZE[1]
  );
  points = [...points, ...generateNormalRandomPoints(50, 50, 40, 40, 1000)];

  points = [...points, ...generateNormalRandomPoints(500, 500, 70, 70, 1000)];

  points = [...points, ...generateNormalRandomPoints(250, 250, 70, 70, 1000)];
  points = [
    ...points,
    ...generateUniformRandomPoints(1000, 0, DOMAIN_SIZE[0], 0, DOMAIN_SIZE[1]),
  ];

  let clusterer = new KMeans(points, 3, [0, DOMAIN_SIZE[0], 0, DOMAIN_SIZE[1]]);

  $: getClusterColor = generateRainbowColorFunction(k);

  $: clusterCenters =
    clusterer instanceof KMeans ? clusterer.getClusterCenters() : [];
</script>

<div>
  <h1 class="font-mono text-4xl mt-2">K-Means</h1>
  <div class="my-2" />
  <PointRenderer
    {points}
    coloringFunction={getClusterColor}
    {clusterCenters}
    dimensionsConfiguration={{
      pointxMax: DOMAIN_SIZE[0],
      pointxMin: 0,
      pointyMax: DOMAIN_SIZE[1],
      pointyMin: 0,
    }}
    {euclideanFractal}
    on:pointsChanged={(p) => {
      points = p.detail;
      clusterer = new KMeans(
        points,
        k,
        [0, DOMAIN_SIZE[0], 0, DOMAIN_SIZE[1]],
        clusterer.getClusterCenters()
      );
    }}
  />
  <button
    class="bg-bismark-500 text-bismark-100 hover:text-bismark-300 rounded-md px-4 py-2 my-2"
    on:click={() => {
      clusterer.clusterStep();
      points = clusterer.getClusters();
      clusterCenters =
        clusterer instanceof KMeans ? clusterer.getClusterCenters() : [];
    }}>1 Step</button
  >
  <button
    class="bg-bismark-500 text-bismark-100 hover:text-bismark-300 rounded-md px-4 py-2 my-2"
    on:click={() => {
      clusterer.clusterAllSteps();
      points = clusterer.getClusters();
      clusterCenters =
        clusterer instanceof KMeans ? clusterer.getClusterCenters() : [];
    }}>Run all steps</button
  >
  <label for="k">K=</label>
  <input
    id="k"
    class="border border-bismark-200 rounded px-2"
    type="number"
    value={k}
    on:input={(e) => (k = parseInt(e.currentTarget.value))}
    on:input={(e) =>
      (clusterer = new KMeans(points, parseInt(e.currentTarget.value), [
        0,
        DOMAIN_SIZE[0],
        0,
        DOMAIN_SIZE[1],
      ]))}
  />

  <label for="cluster-assignments">Show cluster reach</label>
  <input
    id="cluster-assignments"
    type="checkbox"
    on:input={(e) => (euclideanFractal = e.currentTarget.checked)}
  />
  <div>
    <h2 class="font-mono text-2xl mt-2">Theory</h2>
    <div>
      K-Means clusters by minimizing the distances of the points to the cluster
      center.
    </div>
    <div class="w-full flex items-center justify-center py-2">
      {@html Katex.renderToString(
        "\\underset{(C_1,\\mu_1),...,(C_k,\\mu_k)}{argmin}\\sum_{i=1}^k\\|x_i - \\mu_i\\|",
        {}
      )}
    </div>
    <div>Local minima of this can be found by an iterative algorithm:</div>
    <ol class="list-decimal px-6">
      <li>Assign means randomly</li>
      <li>
        Cluster points according to which cluster center (mean) is closest
      </li>
      <li>Recalculate means based on the points assigned to them</li>
      <li>Repeat, until the means do not change</li>
    </ol>
  </div>
</div>
