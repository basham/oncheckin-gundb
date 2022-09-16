export async function get({ data }) {
	const { participant } = data;
	const h1 = participant.displayName;
	const checkIns = [];
	const template = { h1, checkIns };
	return { template };
}
