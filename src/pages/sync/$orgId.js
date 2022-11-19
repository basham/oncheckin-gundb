export async function get({ data }) {
	const { orgId: id } = data;
	const url = `/orgs/${id}/`;
	const org = { id, url };
	const h1 = 'Syncing organization…';
	const template = { h1, org };
	return { template };
}
