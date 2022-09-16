<script>
	let active = false;
	let duration = 3000;
	let message = '';

	export function dispatch(msg) {
		message = msg;
		active = true;
		setTimeout(() => {
			active = false;
		}, duration);
	}
</script>

<div class="toast" class:toast--active={active} role="status">
	{message}
</div>

<style>
	.toast {
		background-color: var(--color-base-20);
		border-top: var(--px-1) solid var(--color-base-95);
		color: var(--color-base-95);
		left: 0;
		padding: var(--size-4);
		position: fixed;
		top: 100%;
		transform: translateY(0);
		transition: transform 250ms;
		width: 100%;
	}

	.toast--active {
		transform: translateY(-100%);
	}
</style>
