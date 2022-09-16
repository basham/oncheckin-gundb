<script>
	import Icon from './icon.svelte';

	export let filter = () => true;
	export let id = 'lookup';
	export let isSelected = () => false;
	export let label = '';
	export let onSelected = () => {};
	export let options = [];
	export let render = () => {};

	const inputId = `${id}-input`;
	const labelId = `${id}-label`;
	const listboxId = `${id}-listbox`;
	const optionId = `${id}-option`;
	const maxResults = 10;

	let query = '';
	let results = [];
	let selectedIndex = 0;

	$: resultsCount = results.length;

	function handleInput(event) {
		const { value } = event.target;
		results = options
			.filter((option) => filter(value.trim(), option))
			.slice(0, maxResults);
		query = value;
		selectedIndex = 0;
	}

	function handleKeyDown(event) {
		const { key } = event;
		const i = selectedIndex;
		const lastIndex = resultsCount - 1;
		switch (key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = i === lastIndex ? 0 : i + 1;
				return;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = i === 0 ? lastIndex : i - 1;
				return;
			case 'Enter':
				event.preventDefault();
				select();
				return;
			case 'Escape':
				query = '';
				return;
		}
	}

	function handleOptionClick() {
		select();
	}

	function handleOptionMouseOver(event) {
		selectedIndex = parseInt(event.target.dataset.index);
	}

	function select() {
		if (results.length > 0) {
			onSelected(results[selectedIndex]);
			query = '';
		}
	}
</script>

<div class={$$props.class}>
	<label for={inputId} id={labelId}>
		{label}
	</label>
	<div
		aria-expanded={false}
		aria-haspopup="listbox"
		aria-owns={listboxId}
		role="combobox"
	>
		<input
			aria-activedescendant={`${optionId}-${selectedIndex}`}
			aria-autocomplete="list"
			aria-controls={listboxId}
			autocomplete="off"
			class="input"
			id={inputId}
			on:input={handleInput}
			on:keydown={handleKeyDown}
			type="text"
			value={query}
		/>
	</div>
	{#if resultsCount && query.length}
		<ul aria-labelledby={labelId} class="listbox" id={listboxId} role="listbox">
			{#each results as option, i}
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<li
					aria-selected={i === selectedIndex}
					class="option"
					data-index={i}
					id={`${optionId}-${i}`}
					on:click={handleOptionClick}
					on:mouseover={handleOptionMouseOver}
					role="option"
				>
					<Icon name="check" visible={isSelected(option)} />
					{@html render(option)}
				</li>
			{/each}
		</ul>
	{:else if !resultsCount && query.length}
		<div class="listbox">
			<div class="noResults" role="alert">No results</div>
		</div>
	{/if}
</div>

<style>
	.listbox {
		background-color: var(--color-base-80);
		border: var(--px-1) solid var(--color-base-95);
		border-radius: var(--size-1);
		line-height: var(--lh-1);
		list-style-type: none;
		margin: var(--size-1) 0 0;
		min-width: 16rem;
		padding: var(--size-1);
		position: absolute;
		width: max-content;
	}

	.option {
		align-items: center;
		cursor: pointer;
		display: flex;
		gap: var(--size-2);
		padding: var(--size-1) var(--size-8) var(--size-1) var(--size-2);
	}

	.option[aria-selected='true'] {
		background-color: var(--color-ix);
		border-radius: var(--size-1);
		color: var(--color-base-95);
	}

	.noResults {
		padding: var(--size-1) var(--size-2);
	}
</style>
