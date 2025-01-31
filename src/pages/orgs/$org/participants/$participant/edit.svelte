<script>
	import { h2, participant } from '@src/data.js';
	import Fieldset from '@src/lib/fieldset.svelte';
	import FieldsetParticipantName from '@src/lib/fieldset-participant-name.svelte';
	import Layout from './layout.svelte';

	const { alias, fullName, location, notes } = participant;
</script>

<Layout>
	<h2>{h2}</h2>
	<form autocomplete="off" method="post">
		<Fieldset legend="Name">
			<FieldsetParticipantName {alias} {fullName} />
		</Fieldset>
		<Fieldset legend="Details">
			<div class="u-m-top-4">
				<label for="locationField">Location</label>
				<br />
				<input
					class="input"
					id="locationField"
					name="location"
					type="text"
					value={location}
				/>
			</div>
			<div class="u-m-top-4">
				<label for="notesField">Notes</label>
				<br />
				<textarea
					class="input"
					id="notesField"
					name="notes"
					rows="5"
					value={notes}
				></textarea>
			</div>
		</Fieldset>
		<div class="u-m-top-4">
			<button class="button button--primary" type="submit">Save</button>
		</div>
		<p class="u-m-top-4"><a href={participant.url}>Back</a></p>
	</form>
</Layout>
