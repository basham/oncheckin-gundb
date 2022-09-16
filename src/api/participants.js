import { getOrCreate, sortAsc } from '@src/util.js';
import { getOrgParticipants } from './org.js';
import { getParticipant } from './participant.js';
import { cache } from './store.js';

export async function getParticipants(orgId) {
	//return getOrCreate(cache, `participants:${orgId}`, async () => {
	const participants = await getOrgParticipants(orgId);
	const all = [];
	for (const participantId of participants) {
		const participant = await getParticipant(orgId, participantId);
		all.push(participant);
	}
	return all.sort(sortAsc('displayName'));
	//})
}
