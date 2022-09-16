<script>
	import { checkIns } from '@src/data.js';
	import { pluralize } from '@src/util.js';
	import Layout from './layout.svelte';

	/*
  const checkInsByYear = (await checkInStore.getParticipantCheckIns(docId, participantId))
    .filter(({ host }) => host)
    .reduce((yearMap, checkIn) => {
      const { year } = checkIn.event
      if (!yearMap.has(year)) {
        yearMap.set(year, [])
      }
      yearMap.set(year, [...yearMap.get(year), checkIn])
      return yearMap
    }, new Map())
  checkIns = [...checkInsByYear]
  */
</script>

<Layout>
	{#if !checkIns.length}
		<h2>No hares</h2>
	{/if}
	{#each checkIns as [year, checkInsThisYear]}
		<h2>
			{year}
			<span class="badge">{checkInsThisYear.length}</span>
		</h2>
		<ul class="list-plain u-gap-2px u-m-top-2">
			{#each checkInsThisYear as checkIn}
				<li class="row">
					<a class="row__left" href={checkIn.event.url}>
						<span class="row__primary">{checkIn.event.name}</span>
						<span class="row__secondary u-text-num">
							{`#${checkIn.event.count}: ${checkIn.event.displayDateMedium}`}
						</span>
						<span class="row__tertiary u-text-num">
							{`${checkIn.hostCount} ${pluralize(checkIn.hostCount, 'hare')}`}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/each}
</Layout>
