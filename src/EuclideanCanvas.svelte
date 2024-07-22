<script lang="ts">
  import { onMount } from "svelte";
  import type { Point2D } from "./Point";
  import { colorNameToHex, hexToRgb } from "./Util";

  export let clusterCenters: Point2D[];
  export let dimensions: [number, number];
  export let coloringFunction: (v: string) => string;
  export let dimensionsConfiguration: {
    pointxMin: number;
    pointxMax: number;
    pointyMin: number;
    pointyMax: number;
  };

  let canvas: HTMLCanvasElement;

  function getPixelColor(x: number, y: number, clusterCenters: Point2D[]) {
    // determine which cluster-center the point is closest to
    let closestClusterData = "";
    let closestDistance = Infinity;
    for (let i = 0; i < clusterCenters.length; i++) {
      const clusterCenter = clusterCenters[i];
      const distance = Math.sqrt(
        Math.pow(x - clusterCenter.x, 2) + Math.pow(y - clusterCenter.y, 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestClusterData = clusterCenter.data ?? "0";
      }
    }
    return closestClusterData;
  }

  function translateCentroids() {
    const tX = (v: number) =>
      (v /
        (dimensionsConfiguration.pointxMax -
          dimensionsConfiguration.pointxMin)) *
        canvas.width +
      dimensionsConfiguration.pointxMin;
    const tY = (v: number) =>
      (v /
        (dimensionsConfiguration.pointyMax -
          dimensionsConfiguration.pointyMin)) *
        canvas.height +
      dimensionsConfiguration.pointyMin;
    return clusterCenters.map((c) => ({
      ...c,
      x: tX(c.x),
      y: tY(c.y),
    })) as Point2D[];
  }

  onMount(() => {
    const translatedCentroids = translateCentroids();
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2d context");
    }
    const imageData = ctx.createImageData(dimensions[0], dimensions[1]);
    // fill in each pixel
    for (let x = 0; x < dimensions[0]; x++) {
      for (let y = 0; y < dimensions[1]; y++) {
        const pixelColor = coloringFunction(
          getPixelColor(x, y, translatedCentroids)
        );
        const hexColor = colorNameToHex(pixelColor);
        const rgbColor = hexToRgb(hexColor) ?? { r: 0, g: 0, b: 0 };
        const pixelIndex = (y * dimensions[0] + x) * 4;
        imageData.data[pixelIndex] = rgbColor.r;
        imageData.data[pixelIndex + 1] = rgbColor.g;
        imageData.data[pixelIndex + 2] = rgbColor.b;
        imageData.data[pixelIndex + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  });
</script>

<canvas
  bind:this={canvas}
  width={dimensions[0]}
  height={dimensions[1]}
  style="background-color: wheat;"
/>
