<script lang="ts">
	import { onMount } from 'svelte';
	import { list, create, update, remove } from '$lib/stores/api';
	import type { MemberInstitution } from '$lib/stores/data';
	import { Eye, Edit3, Trash2, X, Plus, LoaderCircle } from '@lucide/svelte';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	let items = $state<MemberInstitution[]>([]);
	let loading = $state(true);
	let search = $state('');
	let showModal = $state(false);
	let editing = $state<MemberInstitution | null>(null);
	let deleting = $state<MemberInstitution | null>(null);
	let deletingLoading = $state(false);
	let selected = $state<MemberInstitution | null>(null);

	let form = $state({ id: 0, name: '', district: '', category: 'Recognized', since: '' });

	const districts = ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'];
	let categories = $state(['Recognized', 'Associate']);

	onMount(async () => {
		try {
			items = await list<MemberInstitution>('members');
		} catch (e) {
			console.error('Failed to load members:', e);
		} finally {
			loading = false;
		}
	});

	async function save() {
		if (editing) {
			const updated = await update<MemberInstitution>('members', editing.id, form);
			items = items.map((m) => (m.id === editing!.id ? updated : m));
		} else {
			const created = await create<MemberInstitution>('members', form);
			items = [...items, created];
		}
		const isEditing = !!editing;
		const name = form.name;
		closeModal();
		try { snackbar.send(isEditing ? 'Member updated' : 'Member added', 'success'); recentActions.add(`${isEditing ? 'Updated' : 'Added'} member "${name}"`, 'members'); } catch {}
	}

	function edit(item: MemberInstitution) { editing = item; form = { ...item } as any; showModal = true; }
	function confirmDelete(item: MemberInstitution) { deleting = item; }

	async function doDelete() {
		if (deleting) {
			deletingLoading = true;
			try {
				const name = deleting.name;
				await remove('members', deleting.id);
				items = items.filter((m) => m.id !== deleting!.id);
				deleting = null;
				try { snackbar.send('Member deleted', 'success'); recentActions.add(`Deleted member "${name}"`, 'members'); } catch {}
			} finally { deletingLoading = false; }
		}
	}

	function openAdd() {
		editing = null;
		form = { id: 0, name: '', district: '', category: 'Recognized', since: '' };
		showModal = true;
	}

	function closeModal() { showModal = false; editing = null; }

	const filtered = $derived(
		items.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
	);

	let showCatModal = $state(false);
	let newCat = $state('');

	function addCategory() {
		const trimmed = newCat.trim();
		if (trimmed && !categories.includes(trimmed)) {
			categories = [...categories, trimmed];
		}
		newCat = '';
		showCatModal = false;
		try { snackbar.send(`Category "${trimmed}" created`, 'success'); } catch {}
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Member Institutions</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<div class="flex gap-2">
		<button onclick={() => showCatModal = true} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface"><Plus size={16} class="inline" /> Create Category</button>
		<button onclick={openAdd} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Member</button>
	</div>
</div>

<div class="mt-4">
	<input type="text" placeholder="Search institutions..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Name</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">District</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Category</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Since</th>

			</tr>
		</thead>
		<tbody>
			{#each filtered as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50 max-sm:transition-colors" onclick={() => selected = item}>
					<td class="px-4 py-3 font-medium text-text">{item.name}</td>
					<td class="hidden px-4 py-3 text-text-muted md:table-cell">{item.district}</td>
					<td class="hidden px-4 py-3 sm:table-cell">
						{#if item.category === 'Recognized'}
							<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{item.category}</span>
						{:else}
							<span class="rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium text-text-muted">{item.category}</span>
						{/if}
					</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.since}</td>

				</tr>
			{/each}
			{#if filtered.length === 0}
				<tr><td colspan="5" class="px-4 py-8 text-center text-text-muted">No members found</td></tr>
			{/if}
		</tbody>
	</table>
</div>

{#if showCatModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showCatModal = false}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Create Category</h2>
			<div class="mt-4">
				<label class="mb-1 block text-sm font-medium text-text">Category Name</label>
				<input type="text" bind:value={newCat} placeholder="e.g. Affiliate" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
					onkeydown={(e) => { if (e.key === 'Enter') addCategory(); }} />
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => { showCatModal = false; newCat = ''; }} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={addCategory} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeModal}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editing ? 'Edit Member' : 'Add Member Institution'}</h2>
			<div class="mt-5 space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Institution Name</label>
					<input type="text" bind:value={form.name} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">District</label>
						<select bind:value={form.district} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
							<option value="">Select</option>
							{#each districts as d}
								<option value={d}>{d}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Category</label>
						<select bind:value={form.category} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
							{#each categories as c}
								<option value={c}>{c}</option>
							{/each}
						</select>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Member Since</label>
					<input type="text" bind:value={form.since} placeholder="e.g. 2022" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeModal} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={save} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}

{#if deleting}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => deleting = null}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Delete Member</h2>
			<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{deleting.name}"?</p>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => deleting = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={doDelete} disabled={deletingLoading} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if deletingLoading}<LoaderCircle size={16} class="inline animate-spin" /> Deleting...{:else}Delete{/if}</button>
			</div>
		</div>
	</div>
{/if}

{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selected = null}>
		<div class="mx-4 w-full max-w-md rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">Member Details</h2>
				<button onclick={() => selected = null} class="text-text-muted hover:text-text"><X size={18} /></button>
			</div>
			<div class="space-y-4 px-5 py-4">
				<h3 class="text-lg font-semibold text-text leading-snug">{selected.name}</h3>
				<div class="flex flex-wrap items-center gap-3 text-sm">
					<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{selected.category}</span>
					<span class="text-text-muted">{selected.district}</span>
					<span class="text-text-muted">Since {selected.since}</span>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-2 border-t border-border px-5 py-4">
				<button onclick={(e) => { e.stopPropagation(); const s = selected; selected = null; edit(s!); }}
					class="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">
					<Edit3 size={16} /> Edit
				</button>
				<button onclick={() => { const s = selected; if (s) confirmDelete(s); }}
					class="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
					<Trash2 size={16} /> Delete
				</button>
			</div>
		</div>
	</div>
{/if}
