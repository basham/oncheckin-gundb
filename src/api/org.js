import { getOrCreate } from '@src/util.js';
import { createId, createYMap, createRemoteStore } from './store.js';

export async function createCheckIn(orgId, eventId, participantId, values) {
	return await setCheckIn(orgId, eventId, participantId, values);
}

export async function createEvent(orgId, values) {
	const db = await getOrgDB(orgId);
	const count = db.settings.get('eventCount');
	db.settings.set('eventCount', count + 1);
	return await setEvent(orgId, createId(), values);
}

export async function createOrg(id = createId()) {
	return await getOrg(id);
}

export async function createParticipant(orgId, values) {
	return await setParticipant(orgId, createId(), values);
}

export async function deleteOrg(id) {
	const { clearData } = await getOrgDB(id);
	await clearData();
}

export async function deleteCheckIn(orgId, eventId, participantId) {
	const { checkIns } = await getOrgDB(orgId);
	checkIns.delete(`${eventId}-${participantId}`);
}

export async function editEventCount(id, count) {
	const db = await getOrgDB(id);
	db.settings.set('eventCount', parseInt(count));
}

export async function getOrCreateCheckIn(orgId, eventId, participantId) {
	const { checkIns } = await getOrgDB(orgId);
	return getOrCreate(checkIns, `${eventId}-${participantId}`, createYMap);
}

export async function getOrCreateEvent(orgId, eventId) {
	const { events } = await getOrgDB(orgId);
	return getOrCreate(events, eventId, createYMap);
}

export async function getOrCreateParticipant(orgId, participantId) {
	const { participants } = await getOrgDB(orgId);
	return getOrCreate(participants, participantId, createYMap);
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
			for (const [key, value] of Object.entries(values)) {
				entity.set(key, value);
			}
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
	const checkIn = await getOrCreateCheckIn(orgId, eventId, participantId);
	checkIn.doc.transact(() => {
		for (const [key, value] of Object.entries(values)) {
			checkIn.set(key, value);
		}
	});
}

export async function setEvent(orgId, eventId, values) {
	const event = await getOrCreateEvent(orgId, eventId);
	event.doc.transact(() => {
		for (const [key, value] of Object.entries(values)) {
			event.set(key, value);
		}
	});
	const url = `/orgs/${orgId}/events/${eventId}/`
	return { id: eventId, url };
}

export async function setParticipant(orgId, participantId, values) {
	const participant = await getOrCreateParticipant(orgId, participantId);
	participant.doc.transact(() => {
		for (const [key, value] of Object.entries(values)) {
			participant.set(key, value);
		}
	});
	const url = `/orgs/${orgId}/participants/${participantId}/`
	return { id: participantId, url };
}
