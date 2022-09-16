import { deleteCheckIn, getCheckIn, setCheckIn } from '@src/api.js';

export async function get({ data }) {
	const { org, event, participant } = data;
	const h1 = event.name;
	const h2 = 'Edit check-in';
	const checkIn = await getCheckIn(org.id, event.id, participant.id);
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
