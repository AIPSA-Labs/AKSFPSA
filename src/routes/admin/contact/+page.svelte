<script lang="ts">
	import { onMount } from 'svelte';
	import { get, create, update, remove, list } from '$lib/stores/api';
	import type { ContactInfo, ContactSubmission } from '$lib/stores/data';
	import { X } from '@lucide/svelte';

	let info = $state<ContactInfo>({ address: '', email: '', phones: [''], hours: '' });
	let editing = $state(false);
	let editForm = $state<ContactInfo>({ address: '', email: '', phones: [''], hours: '' });

	onMount(async () => {
		try {
			info = await get<ContactInfo>('contact-info', 1);
			editForm = { ...info, phones: [...info.phones] };
		} catch (e) {
			console.error('Failed to load contact info:', e);
		}
		try {
			items = await list<ContactSubmission>('contact-submissions');
		} catch (e) {
			console.error('Failed to load submissions:', e);
		}
	});

	async function saveInfo() {
		const updated = await update<ContactInfo>('contact-info', 1, editForm);
		info = updated;
		editing = false;
	}

	function startEdit() {
		editForm = { address: info.address, email: info.email, phones: [...info.phones], hours: info.hours };
		editing = true;
	}

	function addPhone() { editForm.phones = [...editForm.phones, '']; }
	function removePhone(i: number) { editForm.phones = editForm.phones.filter((_, idx) => idx !== i); }

	let items = $state<ContactSubmission[]>([]);

	let filter = $state('all');
	let search = $state('');
	let page = $state(1);
	const perPage = 10;

	const filtered = $derived.by(() => {
		let list = filter === 'all' ? items : items.filter((s) => s.status === filter);
		if (search) {
			const q = search.toLowerCase();
			list = list.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone.includes(q));
		}
		return [...list].reverse();
	});

	let totalPages = $derived(Math.max(1, Math.ceil(filtered.length / perPage)));
	let paginated = $derived(filtered.slice((page - 1) * perPage, page * perPage));

	$effect(() => { filter; search; page = 1; });

	const counts = $derived({
		all: items.length,
		new: items.filter((s) => s.status === 'new').length,
		contacted: items.filter((s) => s.status === 'contacted').length,
		qualified: items.filter((s) => s.status === 'qualified').length,
		converted: items.filter((s) => s.status === 'converted').length,
		closed: items.filter((s) => s.status === 'closed').length,
	});

	// Detail modal (also handles editing)
	let selected = $state<ContactSubmission | null>(null);
	let detailNotes = $state('');

	function openDetail(s: ContactSubmission) {
		selected = { ...s };
		detailNotes = s.notes;
	}

	async function saveDetail() {
		if (!selected) return;
		const s = selected;
		const updated: ContactSubmission = { ...s, notes: detailNotes, status: s.status as ContactSubmission['status'] };
		await update<ContactSubmission>('contact-submissions', s.id, updated);
		items = items.map((r) => r.id === s.id ? updated : r);
		selected = null;
	}

	async function confirmDelete() {
		if (!selected) return;
		const id = selected.id;
		await remove('contact-submissions', id);
		items = items.filter((r) => r.id !== id);
		selected = null;
	}

	function setStatus(st: string) {
		if (!selected) return;
		const s: ContactSubmission = { ...selected, status: st as ContactSubmission['status'] };
		selected = s;
	}

	// Contact info
	let showInfo = $state(false);

	const statusStyle: Record<string, string> = {
		new: 'bg-blue-100 text-blue-700',
		contacted: 'bg-yellow-100 text-yellow-700',
		qualified: 'bg-green-100 text-green-700',
		converted: 'bg-emerald-100 text-emerald-700',
		closed: 'bg-gray-100 text-gray-500',
	};
</script>

<div class="flex items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Enquiries</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<button onclick={() => showInfo = !showInfo} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">
		{showInfo ? 'Close' : 'Contact Info'}
	</button>
</div>

{#if showInfo}
	<div class="mt-4 rounded-xl border border-border bg-surface p-5">
		<div class="flex items-start justify-between gap-2">
			<div class="space-y-1 text-sm">
				<p><span class="text-text-muted">Address:</span> <span class="text-text">{info.address}</span></p>
				<p><span class="text-text-muted">Email:</span> <span class="text-text">{info.email}</span></p>
				<p><span class="text-text-muted">Phones:</span>
					{#each info.phones as ph}
						<span class="block text-text">{ph}</span>
					{/each}
				</p>
				<p><span class="text-text-muted">Hours:</span> <span class="text-text">{info.hours}</span></p>
			</div>
			{#if editing}
				<button onclick={() => editing = false} class="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-background">Cancel</button>
				<button onclick={saveInfo} class="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">Save</button>
			{:else}
				<button onclick={startEdit} class="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-background">Edit</button>
			{/if}
		</div>
		{#if editing}
			<div class="mt-4 space-y-3 border-t border-border pt-4">
				<textarea bind:value={editForm.address} rows="2" class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"></textarea>
				<input type="text" bind:value={editForm.email} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
				<div class="space-y-2">
					{#each editForm.phones as ph, i}
						<div class="flex gap-2">
							<input type="text" bind:value={editForm.phones[i]} placeholder="Phone number"
								class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
							<button onclick={() => removePhone(i)} class="rounded-lg border border-border px-2.5 py-2 text-xs text-red-500 hover:bg-background">x</button>
						</div>
					{/each}
					<button onclick={addPhone} class="text-xs text-primary hover:underline">+ Add number</button>
				</div>
				<input type="text" bind:value={editForm.hours} class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
			</div>
		{/if}
	</div>
{/if}

<!-- Stats -->
<div class="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
	{#each ['all', 'new', 'contacted', 'qualified', 'converted', 'closed'] as status}
		<button onclick={() => filter = status}
			class="rounded-lg border p-3 text-center transition {filter === status ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/30'}">
			<p class="text-lg font-bold text-text">{counts[status as keyof typeof counts]}</p>
			<p class="text-xs capitalize text-text-muted">{status}</p>
		</button>
	{/each}
</div>

<!-- Search -->
<div class="mt-4">
	<input type="text" placeholder="Search name, email, phone..." bind:value={search}
		class="w-full max-w-xs rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none transition focus:border-primary" />
</div>

<!-- Table -->
<div class="mt-4 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Name</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Email / Phone</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Date</th>
				<th class="px-4 py-3 font-medium text-text-muted">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each paginated as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/40 transition-colors" onclick={() => openDetail(item)}>
					<td class="px-4 py-3">
						<p class="font-medium text-text">{item.name}</p>
						<p class="text-xs text-text-muted">{item.institution}</p>
					</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">
						<p>{item.email}</p>
						<p class="text-xs">{item.phone}</p>
					</td>
					<td class="hidden px-4 py-3 text-xs text-text-muted md:table-cell">{item.date}</td>
					<td class="px-4 py-3">
						<span class="inline-block rounded-md px-2 py-0.5 text-xs font-medium {statusStyle[item.status]}">
							{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
						</span>
					</td>
				</tr>
			{/each}
			{#if filtered.length === 0}
				<tr><td colspan="4" class="px-4 py-10 text-center text-sm text-text-muted">No enquiries found</td></tr>
			{/if}
		</tbody>
	</table>
</div>

<!-- Pagination -->
{#if totalPages > 1}
	<div class="mt-4 flex items-center justify-between text-sm">
		<p class="text-text-muted">{filtered.length} total &middot; Page {page} of {totalPages}</p>
		<div class="flex gap-1">
			<button onclick={() => page = Math.max(1, page - 1)} disabled={page === 1}
				class="rounded-lg border border-border px-3 py-1.5 text-text-muted transition hover:bg-surface disabled:opacity-40">
				Prev
			</button>
			{#each Array(totalPages) as _, i}
				<button onclick={() => page = i + 1}
					class="rounded-lg border px-3 py-1.5 transition {page === i + 1 ? 'border-primary bg-primary text-white' : 'border-border text-text-muted hover:bg-surface'}">
					{i + 1}
				</button>
			{/each}
			<button onclick={() => page = Math.min(totalPages, page + 1)} disabled={page === totalPages}
				class="rounded-lg border border-border px-3 py-1.5 text-text-muted transition hover:bg-surface disabled:opacity-40">
				Next
			</button>
		</div>
	</div>
{/if}

<!-- Detail Modal (with inline editing) -->
{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selected = null}>
		<div class="mx-4 w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">{selected.name}</h2>
				<button onclick={() => selected = null} class="rounded-full p-1 text-text-muted transition hover:bg-background"><X size={18} /></button>
			</div>

			<div class="max-h-80 space-y-4 overflow-y-auto px-5 py-4">
				<div class="text-sm text-text-muted space-y-1">
					<p><span class="font-medium text-text">Institution:</span> {selected.institution}</p>
					<p><span class="font-medium text-text">Email:</span> {selected.email}</p>
					<p><span class="font-medium text-text">Phone:</span> {selected.phone}</p>
					<p><span class="font-medium text-text">Date:</span> {selected.date}</p>
				</div>

				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Message</p>
					<p class="mt-1 whitespace-pre-wrap rounded-lg bg-background p-3 text-sm text-text">{selected.message}</p>
				</div>

				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Status</p>
					<div class="mt-1 flex flex-wrap gap-1.5">
						{#each ['new', 'contacted', 'qualified', 'converted', 'closed'] as st}
							<button onclick={() => setStatus(st)}
								class="rounded-md border px-2.5 py-1 text-xs font-medium transition {selected.status === st ? statusStyle[st] : 'border-border text-text-muted hover:bg-background'}">
								{st.charAt(0).toUpperCase() + st.slice(1)}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Internal Notes</p>
					<textarea bind:value={detailNotes} rows="3" placeholder="Add notes..."
						class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"></textarea>
				</div>
			</div>

			<div class="flex justify-between border-t border-border px-5 py-4">
				<button onclick={confirmDelete} class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">Delete</button>
				<div class="flex gap-3">
					<button onclick={() => selected = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
					<button onclick={saveDetail} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
				</div>
			</div>
		</div>
	</div>
{/if}
