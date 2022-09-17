import { computeOrg } from '@src/api/org-signal.js';

export async function get({ data }) {
	const { org } = data;
	const { events: json } = await computeOrg(org.id);
	return { json };
}
