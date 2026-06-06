<script lang="ts">
	import { getStore, setStore, DEFAULT_COURSES } from '$lib/stores/data';
	import type { Course } from '$lib/stores/data';
	import { Eye, Edit3, Trash2, X, Plus } from '@lucide/svelte';

	let items = $state(getStore('courses', DEFAULT_COURSES));
	let search = $state('');
	let showModal = $state(false);
	let editing = $state<Course | null>(null);
	let deleting = $state<Course | null>(null);
	let selected = $state<Course | null>(null);

	let form = $state<Course>({ id: 0, title: '', category: '', duration: '', mode: '', description: '', link: '' });

	let categories = $state(['Administrative', 'Professional Development', 'Finance', 'Technology']);
	const modes = ['Online', 'Offline', 'Hybrid'];

	function save() {
		if (editing) {
			items = items.map((c) => (c.id === editing!.id ? form : c));
		} else {
			form.id = Math.max(0, ...items.map((c) => c.id)) + 1;
			form.link = '/courses/' + form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
			items = [...items, { ...form }];
		}
		setStore('courses', items);
		closeModal();
	}

	function edit(item: Course) {
		editing = item;
		form = { ...item };
		showModal = true;
	}

	function confirmDelete(item: Course) { deleting = item; }

	function doDelete() {
		if (deleting) {
			items = items.filter((c) => c.id !== deleting!.id);
			setStore('courses', items);
			deleting = null;
		}
	}

	function openAdd() {
		editing = null;
		form = { id: 0, title: '', category: '', duration: '', mode: '', description: '', link: '' };
		showModal = true;
	}

	function closeModal() { showModal = false; editing = null; }

	const filtered = $derived(
		items.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
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
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Courses</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<div class="flex gap-2">
		<button onclick={() => showCatModal = true} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface"><Plus size={16} class="inline" /> Create Category</button>
		<button onclick={openAdd} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Course</button>
	</div>
</div>

<div class="mt-4">
	<input type="text" placeholder="Search courses..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Title</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Category</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Duration</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Mode</th>

			</tr>
		</thead>
		<tbody>
			{#each filtered as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50 max-sm:transition-colors" onclick={() => selected = item}>
					<td class="px-4 py-3 font-medium text-text">{item.title}</td>
					<td class="hidden px-4 py-3 text-text-muted md:table-cell">{item.category}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.duration}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.mode}</td>

				</tr>
			{/each}
			{#if filtered.length === 0}
				<tr><td colspan="4" class="px-4 py-8 text-center text-text-muted">No courses found</td></tr>
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
				<input type="text" bind:value={newCat} placeholder="e.g. Science" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
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
			<h2 class="text-lg font-semibold text-primary">{editing ? 'Edit Course' : 'Add Course'}</h2>
			<div class="mt-5 max-h-96 space-y-4 overflow-y-auto">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Title</label>
					<input type="text" bind:value={form.title} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Category</label>
					<select bind:value={form.category} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
						<option value="">Select</option>
						{#each categories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Duration</label>
						<input type="text" bind:value={form.duration} placeholder="e.g. 6 Weeks" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Mode</label>
						<select bind:value={form.mode} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
							<option value="">Select</option>
							{#each modes as m}
								<option value={m}>{m}</option>
							{/each}
						</select>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Description</label>
					<textarea bind:value={form.description} rows="3" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
				</div>
				{#if editing}
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Link</label>
						<input type="text" bind:value={form.link} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
				{/if}
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
			<h2 class="text-lg font-semibold text-text">Delete Course</h2>
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
		<div class="mx-4 w-full max-w-md rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">Course Details</h2>
				<button onclick={() => selected = null} class="text-text-muted hover:text-text"><X size={18} /></button>
			</div>
			<div class="space-y-4 px-5 py-4">
				<h3 class="text-lg font-semibold text-text leading-snug">{selected.title}</h3>
				<div class="flex flex-wrap items-center gap-3 text-sm">
					<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{selected.category}</span>
					<span class="text-text-muted">{selected.duration}</span>
					<span class="rounded-md border border-border px-2.5 py-0.5 text-xs font-medium text-text-muted">{selected.mode}</span>
				</div>
				{#if selected.description}
					<p class="text-sm text-text-muted leading-relaxed">{selected.description}</p>
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
