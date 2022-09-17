import { getParticipantCheckIns } from '@src/api.js';

export async function get({ data }) {
	const { org, participant } = data;
	const h1 = participant.displayName;
	const checkInsByYear = (await getParticipantCheckIns(org.id, participant.id))
		.reduce((yearMap, checkIn) => {
			const { year } = checkIn.event;
			if (!yearMap.has(year)) {
				yearMap.set(year, []);
			}
			yearMap.set(year, [...yearMap.get(year), checkIn]);
			return yearMap;
		}, new Map());
	const checkIns = [...checkInsByYear];
	const latestCheckIn = null;
	const template = { h1, checkIns, latestCheckIn };
	return { template };
}
