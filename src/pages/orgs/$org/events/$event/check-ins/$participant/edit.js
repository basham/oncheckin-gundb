import { deleteCheckIn, setCheckIn } from '@src/api.js';
import { computeOrg } from '@src/api/org-signal.js';
import { encodeCheckInId } from '@src/api/util.js';

export async function get({ data }) {
	const { org, event, participant } = data;
	const h1 = event.name;
	const h2 = 'Edit check-in';
	const { checkInsById } = await computeOrg(org.id);
	const id = encodeCheckInId(participant.id, event.id);
	const checkIn = checkInsById.get(id);
	const template = { h1, h2, checkIn };
	return { template };
}

export async function post({ data, request }) {
	const { org, event, participant } = data;
	const formData = await request.formData();
	const action = formData.get('action');
	if (action === 'edit') {
		const host = formData.get('host');
		await setCheckIn(org.id, event.id, participant.id, { host });
	}
	if (action === 'delete') {
		await deleteCheckIn(org.id, event.id, participant.id);
	}
	return { redirect: event.url };
}
