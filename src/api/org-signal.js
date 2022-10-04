import { format, isFuture, isPast, isToday, parseISO } from 'date-fns';
import { computed, signal, effect } from 'usignal';
import { getOrgDB } from './org';
import { getOrCreate, sortAsc, sortDesc } from '@src/util.js';

const cache = new Map();

export function computeOrg(orgId) {
	return getOrCreate(cache, orgId, () => calc(orgId));
}

async function calc(orgId) {
	const db = await getOrgDB(orgId);
	const data$ = signal(db.data, { equals: false });
	db.data.observeDeep(() => {
		data$.value = db.data;
	});
	const org$ = computed(() => getOrg(orgId, data$.value));
	const orgUrl$ = computed(() => org$.value.url);
	const eventCount$ = computed(() => org$.value.eventCount);
	const events$ = computed(() => getEvents(data$.value, orgUrl$.value, eventCount$.value));
	const eventsById$ = computed(() => {
		const entries = events$.value.map((e) => [e.id, e]);
		return new Map(entries);
	});
	const pastEvents$ = computed(() =>
		events$.value.filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
	);
	const upcomingEvents$ = computed(() =>
		events$.value
			.filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
			.reverse()
	);
	const eventsByYear$ = computed(() =>
		events$.value.reduce((map, event) => {
			const { year } = event;
			const yearEvents = getOrCreate(map, year, () => []);
			yearEvents.unshift(event);
			return map;
		}, new Map())
	);
	const eventYears$ = computed(() =>
		[...eventsByYear$.value.keys()].sort().reverse()
	);
	const participants$ = computed(() => getParticipants(data$.value, orgUrl$.value));
	const participantsById$ = computed(() => {
		const entries = participants$.value.map((p) => [p.id, p]);
		return new Map(entries);
	});
	const checkIns$ = computed(() => getCheckIns(data$.value, eventsById$.value, participants$.value));
	effect(() => console.log(checkIns$.value));
	const checkInsById$ = computed(() => checkIns$.value.checkInsById);
	const checkInsByEventId$ = computed(() => checkIns$.value.checkInsByEventId);
	const checkInsByParticipantId$ = computed(() => checkIns$.value.checkInsByParticipantId);
	return signalsToGetters({
		org$,
		eventsById$,
		events$,
		pastEvents$,
		upcomingEvents$,
		eventsByYear$,
		eventYears$,
		participants$,
		participantsById$,
		checkIns$,
		checkInsById$,
		checkInsByEventId$,
		checkInsByParticipantId$
	});
}

function signalsToGetters(signals) {
	return objectToGetters(
		signals,
		(k) => k.slice(0, -1),
		(s) => s.value
	);
}

function objectToGetters(source, getKey, getValue) {
	const entries = Object.entries(source).map(([k, v]) => [
		getKey(k),
		{
			get() {
				return getValue(v);
			},
		},
	]);
	const values = {};
	Object.defineProperties(values, Object.fromEntries(entries));
	return values;
}

function getOrg(id, data) {
	const settings = data.get('settings');
	const name = settings.get('name') || '(Organization)';
	const eventCount = settings.get('eventCount') || 0;
	const url = `/orgs/${id}/`;
	const openUrl = `${url}open/`;
	const inviteCode = self.btoa(JSON.stringify({ id, name }));
	const shareUrl = `${self.location.origin}/join/${inviteCode}/`;
	return {
		id,
		name,
		eventCount,
		openUrl,
		shareUrl,
		url,
	};
}

function getEvents(data, orgUrl, eventCount) {
	const events = [];
	for (const [id, e] of data.get('events')) {
		const event = getEvent(id, e, orgUrl);
		if (event) {
			events.push(event);
		}
	}
	return events
		.sort(sortDesc('dateObj'))
		.map((event, i) => {
			const count = eventCount - i;
			return { ...event, count };
		});
}

function getEvent(id, data, orgUrl) {
	const date = data.get('date');
	if (!date) {
		return undefined;
	}
	const dateObj = parseISO(date);
	const displayDate = format(dateObj, 'PP');
	const displayDateMedium = format(dateObj, 'E, MMM d');
	const displayDateLong = format(dateObj, 'E, PP');
	const year = format(dateObj, 'y');
	const name = data.get('name').trim() || '(Event)';
	const url = `${orgUrl}events/${id}/`;
	return {
		id,
		date,
		dateObj,
		displayDate,
		displayDateMedium,
		displayDateLong,
		name,
		url,
		year
	};
}

function getParticipants(data, orgUrl) {
	const participants = [];
	for (const [id, p] of data.get('participants')) {
		const participant = getParticipant(id, p, orgUrl);
		participants.push(participant);
	}
	return participants.sort(sortAsc('displayName'));
}

function getParticipant(id, data, orgUrl) {
	const alias = data.get('alias') || '';
	const displayName = data.get('alias') || `Just ${data.get('fullName')}`;
	const fullName = data.get('fullName') || '(Participant)';
	const location = data.get('location') || '';
	const notes = data.get('notes') || '';
	const runCount = data.get('runCount') || 0;
	const hostCount = data.get('hostCount') || 0;
	const url = `${orgUrl}participants/${id}/`;
	return {
		id,
		alias,
		displayName,
		fullName,
		location,
		notes,
		runCount,
		hostCount,
		url
	};
}

function getCheckIns(data, eventsById, participants) {
	const indexes = getCheckInIndexes(data);

	const aEntries = participants
		.map((p) => [p.id, getParticipantCheckIns(eventsById, indexes, p)]);
	const checkInsByParticipantId = new Map(aEntries);

	const bEntries = aEntries
		.map(([pid, checkIns]) => checkIns)
		.flat()
		.map((checkIn) => [checkIn.id, checkIn]);
	const checkInsById = new Map(bEntries);

	const cEntries = [...indexes.byEventId.entries()]
		.map(([eid, pidSet]) => {
			const pids = [...pidSet.values()]
				.map((pid) => encodeCheckInId(eid, pid))
				.map((id) => checkInsById.get(id))
				.sort(sortAsc((checkIn) => checkIn.participant.displayName));
			return [eid, pids];
		});
	const checkInsByEventId = new Map(cEntries);

	return {
		checkInsById,
		checkInsByEventId,
		checkInsByParticipantId
	};
}

function getCheckInIndexes(data) {
	const byCheckInId = new Map();
	const byEventId = new Map();
	const byParticipantId = new Map();

	for (const [id, c] of data.get('checkIns')) {
		const { eventId: eid, participantId: pid } = decodeCheckInId(id);
		byCheckInId.set(id, c);
		getOrCreate(byEventId, eid, () => new Set()).add(pid);
		getOrCreate(byParticipantId, pid, () => new Set()).add(eid);
	}

	return { byCheckInId, byEventId, byParticipantId };
}

function getParticipantCheckIns(eventsById, indexes, participant) {
	const eventIds = indexes.byParticipantId.get(participant.id);
	if (!eventIds?.size) {
		return [];
	}
	const checkIns = [...eventIds]
		.map((eid) => eventsById.get(eid))
		.sort(sortAsc(({ count }) => count))
		.reduce((arr, event) => {
			const prev = arr.at(-1);
			const checkIn = getCheckInA(event, participant, indexes, prev);
			arr.push(checkIn);
			return arr;
		}, [])
		.reverse();
	const latest = checkIns[0];
	const missingRunCount = participant.runCount ? participant.runCount - latest.runCount : 0;
	const missingHostCount = participant.hostCount ? participant.hostCount - latest.hostCount : 0;
	return checkIns.map((checkIn) => getCheckInB(checkIn, missingRunCount, missingHostCount, participant));
}

function getCheckInA(event, participant, indexes, prev) {
	const id = encodeCheckInId(event.id, participant.id);
	const data = indexes.byCheckInId.get(id);
	const host = data.get('host') ?? false;
	const runCount = (prev?.runCount ?? 0) + 1;
	const hostCount = (prev?.hostCount ?? 0) + (host ? 1 : 0);
	const url = `${event.url}check-ins/${participant.id}/edit/`;
	return {
		id,
		event,
		eventId: event.id,
		participant,
		participantId: participant.id,
		host,
		hostCount,
		runCount,
		url
	};
}

function getCheckInB(checkIn, missingRunCount, missingHostCount, participant) {
	const runCount = checkIn.runCount + missingRunCount;
	const hostCount = checkIn.hostCount + missingHostCount;
	const specialRunCount = isSpecial(runCount);
	const specialHostCount = isSpecial(hostCount);
	const readyForNaming = runCount >= 5 && !participant.alias;
	return {
		...checkIn,
		hostCount,
		readyForNaming,
		runCount,
		specialHostCount,
		specialRunCount
	};
}

const checkInIdDelimiter = '-';

function encodeCheckInId(eventId, participantId) {
	return [eventId, participantId].join(checkInIdDelimiter);
}

function decodeCheckInId(id) {
	const [eventId, participantId] = id.split(checkInIdDelimiter);
	return { eventId, participantId };
}

function isSpecial(value) {
	return value > 0 && (value % 5 === 0 || /69$/.test(value));
}
