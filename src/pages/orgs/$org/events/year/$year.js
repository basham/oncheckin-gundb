import { getEventsByYear } from '@src/api.js';

export async function get({ data }) {
	const { org, year } = data;
	const h1 = `Events in ${year}`;
	const events = await getEventsByYear(org.id, year);
	const template = { h1, events };
	return { template };
}
