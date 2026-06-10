import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db';
import { deleteFile } from '$lib/server/r2';

const tables: Record<string, { table: string; id: string }> = {
	circulars: { table: 'circulars', id: 'id' },
	blog: { table: 'blog_posts', id: 'id' },
	courses: { table: 'courses', id: 'id' },
	events: { table: 'events', id: 'slug' },
	gallery: { table: 'gallery_albums', id: 'id' },
	'gallery-images': { table: 'gallery_images', id: 'id' },
	leaders: { table: 'leaders', id: 'id' },
	members: { table: 'member_institutions', id: 'id' },
	services: { table: 'services', id: 'id' },
	faqs: { table: 'faqs', id: 'id' },
	files: { table: 'uploaded_files', id: 'id' },
	'gallery-categories': { table: 'gallery_categories', id: 'id' },
	'contact-info': { table: 'contact_info', id: 'id' },
	'contact-submissions': { table: 'contact_submissions', id: 'id' },
};

function getIdCondition(meta: { id: string }, rawId: string) {
	if (meta.id === 'slug') return sql`slug = ${rawId}`;
	const num = Number(rawId);
	if (isNaN(num)) return null;
	return sql`id = ${num}`;
}

export async function GET({ params }) {
	const meta = tables[params.entity];
	if (!meta) return json({ error: 'Unknown entity' }, { status: 400 });

	const condition = getIdCondition(meta, params.id);
	if (!condition) return json({ error: 'Invalid id' }, { status: 400 });

	if (params.entity === 'gallery') {
		const [album] = await sql`SELECT * FROM gallery_albums WHERE ${condition}`;
		if (!album) return json({ error: 'Not found' }, { status: 404 });
		album.images = await sql`SELECT * FROM gallery_images WHERE album_id = ${album.id} ORDER BY id`;
		return json(album);
	}

	const [item] = await sql`SELECT * FROM ${sql(meta.table)} WHERE ${condition}`;
	if (!item) return json({ error: 'Not found' }, { status: 404 });
	return json(item);
}

export async function PUT({ params, request }) {
	const meta = tables[params.entity];
	if (!meta) return json({ error: 'Unknown entity' }, { status: 400 });

	const condition = getIdCondition(meta, params.id);
	if (!condition) return json({ error: 'Invalid id' }, { status: 400 });

	const body = await request.json();
	delete body.id;
	delete body.created_at;
	delete body.updated_at;

	const keys = Object.keys(body);
	if (keys.length === 0) return json({ error: 'No fields to update' }, { status: 400 });

	const cols = keys.map((k) => `${k.startsWith('"') ? k : `"${k}"`}`).join(', ');
	const vals = keys.map((k) => body[k]);
	const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');

	const query = `UPDATE ${meta.table} SET (${cols}) = (${placeholders}) WHERE ${meta.id === 'slug' ? 'slug' : 'id'} = $${vals.length + 1} RETURNING *`;
	const idVal = meta.id === 'slug' ? params.id : Number(params.id);
	const [updated] = await sql.unsafe(query, [...vals, idVal]);

	if (!updated) return json({ error: 'Not found' }, { status: 404 });
	return json(updated);
}

export async function DELETE({ params }) {
	const meta = tables[params.entity];
	if (!meta) return json({ error: 'Unknown entity' }, { status: 400 });

	const condition = getIdCondition(meta, params.id);
	if (!condition) return json({ error: 'Invalid id' }, { status: 400 });

	if (params.entity === 'gallery') {
		const images = await sql`SELECT src FROM gallery_images WHERE album_id = ${Number(params.id)}`;
		for (const img of images) {
			const key = extractR2Key(img.src);
			if (key) await deleteFile(key).catch(() => {});
		}
		const [album] = await sql`SELECT cover FROM ${sql(meta.table)} WHERE ${condition}`;
		if (album?.cover) {
			const key = extractR2Key(album.cover);
			if (key) await deleteFile(key).catch(() => {});
		}
		await sql`DELETE FROM gallery_images WHERE album_id = ${Number(params.id)}`;
	}

	if (params.entity === 'gallery-images') {
		const [img] = await sql`SELECT src FROM gallery_images WHERE id = ${Number(params.id)}`;
		if (img?.src) {
			const key = extractR2Key(img.src);
			if (key) await deleteFile(key).catch(() => {});
		}
	}

	await sql`DELETE FROM ${sql(meta.table)} WHERE ${condition}`;
	return json({ success: true });
}

function extractR2Key(url: string): string | null {
	try {
		const u = new URL(url);
		return u.pathname.replace(/^\//, '');
	} catch { return null; }
}
