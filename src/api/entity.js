import { getOrCreate } from '@src/util.js';
import { isComponent, isIdValid } from './components.js';
import { createYMap, createRemoteStore } from './store.js';

const ID_DELIMITER = '|';

export async function loadStore(id = createId()) {
	const store = await createRemoteStore(id);
	const data = store.doc.getMap('data');

	function createEntity(...idParts) {
		const id = getId(idParts);
		getOrCreate(data, id, createYMap);
		return entity(...idParts);
	}

	function deleteEntity(...idParts) {
		const id = getId(idParts);
		data.delete(id);
	}

	function getEntity(...idParts) {
		const id = getId(idParts);
		const _entity = data.get(id);

		if (!_entity) {
			return;
		}

		function _delete(component) {
			validateComponent(component);
			_entity.delete(component.id);
		}

		function get(component) {
			validateComponent(component);
			_entity.get(component.id);
		}

		function set(component, value) {
			validateComponent(component);
			const _value = component.schema.parse(value);
			_entity.set(component.id, _value);
		}

		return { delete: _delete, get, id, set, value: _entity };
	}

	return { ...store, createEntity, deleteEntity, getEntity, id };
}

function getId(idParts = [createId()]) {
	const parts = idParts.map((value) => value?.id || value)
	if (!parts.every(isIdValid)) {
		throw new Error('Invalid id');
	}
	return parts.join(ID_DELIMITER);
}

function validateComponent(component) {
	if (!isComponent(component)) {
		throw Error('Argument must be a component');
	}
}
