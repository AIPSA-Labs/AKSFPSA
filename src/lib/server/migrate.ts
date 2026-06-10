import { sql } from './db';

const migrations = [
	`CREATE TABLE IF NOT EXISTS contact_submissions (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		institution TEXT NOT NULL DEFAULT '',
		email TEXT NOT NULL DEFAULT '',
		phone TEXT NOT NULL DEFAULT '',
		message TEXT NOT NULL DEFAULT '',
		date TEXT NOT NULL DEFAULT '',
		status TEXT NOT NULL DEFAULT 'new',
		notes TEXT NOT NULL DEFAULT '',
		source TEXT NOT NULL DEFAULT 'website',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS blog_posts (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL DEFAULT '',
		slug TEXT NOT NULL UNIQUE,
		excerpt TEXT NOT NULL DEFAULT '',
		content TEXT NOT NULL DEFAULT '',
		author TEXT NOT NULL DEFAULT '',
		date TEXT NOT NULL DEFAULT '',
		status TEXT NOT NULL DEFAULT 'draft',
		cover TEXT NOT NULL DEFAULT '',
		tags TEXT[] NOT NULL DEFAULT '{}',
		type TEXT NOT NULL DEFAULT 'post',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS circulars (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL DEFAULT '',
		date TEXT NOT NULL DEFAULT '',
		category TEXT NOT NULL DEFAULT '',
		file TEXT NOT NULL DEFAULT '',
		content TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS courses (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL DEFAULT '',
		category TEXT NOT NULL DEFAULT '',
		duration TEXT NOT NULL DEFAULT '',
		mode TEXT NOT NULL DEFAULT '',
		description TEXT NOT NULL DEFAULT '',
		link TEXT NOT NULL DEFAULT '',
		content TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS events (
		slug TEXT PRIMARY KEY,
		title TEXT NOT NULL DEFAULT '',
		date TEXT NOT NULL DEFAULT '',
		location TEXT NOT NULL DEFAULT '',
		type TEXT NOT NULL DEFAULT '',
		description TEXT NOT NULL DEFAULT '',
		content TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS gallery_albums (
		id SERIAL PRIMARY KEY,
		slug TEXT NOT NULL UNIQUE,
		title TEXT NOT NULL DEFAULT '',
		date TEXT NOT NULL DEFAULT '',
		category TEXT NOT NULL DEFAULT '',
		cover TEXT NOT NULL DEFAULT '',
		description TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS gallery_images (
		id SERIAL PRIMARY KEY,
		album_id INTEGER NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
		src TEXT NOT NULL DEFAULT '',
		alt TEXT NOT NULL DEFAULT ''
	)`,
	`CREATE TABLE IF NOT EXISTS leaders (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL DEFAULT '',
		role TEXT NOT NULL DEFAULT '',
		district TEXT NOT NULL DEFAULT '',
		image TEXT NOT NULL DEFAULT '',
		"group" TEXT NOT NULL DEFAULT 'office-bearers'
	)`,
	`CREATE TABLE IF NOT EXISTS member_institutions (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL DEFAULT '',
		district TEXT NOT NULL DEFAULT '',
		category TEXT NOT NULL DEFAULT '',
		since TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS services (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL DEFAULT '',
		description TEXT NOT NULL DEFAULT '',
		icon TEXT NOT NULL DEFAULT '',
		"order" INTEGER NOT NULL DEFAULT 0,
		content TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS faqs (
		id SERIAL PRIMARY KEY,
		question TEXT NOT NULL DEFAULT '',
		answer TEXT NOT NULL DEFAULT '',
		"order" INTEGER NOT NULL DEFAULT 0,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS uploaded_files (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL DEFAULT '',
		type TEXT NOT NULL DEFAULT '',
		size INTEGER NOT NULL DEFAULT 0,
		data TEXT NOT NULL DEFAULT '',
		date TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE IF NOT EXISTS gallery_categories (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL UNIQUE
	)`,
	`CREATE TABLE IF NOT EXISTS contact_info (
		id INTEGER PRIMARY KEY DEFAULT 1,
		address TEXT NOT NULL DEFAULT '',
		email TEXT NOT NULL DEFAULT '',
		phones TEXT[] NOT NULL DEFAULT '{}',
		hours TEXT NOT NULL DEFAULT ''
	)`,
	`CREATE TABLE IF NOT EXISTS admin_actions (
		id SERIAL PRIMARY KEY,
		text TEXT NOT NULL DEFAULT '',
		entity TEXT NOT NULL DEFAULT '',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	)`,
];

export async function migrate() {
	for (const m of migrations) {
		await sql.unsafe(m);
	}

	await sql`INSERT INTO contact_info (id, address, email, phones, hours)
		VALUES (1, 'All Kerala Self Financing Private Schools Association\n123 Institutional Road\nErnakulam, Kerala – 682001', 'info@association.org', ARRAY['+91 98765 43210'], 'Monday – Friday\n10:00 AM – 5:00 PM')
		ON CONFLICT (id) DO NOTHING`;
}
