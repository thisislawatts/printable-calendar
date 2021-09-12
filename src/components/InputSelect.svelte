<script>
  export let label;
  export let value = 1;
  export let options = [];
</script>

<div>
  <label for="">{label}</label>

  <select bind:value>
    {#each options as label, idx}
      <option value={idx + 1} selected={value == idx + 1}>{label}</option>
    {/each}
  </select>
</div>

<style>
</style>
