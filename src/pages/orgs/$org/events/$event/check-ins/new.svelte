<script>
	import { h2, event, participants } from '@src/data.js';
	import { focus } from '@src/util.js';
	import Fieldset from '@src/lib/fieldset.svelte';
	import FieldsetCheckIn from '@src/lib/fieldset-check-in.svelte';
	import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte';
	import Icon from '@src/lib/icon.svelte';
	import Lookup from '@src/lib/lookup.svelte';
	import RadioGroup from '@src/lib/radio-group.svelte';
	import Layout from '../layout.svelte';

	let checkInType = 'existing-participant';
	let selectedParticipant = null;

	function filterResult(query, participant) {
		const terms = [participant.fullName, participant.displayName].join(' ');
		return terms.toLowerCase().indexOf(query.toLowerCase()) !== -1;
	}

	function selectParticipant(participant) {
		if (participant.checkedIn) {
			window.location = participant.checkIn.url;
			return;
		}

		selectedParticipant = participant;
		focus('unselect-participant');
	}

	function unselectParticipant() {
		selectedParticipant = null;
		focus('find-participant-input');
	}

	function submit(e) {
		if (!selectedParticipant && checkInType === 'existing-participant') {
			e.preventDefault();
			focus('find-participant-input');
		}
	}
</script>

<Layout>
	<h2>{h2}</h2>
	<form autocomplete="off" method="post" on:submit={submit}>
		<RadioGroup
			bind:value={checkInType}
			legend="Check in"
			name="checkInType"
			options={['Existing participant', 'New participant']}
		/>
		{#if checkInType === 'existing-participant'}
			{#if !selectedParticipant}
				<Fieldset>
					<Lookup
						class="find-participant"
						filter={filterResult}
						id="find-participant"
						isSelected={({ checkedIn }) => checkedIn}
						label="Find participant"
						onSelected={selectParticipant}
						options={participants}
						render={({ displayName, fullName }) =>
							`${displayName} (${fullName})`}
					/>
				</Fieldset>
			{:else}
				<Fieldset>
					<div class="participant">
						<div class="name" id="selectedParticipantName">
							<div class="u-ts-2">{selectedParticipant.displayName}</div>
							<div>{selectedParticipant.fullName}</div>
						</div>
						<input
							type="hidden"
							name="selectedParticipant"
							value={selectedParticipant.id}
						/>
						<button
							aria-label="Unselect"
							aria-describedby="selectedParticipantName"
							class="button button--small"
							id="unselect-participant"
							on:click={unselectParticipant}
							type="button"
						>
							<Icon name="close" />
						</button>
					</div>
				</Fieldset>
			{/if}
		{/if}
		{#if checkInType === 'new-participant'}
			<Fieldset legend="New participant">
				<div class="u-m-top-4">
					<FieldsetParticipantName />
				</div>
			</Fieldset>
		{/if}
		<FieldsetCheckIn />
		<div class="u-m-top-4">
			<button class="button button--primary" type="submit">Save</button>
		</div>
		<p class="u-m-top-4"><a href={event.url}>Back</a></p>
	</form>
</Layout>

<style>
	:global(.find-participant label) {
		font-size: var(--fs-2);
		line-height: var(--lh-2);
	}

	.participant {
		align-items: flex-start;
		display: flex;
	}

	.participant .name {
		flex-grow: 1;
	}
</style>
