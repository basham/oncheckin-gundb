import { editEventCount } from '@src/api.js';

export async function get() {
	const h1 = 'Edit event count';
	const template = { h1 };
	return { template };
}

export async function post({ data, request }) {
	const { org } = data;
	const formData = await request.formData();
	const count = formData.get('count');
	await editEventCount(org.id, count);
	const redirect = `${org.url}settings`;
	return { redirect };
}
