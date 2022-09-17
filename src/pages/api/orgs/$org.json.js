import { computeOrg } from '@src/api/org-signal.js';

export async function get({ data }) {
	const { org } = data;
	const { org: json } = await computeOrg(org.id);
	return { json };
}
