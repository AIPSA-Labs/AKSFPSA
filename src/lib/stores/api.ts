const BASE = '/api/data';

export async function list<T = Record<string, unknown>>(entity: string, params?: Record<string, string>): Promise<T[]> {
	const query = params ? '?' + new URLSearchParams(params) : '';
	const res = await fetch(`${BASE}/${entity}${query}`);
	if (!res.ok) throw new Error(`Failed to fetch ${entity}`);
	return res.json();
}

export async function get<T = Record<string, unknown>>(entity: string, id: number | string): Promise<T> {
	const res = await fetch(`${BASE}/${entity}/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch ${entity}/${id}`);
	return res.json();
}

export async function create<T = Record<string, unknown>>(entity: string, data: Record<string, unknown>): Promise<T> {
	const res = await fetch(`${BASE}/${entity}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to create ${entity}`);
	return res.json();
}

export async function update<T = Record<string, unknown>>(entity: string, id: number | string, data: Record<string, unknown>): Promise<T> {
	const res = await fetch(`${BASE}/${entity}/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error(`Failed to update ${entity}`);
	return res.json();
}

export async function remove(entity: string, id: number | string): Promise<void> {
	const res = await fetch(`${BASE}/${entity}/${id}`, { method: 'DELETE' });
	if (!res.ok) throw new Error(`Failed to delete ${entity}`);
}
