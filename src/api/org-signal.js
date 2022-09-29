import { format, isFuture, isPast, isToday, parseISO } from 'date-fns';
import { computed, signal } from 'usignal';
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
	return signalsToGetters({
		org$,
		eventsById$,
		events$,
		pastEvents$,
		upcomingEvents$,
		eventsByYear$,
		eventYears$,
		participants$,
		participantsById$
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
