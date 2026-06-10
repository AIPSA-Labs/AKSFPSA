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
		const id = nextId++;
		const now = new Date();
		const time = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
			now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
		update((actions) => [{ id, text, time, entity }, ...actions].slice(0, 20));
	}

	return { subscribe, add };
}

export const snackbar = createSnackbar();
export const recentActions = createRecentActions();