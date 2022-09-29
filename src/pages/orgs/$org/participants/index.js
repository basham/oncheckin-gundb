import { computeOrg } from '@src/api/org-signal.js';

export async function get({ data }) {
	const { org } = data;
	const h1 = 'Hashers';
	const { participants } = await computeOrg(org.id);
	const template = { h1, participants };
	return { template };
}
