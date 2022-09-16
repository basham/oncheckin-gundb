import { getOrCreate } from '@src/util.js';
import { getOrCreateParticipant, getOrg, hasParticipant } from './org.js';
import { cache, createId } from './store.js';

export async function createParticipant(orgId, values) {
	return await setParticipant(orgId, createId(), values);
}

export async function getParticipant(orgId, participantId) {
	//return getOrCreate(cache, `participant:${orgId}/${participantId}`, async () => {
	if (!(await hasParticipant(orgId, participantId))) {
		return undefined;
	}
	const org = await getOrg(orgId);
	const data = await getOrCreateParticipant(orgId, participantId);
	const alias = data.get('alias') || '';
	const displayName = data.get('alias') || `Just ${data.get('fullName')}`;
	const fullName = data.get('fullName') || '(Participant)';
	const location = data.get('location') || '';
	const notes = data.get('notes') || '';
	// const recordedLastCheckInDateObj = data.get('recordedLastCheckInDate') ? parseISO(data.get('recordedLastCheckInDate')) : null
	// const recordedLastCheckInDateDisplay = recordedLastCheckInDateObj ? format(recordedLastCheckInDateObj, 'PP') : ''
	const url = `${org.url}participants/${participantId}/`;
	return {
		id: participantId,
		alias,
		displayName,
		fullName,
		location,
		notes,
		// recordedLastCheckInDateDisplay,
		// recordedLastCheckInDateObj,
		url,
	};
	//})
}

export async function setParticipant(orgId, participantId, values) {
	cache.delete(`participants:${orgId}`);
	cache.delete(`participant:${orgId}/${participantId}`);
	const participant = await getOrCreateParticipant(orgId, participantId);
	participant.doc.transact(() => {
		for (const [key, value] of Object.entries(values)) {
			participant.set(key, value);
		}
	});
	return await getParticipant(orgId, participantId);
}
