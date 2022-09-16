<script>
	import { code } from '@src/data.js';
	import Layout from '@src/pages/layout.svelte';

	const { id, name } = code;
</script>

<Layout>
	<div class="group u-m-top-6">
		<h2 class="u-m-top-0">{name}</h2>
		<p class="u-m-0">
			<span class="u-color-hint">ID:</span>
			{id}
		</p>
	</div>
	<form method="post">
		<input type="hidden" name="id" value={id} />
		<div class="u-m-top-6">
			<button class="button button--primary" type="submit">
				Join organization
			</button>
		</div>
	</form>
</Layout>
