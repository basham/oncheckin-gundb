import { format, isFuture, isPast, isToday, parseISO } from 'date-fns';
import { computed, signal } from 'usignal';
import { getOrgDB } from './org';
import { getOrCreate, sortDesc } from '@src/util.js';

const cache = new Map();

export async function computeOrg(orgId) {
	const out = await getOrCreate(cache, orgId, () => calc(orgId));
	return out();
}

async function calc(orgId) {
	const db = await getOrgDB(orgId);
	const $Data = signal([db.data]);
	db.data.observe(() => {
		$Data.value = [db.data];
	});
	const $data = computed(() => $Data.value[0]);
	const $org = computed(() => getOrg(orgId, $data));
	const $orgUrl = computed(() => $org.value.url)
	const $events = computed(() => getEvents($data, $orgUrl));
	const $pastEvents = computed(() =>
		$events.value.filter(({ dateObj }) => !isToday(dateObj) && isPast(dateObj))
	);
	const $upcomingEvents = computed(() =>
		$events.value
			.filter(({ dateObj }) => isToday(dateObj) || isFuture(dateObj))
			.reverse()
	);
	const $eventsByYear = computed(() =>
		$events.value.reduce((m, event) => {
			const { year } = event;
			const thisYear = getOrCreate(m, year, () => []);
			thisYear.unshift(event);
			return m;
		}, new Map())
	);
	const $eventYears = computed(() =>
		[...$eventsByYear.value.keys()].sort().reverse()
	);
	const signals = {
		$org,
		$events,
		$pastEvents,
		$upcomingEvents,
		$eventsByYear,
		$eventYears,
	};
	return () => {
		const entries = Object.entries(signals).map(([k, v]) => [
			k.slice(1),
			v.value,
		]);
		return Object.fromEntries(entries);
	};
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

function getEvents($data, $orgUrl) {
	const all = [];
	for (const [id, data] of $data.value.get('events')) {
		const event = getEvent(id, data, $orgUrl);
		if (event) {
			all.push(event);
		}
	}
	return all.sort(sortDesc('dateObj'));
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
