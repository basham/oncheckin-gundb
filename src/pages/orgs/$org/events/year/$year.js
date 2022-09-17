import { computeOrg } from '@src/api/org-signal.js';

export async function get({ data }) {
	const { org, year } = data;
	const h1 = `Events in ${year}`;
	const { eventsByYear } = await computeOrg(org.id);
	const events = eventsByYear.get(year);
	const template = { h1, events };
	return { template };
}
