import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db';

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

export async function GET({ params, url }) {
	const meta = tables[params.entity];
	if (!meta) return json({ error: 'Unknown entity' }, { status: 400 });

	const id = url.searchParams.get('id');

	if (params.entity === 'gallery') {
		if (id) {
			const [album] = await sql`SELECT * FROM gallery_albums WHERE id = ${Number(id)}`;
			if (!album) return json({ error: 'Not found' }, { status: 404 });
			album.images = await sql`SELECT * FROM gallery_images WHERE album_id = ${album.id} ORDER BY id`;
			return json(album);
		}
		const albums = await sql`SELECT * FROM gallery_albums ORDER BY id DESC`;
		const allImages = await sql`SELECT * FROM gallery_images ORDER BY id`;
		for (const a of albums as Array<Record<string, unknown>>) {
			(a as Record<string, unknown>).images = (allImages as Array<Record<string, unknown>>).filter((i) => (i as Record<string, unknown>).album_id === (a as Record<string, unknown>).id);
		}
		return json(albums);
	}

	if (params.entity === 'gallery-images' && id) {
		const images = await sql`SELECT * FROM gallery_images WHERE album_id = ${Number(id)} ORDER BY id`;
		return json(images);
	}

	if (id) {
		const col = meta.id === 'id' ? sql`id = ${Number(id)}` : sql`slug = ${id}`;
		const [item] = await sql`SELECT * FROM ${sql(meta.table)} WHERE ${col}`;
		if (!item) return json({ error: 'Not found' }, { status: 404 });
		return json(item);
	}

	const items = await sql`SELECT * FROM ${sql(meta.table)} ORDER BY id DESC`;
	return json(items);
}

export async function POST({ params, request }) {
	const meta = tables[params.entity];
	if (!meta) return json({ error: 'Unknown entity' }, { status: 400 });

	const body = await request.json();

	if (params.entity === 'contact-info') {
		body.id = 1;
		const [row] = await sql`INSERT INTO contact_info ${sql(body)} ON CONFLICT (id) DO UPDATE SET ${sql(body)} RETURNING *`;
		return json(row, { status: 201 });
	}

	const allowedCols = getColumns(params.entity);
	const data: Record<string, unknown> = {};
	for (const key of Object.keys(body)) {
		if (allowedCols.includes(key)) data[key] = body[key];
	}

	if (params.entity === 'events' && !data.slug) {
		data.slug = String(data.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
	}

	const [created] = await sql`INSERT INTO ${sql(meta.table)} ${sql(data)} RETURNING *`;

	if (params.entity === 'gallery' && Array.isArray(body.images)) {
		for (const img of body.images) {
			await sql`INSERT INTO gallery_images ${sql({ album_id: created.id, src: img.src || '', alt: img.alt || '' })}`;
		}
		created.images = await sql`SELECT * FROM gallery_images WHERE album_id = ${created.id} ORDER BY id`;
	}

	return json(created, { status: 201 });
}

function getColumns(entity: string): string[] {
	const colMap: Record<string, string[]> = {
		circulars: ['title', 'date', 'category', 'file'],
		blog: ['title', 'slug', 'excerpt', 'content', 'author', 'date', 'status', 'cover', 'tags', 'type'],
		courses: ['title', 'category', 'duration', 'mode', 'description', 'link'],
		events: ['slug', 'title', 'date', 'location', 'type', 'description'],
		gallery: ['slug', 'title', 'date', 'category', 'cover', 'description'],
		'gallery-images': ['album_id', 'src', 'alt'],
		leaders: ['name', 'role', 'district', 'image', 'group'],
		members: ['name', 'district', 'category', 'since'],
		services: ['title', 'description', 'icon', 'order'],
		faqs: ['question', 'answer', 'order'],
		files: ['name', 'type', 'size', 'data', 'date'],
		'gallery-categories': ['name'],
		'contact-info': ['address', 'email', 'phones', 'hours'],
		'contact-submissions': ['name', 'institution', 'email', 'phone', 'message', 'date', 'status', 'notes', 'source'],
	};
	return colMap[entity] || [];
}
