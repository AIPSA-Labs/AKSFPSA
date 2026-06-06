<script lang="ts">
	import { getStore, setStore, DEFAULT_ALBUMS } from '$lib/stores/data';
	import type { Album } from '$lib/stores/data';

	let items = $state(getStore('albums', DEFAULT_ALBUMS));
	let search = $state('');
	let showModal = $state(false);
	let editing = $state<Album | null>(null);
	let deleting = $state<Album | null>(null);

	let form = $state<Album>({ slug: '', title: '', date: '', cover: '', description: '' });

	function save() {
		if (editing) {
			items = items.map((a) => (a.slug === editing!.slug ? form : a));
		} else {
			form.slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
			items = [...items, { ...form }];
		}
		setStore('albums', items);
		closeModal();
	}

	function edit(item: Album) { editing = item; form = { ...item }; showModal = true; }
	function confirmDelete(item: Album) { deleting = item; }

	function doDelete() {
		if (deleting) {
			items = items.filter((a) => a.slug !== deleting!.slug);
			setStore('albums', items);
			deleting = null;
		}
	}

	function openAdd() {
		editing = null;
		form = { slug: '', title: '', date: '', cover: '', description: '' };
		showModal = true;
	}

	function closeModal() { showModal = false; editing = null; }

	function resetDefaults() {
		items = [...DEFAULT_ALBUMS];
		setStore('albums', items);
	}

	const filtered = $derived(
		items.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
	);
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Gallery Albums</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<div class="flex gap-2">
		<button onclick={resetDefaults} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">Reset</button>
		<button onclick={openAdd} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Album</button>
	</div>
</div>

<div class="mt-4">
	<input type="text" placeholder="Search albums..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
</div>

<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
	{#each filtered as item}
		<div class="rounded-xl border border-border bg-surface p-4">
			<div class="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-background">
				<img src={item.cover} alt={item.title} class="h-full w-full object-cover" />
			</div>
			<h3 class="font-semibold text-text">{item.title}</h3>
			<p class="mt-0.5 text-xs text-text-muted">{item.date}</p>
			<p class="mt-1 line-clamp-2 text-xs text-text-muted">{item.description}</p>
			<div class="mt-3 flex gap-2">
				<button onclick={() => edit(item)} class="text-xs font-medium text-primary hover:underline">Edit</button>
				<button onclick={() => confirmDelete(item)} class="text-xs font-medium text-red-500 hover:underline">Delete</button>
			</div>
		</div>
	{/each}
	{#if filtered.length === 0}
		<div class="col-span-full py-10 text-center text-text-muted">No albums found</div>
	{/if}
</div>

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeModal}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editing ? 'Edit Album' : 'Add Album'}</h2>
			<div class="mt-5 space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Title</label>
					<input type="text" bind:value={form.title} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Date</label>
						<input type="text" bind:value={form.date} placeholder="e.g. January 2026" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Cover Image Path</label>
						<input type="text" bind:value={form.cover} placeholder="/images/gallery/cover.jpg" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Description</label>
					<textarea bind:value={form.description} rows="3" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
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
			<h2 class="text-lg font-semibold text-text">Delete Album</h2>
			<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{deleting.title}"?</p>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => deleting = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={doDelete} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
			</div>
		</div>
	</div>
{/if}
