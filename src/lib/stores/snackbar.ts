import { writable } from 'svelte/store';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export type SnackbarMessage = {
	id: number;
	text: string;
	type: SnackbarType;
};

export type RecentAction = {
	id: number;
	text: string;
	time: string;
	entity: string;
};

function createSnackbar() {
	const { subscribe, update } = writable<SnackbarMessage[]>([]);
	let nextId = 1;

	function send(text: string, type: SnackbarType = 'info', duration = 4000) {
		const id = nextId++;
		update((msgs) => [...msgs, { id, text, type }]);
		setTimeout(() => {
			update((msgs) => msgs.filter((m) => m.id !== id));
		}, duration);
	}

	return { subscribe, send };
}

function createRecentActions() {
	const { subscribe, update } = writable<RecentAction[]>([]);
	let nextId = 1;

	function add(text: string, entity: string) {
		const now = new Date();
		const time = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
			now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
		const optimistic: RecentAction = { id: nextId++, text, time, entity };
		update((actions) => [optimistic, ...actions].slice(0, 50));
		fetch('/api/admin/actions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text, entity }),
		}).then(async (res) => {
			if (res.ok) {
				const saved = await res.json();
				update((actions) =>
					actions.map((a) => (a.id === optimistic.id ? { ...a, id: saved.id } : a))
				);
			}
		}).catch(() => {});
	}

	async function load() {
		try {
			const res = await fetch('/api/admin/actions');
			if (res.ok) {
				const rows = await res.json();
				update(() =>
					rows.map((r: { id: number; text: string; entity: string; created_at: string }) => {
						const d = new Date(r.created_at);
						const time = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
							d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
						return { id: r.id, text: r.text, time, entity: r.entity };
					})
				);
				nextId = rows.length > 0 ? Math.max(...rows.map((r: { id: number }) => r.id)) + 1 : 1;
			}
		} catch {}
	}

	return { subscribe, add, load };
}

export const snackbar = createSnackbar();
export const recentActions = createRecentActions();