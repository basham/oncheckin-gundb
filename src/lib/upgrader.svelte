<script>
	// import { registerSW } from 'virtual:pwa-register';
	import Icon from './icon.svelte';

	const { registerSW } = window;

	const IDLE = Symbol();
	const PROMPT = Symbol();
	const UPGRADING = Symbol();

	let state = IDLE;

	const updateSW = registerSW({
		onNeedRefresh() {
			state = PROMPT;
		},
	});

	function upgrade() {
		state = UPGRADING;
		updateSW();
	}

	function dismiss() {
		state = IDLE;
	}
</script>

{#if state === PROMPT}
	<div class="prompt">
		<div class="message u-ts-2">New version available</div>
		<div class="buttons">
			<button class="button button--primary button--small" on:click={upgrade}>
				Upgrade
			</button>
			<button
				aria-label="Dismiss"
				class="button button--small"
				on:click={dismiss}
			>
				<Icon name="close" />
			</button>
		</div>
	</div>
{/if}

{#if state === UPGRADING}
	<div class="prompt">
		<div class="message u-ts-2">Upgrading&hellip;</div>
	</div>
{/if}

<style>
	.prompt {
		align-items: center;
		background-color: var(--color-base-80);
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-2);
		justify-content: space-between;
		padding: var(--size-4);
	}

	.message {
		padding: var(--size-1) 0;
	}

	.buttons {
		display: flex;
		gap: var(--size-4);
	}
</style>
