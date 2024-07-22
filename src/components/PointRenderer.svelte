<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import EuclideanCanvas from "../EuclideanCanvas.svelte";
  import {
    generateNormalRadius,
    generateNormalRandomPoints,
    type Point2D,
  } from "../Point";
  export let points: Point2D[];
  export let coloringFunction: (v: string) => string;
  export let clusterCenters: Point2D[] | null = null;
  export let dimensionsConfiguration: {
    pointxMin: number;
    pointxMax: number;
    pointyMin: number;
    pointyMax: number;
  };
  export let euclideanFractal = false;

  const dispatch = createEventDispatcher<{ pointsChanged: Point2D[] }>();

  // div should have maximum of 80vh and 80vw
  // so that the canvas is not too large
  let canvasWidth = 10;
  let canvasHeight = 10;

  onMount(() => {
    const maxDim = Math.round(
      Math.min(
        document.documentElement.clientHeight * 0.7,
        document.documentElement.clientWidth * 0.7
      )
    );
    canvasWidth = maxDim;
    canvasHeight = maxDim;
  });

  type SelectedTool = "SinglePoint" | "PointCloud" | "RingCloud";

  let selectedTool: SelectedTool = "SinglePoint";
  let svgElement: SVGElement;

  function clearPoints() {
    dispatch("pointsChanged", []);
  }

  function svgToDomain(x: number, y: number): [number, number] {
    const svgRect = svgElement.getBoundingClientRect();
    const svgX = x - svgRect.x;
    const svgY = y - svgRect.y;

    const normX = svgX / svgRect.width;
    const normY = svgY / svgRect.height;

    const xDomain =
      dimensionsConfiguration.pointxMax - dimensionsConfiguration.pointxMin;
    const yDomain =
      dimensionsConfiguration.pointyMax - dimensionsConfiguration.pointyMin;

    const transformedX = normX * xDomain;
    const transformedY = normY * yDomain;

    return [transformedX, transformedY];
  }

  function createPointCloud(x: number, y: number, n = 200) {
    const domainQuantile = 25;
    const stdX =
      (dimensionsConfiguration.pointxMax - dimensionsConfiguration.pointxMin) /
      domainQuantile;
    const stdY =
      (dimensionsConfiguration.pointyMax - dimensionsConfiguration.pointyMin) /
      domainQuantile;

    const newPoints = generateNormalRandomPoints(x, y, stdX, stdY, n);
    dispatch("pointsChanged", [...points, ...newPoints]);
  }

  function createRingCloud(x: number, y: number) {
    const radiusQuantile = 3;
    const radius =
      Math.min(
        dimensionsConfiguration.pointxMax - dimensionsConfiguration.pointxMin,
        dimensionsConfiguration.pointyMax - dimensionsConfiguration.pointyMin
      ) / radiusQuantile;

    const newPoints = generateNormalRadius(
      x,
      y,
      radius,
      radiusQuantile * 4,
      200
    );
    dispatch("pointsChanged", [...points, ...newPoints]);
  }

  function handleSvgClick(e: MouseEvent) {
    // get svg screen coordinates
    const transformedCoords = svgToDomain(e.x, e.y);
    switch (selectedTool) {
      case "SinglePoint":
        dispatch("pointsChanged", [
          ...points,
          { x: transformedCoords[0], y: transformedCoords[1] },
        ]);
        break;
      case "PointCloud":
        createPointCloud(transformedCoords[0], transformedCoords[1]);
        break;
      case "RingCloud":
        createRingCloud(transformedCoords[0], transformedCoords[1]);
        break;
    }
  }
</script>

<div>
  <div class="flex items-center justify-center gap-4">
    <button on:click={clearPoints}>Clear 🗑️</button>
    <button
      on:click={() => (selectedTool = "SinglePoint")}
      class={"toolButton " + (selectedTool === "SinglePoint" ? "active" : "")}
      >Single Point</button
    >
    <button
      on:click={() => (selectedTool = "PointCloud")}
      class={"toolButton " + (selectedTool === "PointCloud" ? "active" : "")}
      >Point Cloud</button
    >
    <button
      on:click={() => (selectedTool = "RingCloud")}
      class={"toolButton " + (selectedTool === "RingCloud" ? "active" : "")}
      >Ring Cloud</button
    >
  </div>
  <div
    class="border border-bismark-200 rounded overflow-hidden mx-auto"
    style="height: {canvasHeight}px; width: {canvasWidth}px"
  >
    {#if euclideanFractal && clusterCenters}
      <EuclideanCanvas
        {clusterCenters}
        {coloringFunction}
        dimensions={[canvasWidth, canvasHeight]}
        {dimensionsConfiguration}
      />
    {:else}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <svg
        viewBox="{dimensionsConfiguration.pointxMin} {dimensionsConfiguration.pointyMin} {dimensionsConfiguration.pointxMax} {dimensionsConfiguration.pointyMax}"
        class=" bg-bismark-50 w-full shadow-lg"
        bind:this={svgElement}
        on:click={handleSvgClick}
      >
        {#each points as point}
          <circle
            cx={point.x}
            cy={point.y}
            r="3"
            fill={coloringFunction(point.data ?? "")}
          />
        {/each}
        {#if clusterCenters}
          {#each clusterCenters as point}
            <circle
              cx={point.x}
              cy={point.y}
              r="10"
              stroke="black"
              stroke-width="2"
              fill={coloringFunction(point.data ?? "")}
            />
          {/each}
        {/if}
      </svg>
    {/if}
  </div>
</div>

<style lang="postcss">
  .toolButton {
    @apply bg-bismark-300 p-2 rounded;
  }

  .active {
    @apply bg-bismark-900 text-white font-bold;
  }
</style>
