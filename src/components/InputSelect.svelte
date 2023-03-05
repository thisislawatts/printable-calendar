<script>
	/**
	 * @type {string}
	 */
	export let label;
	export let value = 1;
	/**
	 * @type {string[]}
	 */
	export let options = [];
</script>

<div>
	<label for={label}>{label}</label>

	<select name={label} id={label} bind:value>
		{#each options as label, idx}
			<option value={`${idx + 1}`}>{label}</option>
		{/each}
	</select>
</div>

<style>
</style>
