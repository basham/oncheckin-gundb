import { format, isFuture, isPast, isToday, parseISO } from 'date-fns';
import { computed, signal } from 'usignal';
import { getOrgDB } from './org';
import { getOrCreate, sortDesc } from '@src/util.js';

const cache = new Map();

export function computeOrg(orgId) {
	return getOrCreate(cache, orgId, () => calc(orgId));
}

async function calc(orgId) {
	const db = await getOrgDB(orgId);
	const $Data = signal([db.data]);
	db.data.observe(() => {
		$Data.value = [db.data];
	});
	const $data = computed(() => $Data.value[0]);
	const $org = computed(() => getOrg(orgId, $data));
	const $orgUrl = computed(() => $org.value.url);
	const $eventsById = computed(() => getEventsById($data, $orgUrl));
	const $events = computed(() =>
		[...$eventsById.value.values()].sort(sortDesc('dateObj'))
	);
	const $pastEvents = computed(() =>
		$events.value.filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
	);
	const $upcomingEvents = computed(() =>
		$events.value
			.filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
			.reverse()
	);
	const $eventsByYear = computed(() =>
		$events.value.reduce((map, event) => {
			const { year } = event;
			const yearEvents = getOrCreate(map, year, () => []);
			yearEvents.unshift(event);
			return map;
		}, new Map())
	);
	const $eventYears = computed(() =>
		[...$eventsByYear.value.keys()].sort().reverse()
	);
	return signalsToGetters({
		$org,
		$eventsById,
		$events,
		$pastEvents,
		$upcomingEvents,
		$eventsByYear,
		$eventYears,
	});
}

function signalsToGetters(signals) {
	return objectToGetters(
		signals,
		(k) => k.slice(1),
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

function getOrg(id, $data) {
	const name = $data.value.get('settings').get('name') || '(Organization)';
	const url = `/orgs/${id}/`;
	const openUrl = `${url}open/`;
	const inviteCode = self.btoa(JSON.stringify({ id, name }));
	const shareUrl = `${self.location.origin}/join/${inviteCode}/`;
	return {
		id,
		name,
		openUrl,
		shareUrl,
		url,
	};
}

function getEventsById($data, $orgUrl) {
	const map = new Map();
	for (const [id, data] of $data.value.get('events')) {
		const event = getEvent(id, data, $orgUrl);
		if (event) {
			map.set(id, event);
		}
	}
	return map;
}

function getEvent(id, data, $orgUrl) {
	const count = data.get('count') || '';
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
	const url = `${$orgUrl.value}events/${id}/`;
	return {
		id,
		count,
		date,
		dateObj,
		displayDate,
		displayDateMedium,
		displayDateLong,
		name,
		url,
		year,
	};
}
