<script lang="ts">
  import Hierarchical from "./components/Hierarchical.svelte";
  import KMeans from "./components/KMeans.svelte";
  import Navbar from "./components/Navbar.svelte";
  let currentPage = "KMeans";
</script>

<main class="bg-bismark-200 min-h-screen">
  <Navbar
    pages={["KMeans", "Hierarchical"]}
    {currentPage}
    on:pageChanged={(e) => (currentPage = e.detail)}
  />
  <div class="container mx-auto">
    {#if currentPage === "KMeans"}
      <KMeans />
    {:else if currentPage === "Hierarchical"}
      <Hierarchical />
    {/if}
  </div>
</main>
