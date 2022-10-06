import { getOrCreate, setMapFromObject } from '@src/util.js';
import { createId, createYMap, createRemoteStore } from './store.js';
import { encodeCheckInId } from './util.js';

export async function createCheckIn(orgId, eventId, participantId, values) {
	const db = await getOrgDB(orgId);
	const p = db.participants.get(participantId);
	if (p.has('runCount')) {
		p.set('runCount', p.get('runCount') + 1);
	}
	if (p.has('hostCount') && Object.hasOwn(values, 'host') && values.host) {
		p.set('hostCount', p.get('hostCount') + 1);
	}
	const id = encodeCheckInId(eventId, participantId);
	db.checkIns.set(id, createYMap());
	return await updateCheckIn(orgId, eventId, participantId, values);
}

export async function createEvent(orgId, values) {
	const db = await getOrgDB(orgId);
	if (db.settings.has('eventCount')) {
		const count = db.settings.get('eventCount');
		db.settings.set('eventCount', count + 1);
	}
	const id = createId();
	db.events.set(id, createYMap());
	return await setEvent(orgId, id, values);
}

export async function createOrg(id = createId()) {
	return await getOrg(id);
}

export async function createParticipant(orgId, values) {
	const db = await getOrgDB(orgId);
	const id = createId();
	db.participants.set(id, createYMap());
	return await setParticipant(orgId, id, values);
}

export async function deleteOrg(id) {
	const { clearData } = await getOrgDB(id);
	await clearData();
}

export async function deleteCheckIn(orgId, eventId, participantId) {
	const db = await getOrgDB(orgId);
	const id = encodeCheckInId(eventId, participantId);
	const checkIn = db.checkIns.get(id);
	const p = db.participants.get(participantId);
	if (p.has('runCount')) {
		p.set('runCount', p.get('runCount') - 1);
	}
	if (p.has('hostCount') && checkIn.get('host')) {
		p.set('hostCount', p.get('hostCount') - 1);
	}
	db.checkIns.delete(id);
}

export async function editEventCount(id, count) {
	const db = await getOrgDB(id);
	db.settings.set('eventCount', parseInt(count));
}

export async function getOrgDB(id = createId()) {
	const store = await createRemoteStore(id);
	const data = store.doc.getMap('data');
	const rows = ['settings', 'checkIns', 'events', 'participants'].map((key) => [
		key,
		getOrCreate(data, key, createYMap),
	]);
	const rowsEntries = Object.fromEntries(rows);
	return { ...store, data, ...rowsEntries };
}

export async function getOrg(id) {
	const db = await getOrgDB(id);

	if (!db) {
		return;
	}

	const name = db.settings.get('name') || '(Organization)';
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

export async function importOrg(content) {
	const { eventCount = 0, name } = content.settings;
	const db = await getOrgDB();
	const origin = 'importer';
	const didImport = new Promise((resolve) => {
		db.doc.on('afterTransaction', function (transaction) {
			if (transaction.origin === origin) {
				db.doc.off('afterTransaction', this);
				resolve(transaction);
			}
		});
	});
	db.doc.transact(() => {
		db.settings.set('eventCount', eventCount);
		db.settings.set('name', name);
		const items = ['events', 'participants', 'checkIns']
			.map((itemType) =>
				Object.entries(content[itemType]).map((item) => [itemType, ...item])
			)
			.flat();
		for (const [itemType, id, values] of items) {
			const entity = getOrCreate(db[itemType], id, createYMap);
			setMapFromObject(entity, values);
		}
	}, origin);
	await didImport;
	await db.save();
	return await getOrg(db.id);
}

export async function renameOrg(id, name) {
	const db = await getOrgDB(id);
	db.settings.set('name', name);
}

export async function setCheckIn(orgId, eventId, participantId, values) {
	const id = encodeCheckInId(eventId, participantId);
	const db = await getOrgDB(orgId);
	if (!db.checkIns.has(id)) {
		return;
	}
	const checkIn = db.checkIns.get(id);
	if (Object.hasOwn(values, 'host') && checkIn.get('host') !== values.host) {
		const p = db.participants.get(participantId);
		if (p.has('hostCount')) {
			p.set('hostCount', p.get('hostCount') + (values.host ? 1 : -1));
		}
	}
	await updateCheckIn(orgId, eventId, participantId, values);
}

export async function setEvent(orgId, eventId, values) {
	const { events } = await getOrgDB(orgId);
	if (!events.has(eventId)) {
		return;
	}
	const event = events.get(eventId);
	event.doc.transact(() => setMapFromObject(event, values));
	const url = `/orgs/${orgId}/events/${eventId}/`
	return { id: eventId, url };
}

export async function setParticipant(orgId, participantId, values) {
	const { participants } = await getOrgDB(orgId);
	if (!participants.has(participantId)) {
		return;
	}
	const participant = participants.get(participantId);
	participant.doc.transact(() => setMapFromObject(participant, values));
	const url = `/orgs/${orgId}/participants/${participantId}/`
	return { id: participantId, url };
}

export async function updateCheckIn(orgId, eventId, participantId, values) {
	const id = encodeCheckInId(eventId, participantId);
	const { checkIns } = await getOrgDB(orgId);
	if (!checkIns.has(id)) {
		return;
	}
	const checkIn = checkIns.get(id);
	checkIn.doc.transact(() => setMapFromObject(checkIn, values));
}
