import postgres from 'postgres';
import { env } from '$env/dynamic/private';

//- Initialize database client lazily to support build-time and runtime environments
let client: postgres.Sql | null = null;
let currentUrl: string | undefined = undefined;

export function getDb(): postgres.Sql {
	const url =
		env.DATABASE_URL ||
		(typeof process !== 'undefined' ? process.env?.DATABASE_URL : '') ||
		'';

	if (!client || currentUrl !== url) {
		currentUrl = url;
		client = postgres(url || 'postgres://localhost:5432/postgres', { ssl: 'require' });
	}
	return client;
}

export const sql = new Proxy((() => {}) as unknown as postgres.Sql, {
	apply(_target, thisArg, argArray) {
		const db = getDb();
		return Reflect.apply(db, thisArg, argArray);
	},
	get(_target, prop, receiver) {
		const db = getDb();
		const value = Reflect.get(db, prop, receiver);
		if (typeof value === 'function') {
			return value.bind(db);
		}
		return value;
	}
});
