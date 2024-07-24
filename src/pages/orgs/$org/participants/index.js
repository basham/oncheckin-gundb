import { computeOrg } from '@src/api/org-signal.js';

const namedValues = 'true|false|ready'.split('|');
const sortValues = 'event|attendance|host|name'.split('|');

export async function get({ data }) {
	const { org } = data;
	const params = {
		named: namedValues.includes(data.named) ? data.named : namedValues[0],
		sort: sortValues.includes(data.sort) ? data.sort : sortValues[0]
	};
	const h1 = 'Hashers';
	const {
		participants: allParticipants,
		checkInsByParticipantId
	} = await computeOrg(org.id);

	const participants = allParticipants
		.map((p) => {
			const participantCheckIns = checkInsByParticipantId.get(p.id)
			const lastCheckIn = participantCheckIns[0];
			const lastEvent = lastCheckIn?.event;
			const latestCheckIn = lastCheckIn || {};
			const { hostCount = 0, runCount = 0 } = latestCheckIn;
			const namedStatus = getNamedStatus({ alias: p.alias, runCount });
			return {
				...p,
				lastEvent,
				hostCount,
				runCount,
				namedStatus
			};
		})
		.filter((p) => p.namedStatus === params.named);

	const template = { h1, params, participants };
	return { template };
}

function getNamedStatus ({ alias, runCount }) {
	if (alias) {
		return 'true';
	}
	if (runCount >= 5) {
		return 'ready';
	}
	return 'false';
}
