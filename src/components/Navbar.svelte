<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import FaviconNew from "../assets/FaviconNew.svg";
  export let pages: string[];
  export let currentPage: string;

  const dispatch = createEventDispatcher<{ pageChanged: string }>();

  function handleClick(page: string) {
    currentPage = page;
    dispatch("pageChanged", page);
  }
</script>

<nav class="bg-bismark-500 py-4">
  <div class="container mx-auto flex gap-4">
    <div class="flex gap-2 items-center">
      <img src={FaviconNew} class="h-8 w-8" alt="logo" />
      <h1 class="font-mono text-2xl">ClusterVis</h1>
    </div>

    {#each pages as page}
      <button
        class={"text-bismark-100 hover:text-bismark-300 rounded-md px-4 py-2 " +
          (page === currentPage ? "bg-bismark-700" : "")}
        on:click={() => handleClick(page)}
      >
        {page}
      </button>
    {/each}
  </div>
</nav>
