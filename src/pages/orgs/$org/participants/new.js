import { createParticipant } from '@src/api.js';

export async function get() {
	const h1 = 'New hasher';
	const template = { h1 };
	return { template };
}

export async function post({ data, request }) {
	const { org } = data;
	const formData = await request.formData();
	const fullName = formData.get('fullName');
	const alias = formData.get('alias');
	const { url: redirect } = await createParticipant(org.id, {
		fullName,
		alias,
	});
	return { redirect };
}
