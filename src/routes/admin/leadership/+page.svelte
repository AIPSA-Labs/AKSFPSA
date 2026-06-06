<script lang="ts">
	import { getStore, setStore, DEFAULT_LEADERS } from '$lib/stores/data';
	import type { Leader } from '$lib/stores/data';
	import { Eye, Edit3, Trash2, X, Plus } from '@lucide/svelte';

	let items = $state(getStore('leaders', DEFAULT_LEADERS));
	let showModal = $state(false);
	let editing = $state<Leader | null>(null);
	let deleting = $state<Leader | null>(null);
	let selected = $state<Leader | null>(null);

	let form = $state<Leader>({ name: '', role: '', district: '', image: '', group: 'office-bearers' });

	let roles = $state(['President', 'General Secretary', 'Treasurer', 'Joint Secretary', 'Executive Member']);
	const groups = [
		{ value: 'office-bearers', label: 'Office Bearers' },
		{ value: 'executive-members', label: 'Executive Members' }
	];

	function save() {
		if (editing) {
			items = items.map((l) => (l.name === editing!.name && l.group === editing!.group ? form : l));
		} else {
			items = [...items, { ...form }];
		}
		setStore('leaders', items);
		closeModal();
	}

	function edit(item: Leader) { editing = item; form = { ...item }; showModal = true; }
	function confirmDelete(item: Leader) { deleting = item; selected = null; }

	function doDelete() {
		if (deleting) {
			items = items.filter((l) => !(l.name === deleting!.name && l.group === deleting!.group));
			setStore('leaders', items);
			deleting = null;
		}
	}

	function openAdd() {
		editing = null;
		form = { name: '', role: '', district: '', image: '', group: 'office-bearers' };
		showModal = true;
	}

	function closeModal() { showModal = false; editing = null; }

	const officeBearers = $derived(items.filter((l) => l.group === 'office-bearers'));
	const execMembers = $derived(items.filter((l) => l.group === 'executive-members'));

	let showCatModal = $state(false);
	let newCat = $state('');

	function addCategory() {
		const trimmed = newCat.trim();
		if (trimmed && !roles.includes(trimmed)) {
			roles = [...roles, trimmed];
		}
		newCat = '';
		showCatModal = false;
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Leadership</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} members</p>
	</div>
	<div class="flex gap-2">
		<button onclick={() => showCatModal = true} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface"><Plus size={16} class="inline" /> Create Role</button>
		<button onclick={openAdd} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Member</button>
	</div>
</div>

<!-- Office Bearers -->
<h2 class="mt-8 text-lg font-semibold text-primary">Office Bearers</h2>
<div class="mt-3 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Name</th>
				<th class="px-4 py-3 font-medium text-text-muted">Role</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">District</th>
			</tr>
		</thead>
		<tbody>
			{#each officeBearers as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50 max-sm:transition-colors" onclick={() => selected = item}>
					<td class="px-4 py-3 font-medium text-text">{item.name}</td>
					<td class="px-4 py-3 text-text-muted">{item.role}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.district || '-'}</td>
				</tr>
			{/each}
			{#if officeBearers.length === 0}
				<tr><td colspan="3" class="px-4 py-8 text-center text-text-muted">No office bearers</td></tr>
			{/if}
		</tbody>
	</table>
</div>

<!-- Executive Members -->
<h2 class="mt-8 text-lg font-semibold text-primary">Executive Members</h2>
<div class="mt-3 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Name</th>
				<th class="px-4 py-3 font-medium text-text-muted">Role</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">District</th>
			</tr>
		</thead>
		<tbody>
			{#each execMembers as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50 max-sm:transition-colors" onclick={() => selected = item}>
					<td class="px-4 py-3 font-medium text-text">{item.name}</td>
					<td class="px-4 py-3 text-text-muted">{item.role}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.district || '-'}</td>
				</tr>
			{/each}
			{#if execMembers.length === 0}
				<tr><td colspan="3" class="px-4 py-8 text-center text-text-muted">No executive members</td></tr>
			{/if}
		</tbody>
	</table>
</div>

{#if showCatModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showCatModal = false}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Create Role</h2>
			<div class="mt-4">
				<label class="mb-1 block text-sm font-medium text-text">Role Name</label>
				<input type="text" bind:value={newCat} placeholder="e.g. Vice President" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
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
			<h2 class="text-lg font-semibold text-primary">{editing ? 'Edit Member' : 'Add Member'}</h2>
			<div class="mt-5 space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Name</label>
						<input type="text" bind:value={form.name} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Role</label>
						<select bind:value={form.role} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
							<option value="">Select</option>
							{#each roles as r}
								<option value={r}>{r}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">District</label>
						<input type="text" bind:value={form.district} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Group</label>
						<select bind:value={form.group} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
							{#each groups as g}
								<option value={g.value}>{g.label}</option>
							{/each}
						</select>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Image Path</label>
					<input type="text" bind:value={form.image} placeholder="/images/president.jpg" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
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
				<button onclick={doDelete} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
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
					<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{selected.role}</span>
					<span class="text-text-muted">{selected.district || '-'}</span>
				</div>
				<p class="text-sm text-text-muted">{selected.group === 'office-bearers' ? 'Office Bearers' : 'Executive Members'}</p>
				{#if selected.image}
					<p class="text-sm text-text-muted">Image: {selected.image}</p>
				{/if}
			</div>
			<div class="grid grid-cols-2 gap-2 border-t border-border px-5 py-4">
				<button onclick={(e) => { e.stopPropagation(); selected = null; edit(selected); }}
					class="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">
					<Edit3 size={16} /> Edit
				</button>
				<button onclick={() => confirmDelete(selected)}
					class="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
					<Trash2 size={16} /> Delete
				</button>
			</div>
		</div>
	</div>
{/if}
