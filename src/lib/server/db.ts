//- AIPSA PostgreSQL & REST Database Client Driver
import { env } from '$env/dynamic/private';

//- Default database configuration values
const DEFAULT_ENDPOINT = 'https://db.aipsa.in/api/v1/projects/29eb3d366ca21009108443bf8d356f28';
const DEFAULT_SERVICE_KEY =
	'apsk_a0e4d6b220211b51c9235406edd25e496e2beff51bc96f161d29f16f26f68c44';

function getDbConfig() {
	const dbUrl =
		env.DATABASE_URL ||
		(typeof process !== 'undefined' ? process.env?.DATABASE_URL : '') ||
		DEFAULT_ENDPOINT;
	const serviceKey =
		env.SERVICE_KEY ||
		(typeof process !== 'undefined' ? process.env?.SERVICE_KEY : '') ||
		DEFAULT_SERVICE_KEY;

	return { dbUrl, serviceKey };
}

//- Helper to serialize JavaScript arrays into PostgreSQL array literals
function toPgParam(val: unknown): unknown {
	if (Array.isArray(val)) {
		return '{' + val.map((v) => JSON.stringify(v)).join(',') + '}';
	}
	return val;
}

//- Helper to parse PostgreSQL array literal strings into JavaScript arrays
function parsePgArray(str: string): string[] {
	if (!str.startsWith('{') || !str.endsWith('}')) {
		return [str];
	}
	const inner = str.slice(1, -1).trim();
	if (!inner) {
		return [];
	}

	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < inner.length; i += 1) {
		const char = inner[i];
		if (char === '"' && (i === 0 || inner[i - 1] !== '\\')) {
			inQuotes = !inQuotes;
		} else if (char === ',' && !inQuotes) {
			result.push(current.replace(/^"|"$/g, '').replace(/\\"/g, '"'));
			current = '';
		} else {
			current += char;
		}
	}

	if (current) {
		result.push(current.replace(/^"|"$/g, '').replace(/\\"/g, '"'));
	}

	return result;
}

//- Format returned rows, converting PostgreSQL array literals to JavaScript arrays
function formatRow<T = Record<string, unknown>>(row: T): T {
	if (!row || typeof row !== 'object') {
		return row;
	}
	const record = row as Record<string, unknown>;
	for (const [key, val] of Object.entries(record)) {
		if (
			typeof val === 'string' &&
			(key === 'tags' || key === 'phones') &&
			val.startsWith('{') &&
			val.endsWith('}')
		) {
			record[key] = parsePgArray(val);
		}
	}
	return row;
}

//- Sql Fragment representing a parameterized SQL segment
class SqlFragment {
	strings: TemplateStringsArray;
	values: unknown[];

	constructor(strings: TemplateStringsArray, values: unknown[]) {
		this.strings = strings;
		this.values = values;
	}

	then<TResult1 = unknown, TResult2 = never>(
		onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
	): Promise<TResult1 | TResult2> {
		return executeFragment(this).then(onfulfilled, onrejected);
	}
}

//- Helper object for identifiers and objects
class SqlHelper {
	type: 'ident' | 'object';
	value: string | Record<string, unknown>;

	constructor(type: 'ident' | 'object', value: string | Record<string, unknown>) {
		this.type = type;
		this.value = value;
	}
}

//- Build SQL text and parameter list from a fragment
function buildQuery(fragment: SqlFragment): { text: string; params: unknown[] } {
	let text = '';
	const params: unknown[] = [];

	for (let i = 0; i < fragment.strings.length; i += 1) {
		text += fragment.strings[i];
		if (i < fragment.values.length) {
			const val = fragment.values[i];
			if (val instanceof SqlFragment) {
				const sub = buildQuery(val);
				let subText = sub.text;
				const offset = params.length;
				subText = subText.replace(/\$(\d+)/g, (_match, n) => `$${Number(n) + offset}`);
				text += subText;
				params.push(...sub.params);
			} else if (val instanceof SqlHelper) {
				if (val.type === 'ident') {
					const clean = String(val.value).replace(/"/g, '""');
					text += `"${clean}"`;
				} else if (val.type === 'object') {
					const isUpdate = /set\s*$/i.test(text.trim());
					const obj = val.value as Record<string, unknown>;
					const keys = Object.keys(obj);
					if (isUpdate) {
						const clauses = keys.map((k) => {
							params.push(obj[k]);
							return `"${k.replace(/"/g, '""')}" = $${params.length}`;
						});
						text += clauses.join(', ');
					} else {
						const cols = keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(', ');
						const placeholders = keys
							.map((_k) => {
								params.push(obj[_k]);
								return `$${params.length}`;
							})
							.join(', ');
						text += `(${cols}) VALUES (${placeholders})`;
					}
				}
			} else {
				params.push(val);
				text += `$${params.length}`;
			}
		}
	}
	return { text, params };
}

//- Execute raw SQL against AIPSA DB REST endpoint or PostgreSQL connection
async function executeRawQuery<T = unknown>(query: string, params: unknown[] = []): Promise<T[]> {
	const { dbUrl, serviceKey } = getDbConfig();

	if (dbUrl.startsWith('http://') || dbUrl.startsWith('https://')) {
		const endpoint = dbUrl.replace(/\/+$/, '');
		const formattedParams = params.map(toPgParam);
		const res = await fetch(`${endpoint}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${serviceKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query, params: formattedParams, transaction: true })
		});

		const body = await res.json();
		if (!res.ok) {
			throw new Error(body.message || `Database error: status ${res.status}`);
		}
		const rows = (body.rows || []) as T[];
		return rows.map((r) => formatRow(r));
	}

	//- Direct TCP fallback error when HTTP endpoint is not used
	throw new Error(
		`Direct PostgreSQL TCP connection is not supported in Cloudflare Workers. Please configure DATABASE_URL with the AIPSA REST endpoint (https://db.aipsa.in/api/v1/projects/...)`
	);
}

//- Execute an SqlFragment
async function executeFragment<T = unknown>(fragment: SqlFragment): Promise<T[]> {
	const { text, params } = buildQuery(fragment);
	return executeRawQuery<T>(text, params);
}

//- Main sql tagged template and helper interface with type overloads
export function sql<T = Record<string, unknown>>(
	strings: TemplateStringsArray,
	...values: unknown[]
): Promise<T[]> & SqlFragment;
export function sql(ident: string): SqlHelper;
export function sql(obj: Record<string, unknown>): SqlHelper;
export function sql(
	first: TemplateStringsArray | string | Record<string, unknown>,
	...rest: unknown[]
): unknown {
	if (first && Array.isArray(first) && 'raw' in first) {
		return new SqlFragment(first as TemplateStringsArray, rest);
	}
	if (typeof first === 'string') {
		return new SqlHelper('ident', first);
	}
	if (typeof first === 'object' && first !== null) {
		return new SqlHelper('object', first as Record<string, unknown>);
	}
	return first;
}

//- Unsafe raw query execution matching postgres.js interface
sql.unsafe = async function <T = unknown>(query: string, params: unknown[] = []): Promise<T[]> {
	return executeRawQuery<T>(query, params);
};
