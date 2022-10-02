<script>
	import { h1, org } from '@src/data.js';
	import Layout from '@src/pages/orgs/$org/layout.svelte';
</script>

<Layout>
	<h1>{h1}</h1>
	<form autocomplete="off" method="post">
		<div class="u-m-top-4">
			<label for="countField">Event count</label>
			<br />
			<input
				class="input u-mw-3"
				id="countField"
				name="count"
				min="0"
				type="number"
				value={org.eventCount}
			/>
		</div>
		<div class="u-m-top-4">
			<button class="button button--primary" type="submit">Save</button>
		</div>
	</form>
</Layout>
