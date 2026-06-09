import { json } from '@sveltejs/kit';
import { uploadFile, deleteFile } from '$lib/server/r2';

export async function POST({ request }) {
	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const folder = (formData.get('folder') as string) || 'uploads';

	if (!file) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	const buffer = await file.arrayBuffer();
	const ext = file.name.split('.').pop() || '';
	const name = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
	const key = `${folder}/${Date.now()}-${name.slice(0, 40)}.${ext}`;

	const url = await uploadFile(key, new Uint8Array(buffer), file.type);

	return json({ url, key });
}

export async function DELETE({ request }) {
	const { key } = await request.json() as { key: string };

	if (!key) {
		return json({ error: 'No key provided' }, { status: 400 });
	}

	await deleteFile(key);
	return json({ success: true });
}
