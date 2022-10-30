import { format, isAfter, isFuture, isPast, isToday, parseISO } from 'date-fns';
import { computed, signal } from 'usignal';
import { getOrCreate, sortAsc, sortDesc } from '@src/util.js';
import { getOrgDB } from './org';
import { encodeCheckInId } from './util.js';

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
	const entity = data.get('org');
	const { name = '(Organization)' } = entity.get('org');
	const eventCount = data.get('org|event').get('count');
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
	for (const [id, entity] of data) {
		const event = getEvent(id, entity, orgUrl);
		if (event) {
			events.push(event);
		}
	}
	const eventCountDate = parseISO(eventCount.date);
	const eventsAfter = events
		.filter(({ dateObj }) => isAfter(dateObj, eventCountDate))
		.length;
	const eventCountValue = eventsAfter + eventCount.value;
	return events
		.sort(sortDesc('dateObj'))
		.map((event, i) => {
			const count = eventCountValue - i;
			return { ...event, count };
		});
}

function getEvent(id, entity, orgUrl) {
	const event = entity.get('event');
	if (!event) {
		return;
	}
	const date = event.date;
	if (!date) {
		return;
	}
	const dateObj = parseISO(date);
	const displayDate = format(dateObj, 'PP');
	const displayDateMedium = format(dateObj, 'E, MMM d');
	const displayDateLong = format(dateObj, 'E, PP');
	const year = format(dateObj, 'y');
	const name = event.name.trim() || '(Event)';
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
	for (const [id, entity] of data) {
		const participant = getParticipant(id, entity, orgUrl);
		if (participant) {
			participants.push(participant);
		}
	}
	return participants.sort(sortAsc('displayName'));
}

function getParticipant(id, entity, orgUrl) {
	if (!entity.has('person')) {
		return;
	}
	const person = entity.get('person');
	const { notes = '' } = person;
	const member = entity.get('member') || {};
	const { name: alias = '' } = member;
	const fullName = person.name || '(Participant)';
	const displayName = alias || `Just ${fullName}`;
	const runCount = entity.get('runCount') || 0;
	const hostCount = entity.get('hostCount') || 0;
	const url = `${orgUrl}participants/${id}/`;
	return {
		id,
		alias,
		displayName,
		fullName,
		notes,
		runCount,
		hostCount,
		url
	};
}

function getCheckIns(data, eventsById, participants) {
	const indexes = getCheckInIndexes(data);

	const aEntries = participants
		.map((p) => [p.id, getParticipantCheckIns(data, eventsById, indexes, p)]);
	const checkInsByParticipantId = new Map(aEntries);

	const bEntries = aEntries
		.map(([pid, checkIns]) => checkIns)
		.flat()
		.map((checkIn) => [checkIn.id, checkIn]);
	const checkInsById = new Map(bEntries);

	const cEntries = [...eventsById.keys()]
		.map((eid) => {
			const pidSet = indexes.byEventId.get(eid) || new Set();
			const pids = [...pidSet.values()]
				.map((pid) => encodeCheckInId(pid, eid))
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

	for (const [id, entity] of data) {
		if (entity.has('rel') && entity.has('attends')) {
			const { source: pid, target: eid } = entity.get('rel');
			byCheckInId.set(id, entity);
			getOrCreate(byEventId, eid, () => new Set()).add(pid);
			getOrCreate(byParticipantId, pid, () => new Set()).add(eid);
		}
	}

	return { byCheckInId, byEventId, byParticipantId };
}

function getParticipantCheckIns(data, eventsById, indexes, participant) {
	const eventIds = indexes.byParticipantId.get(participant.id);
	if (!eventIds?.size) {
		return [];
	}

	const attendsCount = getAttendsCount(data, eventIds, eventsById, participant);
	const organizesCount = getOrganizesCount(data, eventIds, eventsById, participant, checkInsById);

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

function getAttendsCount(data, eventIds, eventsById, participant) {
	const id = `${participant.id}|attends`;
	if (!data.has(id)) {
		return eventIds.size;
	}
	const count = data.get(id).get('count');
	const countAfter = [...eventIds]
		.map((eid) => eventsById.get(eid))
		.filter(({ dateObj }) => isAfter(dateObj, count.date))
		.length;
	return count.value + countAfter;
}

function getOrganizesCount(data, eventIds, eventsById, participant, checkInsById) {
	const target = 'organizes';
	const id = `${participant.id}|${target}`;
	const organizes = [...eventIds].filter((eid) => {
		const checkInId = encodeCheckInId(participant.id, eid);
		return checkInsById.get(checkInId).has(target);
	});
	if (!data.has(id)) {
		return organizes.length;
	}
	const count = data.get(id).get('count');
	const countAfter = organizes
		.map((eid) => eventsById.get(eid))
		.filter(({ dateObj }) => isAfter(dateObj, count.date))
		.length;
	return count.value + countAfter;
}

function getCheckInA(event, participant, indexes, prev) {
	const id = encodeCheckInId(participant.id, event.id);
	const entity = indexes.byCheckInId.get(id);
	const host = entity.has('organizes');
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

function isSpecial(value) {
	return value > 0 && (value % 5 === 0 || /69$/.test(value));
}
