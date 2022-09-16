<script>
	export let href = './';
	export let isCurrent = false;
</script>

{#if isCurrent}
	<li aria-current="page">
		<slot />
	</li>
{:else}
	<li>
		<a {href}>
			<slot />
		</a>
	</li>
{/if}

<style>
	li {
		flex-shrink: 0;
	}

	li:not(:last-child)::after {
		content: '/';
		padding: 0 var(--size-2);
	}
</style>
