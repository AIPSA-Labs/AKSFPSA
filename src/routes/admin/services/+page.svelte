<script lang="ts">
	import { getStore, setStore, DEFAULT_SERVICES } from '$lib/stores/data';
	import type { Service } from '$lib/stores/data';
	import { Edit3, Trash2, X } from '@lucide/svelte';

	let items = $state(getStore('services', DEFAULT_SERVICES));
	let showModal = $state(false);
	let editing = $state<Service | null>(null);
	let deleting = $state<Service | null>(null);
	let selected = $state<Service | null>(null);

	let form = $state<Service>({ id: 0, title: '', description: '', icon: 'BookOpen', order: 0 });

	const iconOptions = ['GraduationCap', 'Monitor', 'BookOpen', 'Globe', 'School', 'Award', 'Users', 'FileText'];

	function save() {
		if (editing) {
			items = items.map((s) => (s.id === editing!.id ? form : s));
		} else {
			form.id = Math.max(0, ...items.map((s) => s.id)) + 1;
			form.order = items.length + 1;
			items = [...items, { ...form }];
		}
		setStore('services', items);
		closeModal();
	}

	function edit(item: Service) {
		editing = item;
		form = { ...item };
		showModal = true;
	}

	function confirmDelete(item: Service) { deleting = item; }

	function doDelete() {
		if (deleting) {
			items = items.filter((s) => s.id !== deleting!.id);
			setStore('services', items);
			deleting = null;
		}
	}

	function openAdd() {
		editing = null;
		form = { id: 0, title: '', description: '', icon: 'BookOpen', order: items.length + 1 };
		showModal = true;
	}

	function closeModal() { showModal = false; editing = null; }

	function moveUp(index: number) {
		if (index === 0) return;
		[items[index], items[index - 1]] = [items[index - 1], items[index]];
		items = items.map((s, i) => ({ ...s, order: i + 1 }));
		setStore('services', items);
	}

	function moveDown(index: number) {
		if (index === items.length - 1) return;
		[items[index], items[index + 1]] = [items[index + 1], items[index]];
		items = items.map((s, i) => ({ ...s, order: i + 1 }));
		setStore('services', items);
	}
</script>

<div class="flex items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Services</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<button onclick={openAdd} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Service</button>
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted w-10">#</th>
				<th class="px-4 py-3 font-medium text-text-muted">Title</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Description</th>
				<th class="px-4 py-3 font-medium text-text-muted w-24"></th>
			</tr>
		</thead>
		<tbody>
			{#each items as item, i}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50" onclick={() => selected = item}>
					<td class="px-4 py-3 text-text-muted">{item.order}</td>
					<td class="px-4 py-3 font-medium text-text">{item.title}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell max-w-xs truncate">{item.description}</td>
					<td class="px-4 py-3">
						<div class="flex gap-1" onclick={(e) => e.stopPropagation()}>
							<button onclick={() => moveUp(i)} disabled={i === 0} class="rounded p-1 text-text-muted transition hover:bg-background disabled:opacity-30">↑</button>
							<button onclick={() => moveDown(i)} disabled={i === items.length - 1} class="rounded p-1 text-text-muted transition hover:bg-background disabled:opacity-30">↓</button>
						</div>
					</td>
				</tr>
			{/each}
			{#if items.length === 0}
				<tr><td colspan="4" class="px-4 py-8 text-center text-text-muted">No services added yet</td></tr>
			{/if}
		</tbody>
	</table>
</div>

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeModal}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editing ? 'Edit Service' : 'Add Service'}</h2>
			<div class="mt-5 space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Title</label>
					<input type="text" bind:value={form.title} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Icon</label>
					<select bind:value={form.icon} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
						{#each iconOptions as icon}
							<option value={icon}>{icon}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Description</label>
					<textarea bind:value={form.description} rows="4" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
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
			<h2 class="text-lg font-semibold text-text">Delete Service</h2>
			<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{deleting.title}"?</p>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => deleting = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={doDelete} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
			</div>
		</div>
	</div>
{/if}

{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selected = null}>
		<div class="mx-4 w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">Service Details</h2>
				<button onclick={() => selected = null} class="text-text-muted hover:text-text"><X size={18} /></button>
			</div>
			<div class="space-y-4 px-5 py-4">
				<div class="flex items-center gap-3">
					<span class="text-2xl">{['🎓','💻','📖','🌐','🏫','🏆','👥','📄'][iconOptions.indexOf(selected.icon)] || '📋'}</span>
					<h3 class="text-lg font-semibold text-text">{selected.title}</h3>
				</div>
				<p class="text-sm text-text-muted leading-relaxed">{selected.description}</p>
				<p class="text-xs text-text-muted">Order: {selected.order}</p>
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
