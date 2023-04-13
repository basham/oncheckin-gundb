import { getOrCreate, setMapFromObject } from '@src/util.js';
import { createId, createYMap, createRemoteStore } from './store.js';
import { encodeCheckInId } from './util.js';

export async function createCheckIn(orgId, participantId, eventId, values) {
	const id = encodeCheckInId(participantId, eventId);
	await createEntity(orgId, id);
	return await setCheckIn(orgId, participantId, eventId, values);
}

async function createEntity(orgId, id = createId()) {
	const { data } = await getOrgDB(orgId);
	data.set(id, createYMap());
	return id;
}

export async function createEvent(orgId, values) {
	const id = await createEntity(orgId);
	return await setEvent(orgId, id, values);
}

export async function createOrg(name) {
	const id = createId();
	await createEntity(id, 'org');
	await renameOrg(id, name);
	return await getOrg(id);
}

export async function createParticipant(orgId, values) {
	const id = await createEntity(orgId);
	return await setParticipant(orgId, id, values);
}

export async function deleteEntity(orgId, id) {
	const { data } = await getOrgDB(orgId);
	data.delete(id);
}

export async function deleteOrg(id) {
	const { clearData } = await getOrgDB(id);
	await clearData();
}

export async function deleteCheckIn(orgId, participantId, eventId) {
	const id = encodeCheckInId(participantId, eventId);
	await deleteEntity(orgId, id);
}

export async function editEventCount(id, count) {
	const db = await getOrgDB(id);
	db.settings.set('eventCount', parseInt(count));
}

export async function getOrgDB(id = createId()) {
	const store = await createRemoteStore(id);
	const data = store.doc.getMap('data');
	return { ...store, data };
}

async function getEntity(orgId, id) {
	const { data } = await getOrgDB(orgId);
	return data.get(id);
}

export async function getOrg(id) {
	const entity = await getEntity(id, 'org');
	const name = entity?.get('org').name || '(Organization)';
	const url = `/orgs/${id}/`;
	const openUrl = `${url}open/`;
	const inviteCode = self.btoa(JSON.stringify({ id, name }));
	const shareUrl = `${self.location.origin}/?join=${inviteCode}`;
	return {
		id,
		name,
		openUrl,
		shareUrl,
		url,
	};
}

export async function importOrg(data) {
	const db = await getOrgDB();
	const origin = 'importer';
	const didImport = new Promise((resolve) => {
		db.doc.on('afterTransaction', (transaction) => {
			if (transaction.origin === origin) {
				db.doc.off('afterTransaction', this);
				resolve(transaction);
			}
		});
	});
	db.doc.transact(() => {
		for (const [key, values] of Object.entries(data)) {
			const entity = getOrCreate(db.data, key, createYMap);
			setMapFromObject(entity, values);
		}
	}, origin);
	await didImport;
	await db.save();
	return await getOrg(db.id);
}

export async function renameOrg(id, name) {
	const entity = await getEntity(id, 'org');
	setComponent(entity, 'org', { name });
}

export async function setCheckIn(orgId, participantId, eventId, { organizes = false }) {
	const id = encodeCheckInId(participantId, eventId);
	const entity = await getEntity(orgId, id);
	if (!entity) {
		return;
	}
	entity.doc.transact(() => {
		setRel(entity, participantId, eventId);
		setTag(entity, 'attends', true);
		setTag(entity, 'organizes', organizes);
	});
}

export async function setEvent(orgId, id, { name, date }) {
	const entity = await getEntity(orgId, id);
	if (!entity) {
		return;
	}
	setComponent(entity, 'event', { name, date });
	const url = `/orgs/${orgId}/events/${id}/`;
	return { id, url };
}

export async function setParticipant(orgId, id, value) {
	const entity = await getEntity(orgId, id);
	if (!entity) {
		return;
	}
	const personName = value.personName.trim();
	const memberName = value.memberName.trim();
	const location = value.location.trim();
	const notes = value.location.trim();
	entity.doc.transact(() => {
		if (personName) {
			setComponent(entity, 'person', { name: personName, location, notes });
		}
		if (memberName) {
			setComponent(entity, 'member', { name: memberName });
		} else {
			deleteComponent(entity, 'member');
		}
	});
	const url = `/orgs/${orgId}/participants/${id}/`;
	return { id, url };
}

function deleteComponent(entity, name) {
	entity.delete(name);
}

function setComponent(entity, name, value) {
	const component = getOrCreate(entity, name, () => ({}));
	entity.set(name, { ...component, ...value });
}

function setRel(entity, source, target) {
	setComponent(entity, 'rel', { source, target });
}

function setTag(entity, name, value) {
	if (!entity.has(name) && value) {
		entity.set(name, 0);
	}
	else if (entity.has(name) && !value) {
		entity.delete(name);
	}
}
