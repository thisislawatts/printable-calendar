<script>
  // your script goes here
  export let label;
  export let value = 1;
  export let unit = null;
</script>

<label for="">{label}</label>

<div>
  <button on:click={() => value--}>-</button>
  <input bind:value type="number" min="1" />
  {#if unit}
    <span>{unit}</span>
  {/if}
  <button on:click={() => value++}>+</button>
</div>

<style>
  /* your styles go here */
</style>
