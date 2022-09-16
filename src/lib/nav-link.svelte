<script>
	export let href;
	export let id = null;
	export let location = null;
</script>

<a aria-current={location === id ? 'page' : null} {href}>
	<slot />
</a>

<style>
	a {
		display: inline-block;
		font-weight: bold;
		line-height: var(--lh-2);
		padding: var(--size-1) 0;
		text-decoration: none;
	}

	a[aria-current] {
		box-shadow: 0 var(--px-2) 0 0 currentColor;
	}

	a:focus {
		outline-offset: var(--size-1);
	}

	a:hover {
		color: var(--color-base-20);
	}
</style>
