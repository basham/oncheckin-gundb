const checkInIdDelimiter = '-';

export function decodeCheckInId(id) {
	const [eventId, participantId] = id.split(checkInIdDelimiter);
	return { eventId, participantId };
}

export function encodeCheckInId(eventId, participantId) {
	return [eventId, participantId].join(checkInIdDelimiter);
}
