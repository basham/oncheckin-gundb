<script>
	import { h1, org, params, participants } from '@src/data.js';
	import Layout from '@src/pages/orgs/$org/layout.svelte';
	import Participants from '@src/lib/participants.svelte';
	import Icon from '@src/lib/icon.svelte';
	import { pluralize, sortDesc } from '@src/util.js'

	const location = document.location.toString();
	const filters = [
		['Named', 'named', 'true'],
		['Not named', 'named', 'false'],
		['Ready for name', 'named', 'ready'],
		['By last event', 'sort', 'event'],
		['By hashes', 'sort', 'attendance'],
		['By hares', 'sort', 'host'],
		['By name', 'sort', 'name']
	].map(([label, key, value]) => {
		const { searchParams } = new URL(location);
		const active = params[key] === value;
		if (active) {
			searchParams.delete(key);
		} else {
			searchParams.set(key, value);
		}
		const url = `?${searchParams}`;
		return { active, label, url };
	});

	const groups = sortByEvent();

	function sortByEvent () {
		const events = new Map();
		const groups = new Map();
		participants.forEach((p) => {
			if (!p.lastEvent) {
				return;
			}
			const { id } = p.lastEvent;
			if (!events.has(id)) {
				events.set(id, p.lastEvent);
			}
			if (!groups.has(id)) {
				groups.set(id, new Set());
			}
			groups.get(id).add(p);
		});
		return [...events.values()]
			.sort(sortDesc('count'))
			.map((event) => {
				const { displayDateLong: name, count, id, url } = event;
				const description = `#${count}`;
				const items = [...groups.get(id).values()];
				return {
					name,
					description,
					url,
					items
				};
			});
	}
</script>

<Layout>
	<div class="u-flex u-flex-end u-flex-space">
		<h1>{h1}</h1>
		<div>
			<a class="button button--primary" href={`${org.url}participants/new/`}>
				New hasher
			</a>
		</div>
	</div>
	<h2>Filter</h2>
	<ul class="list-plain list-plain--inline u-gap-2px u-m-top-2">
		{#each filters as filter}
			<li class="row">
				<a
					aria-current={filter.active ? 'true' : null}
					class="row__left"
					href={`${filter.url}`}
				>
					<span class="row__primary u-flex u-flex-center u-gap-2">
						<span>{filter.label}</span>
						{#if filter.active}
							<Icon name="close" />
							<span class="u-sr-only">(clear)</span>
						{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>
	<h2 class="u-text-normal u-ts-1">Showing {participants.length} {pluralize(participants.length, 'result')}</h2>
	{#each groups as group}
		<h3 class="h2">
			{group.name}
			{#if group.url}
				<a class="badge" href={group.url}>{group.description}</a>
			{:else}
				<span class="badge">{group.description}</span>
			{/if}
		</h3>
		<Participants participants={group.items} />
	{/each}
</Layout>
