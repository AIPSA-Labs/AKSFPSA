import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db';

export async function GET() {
	const actions = await sql`SELECT id, text, entity, created_at FROM admin_actions ORDER BY id DESC LIMIT 50`;
	return json(actions);
}

export async function POST({ request }) {
	const body = await request.json();
	const text = String(body.text || '').trim();
	const entity = String(body.entity || '').trim();
	if (!text) return json({ error: 'text is required' }, { status: 400 });

	const [created] = await sql`
		INSERT INTO admin_actions (text, entity)
		VALUES (${text}, ${entity})
		RETURNING id, text, entity, created_at
	`;
	return json(created, { status: 201 });
}
