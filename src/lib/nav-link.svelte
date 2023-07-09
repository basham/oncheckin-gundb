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
		_font-weight: bold;
		text-decoration: none;
		text-decoration-thickness: var(--px-2);
		text-underline-offset: var(--size-5);
	}

	a[aria-current] {
		color: inherit;
		text-decoration: underline;
	}

	a:hover {
		text-decoration: underline;
		_color: var(--color-base-15);
	}
</style>
