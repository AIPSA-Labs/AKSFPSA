<script lang="ts">
	import { getStore, setStore, DEFAULT_ALBUMS, DEFAULT_GALLERY_CATEGORIES } from '$lib/stores/data';
	import type { GalleryAlbum, GalleryImage } from '$lib/stores/data';
	import { Plus, Image as ImageIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let items = $state(getStore('albums', DEFAULT_ALBUMS));
	let search = $state('');
	let catFilter = $state('All');
	let showModal = $state(false);
	let editing = $state<GalleryAlbum | null>(null);
	let categories = $state(getStore('gallery_categories', DEFAULT_GALLERY_CATEGORIES));

	let form = $state<GalleryAlbum>({ id: 0, slug: '', title: '', date: '', category: '', cover: '', description: '', images: [] });

	let showCatModal = $state(false);
	let newCat = $state('');

	function addCategory() {
		const trimmed = newCat.trim();
		if (trimmed && !categories.includes(trimmed)) {
			categories = [...categories, trimmed];
			setStore('gallery_categories', categories);
		}
		newCat = '';
		showCatModal = false;
	}

	function save() {
		if (editing) {
			items = items.map((a) => (a.id === editing!.id ? form : a));
		} else {
			form.id = Math.max(0, ...items.map((a) => a.id)) + 1;
			form.slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
			items = [...items, { ...form }];
		}
		setStore('albums', items);
		closeModal();
	}

	function edit(item: GalleryAlbum) {
		editing = item;
		form = { ...item, images: item.images.map((i) => ({ ...i })) };
		showModal = true;
	}

	function openAdd() {
		editing = null;
		form = { id: 0, slug: '', title: '', date: '', category: '', cover: '', description: '', images: [] };
		showModal = true;
	}

	function closeModal() { showModal = false; editing = null; }

	const filtered = $derived(
		items.filter((a) => {
			if (catFilter !== 'All' && a.category !== catFilter) return false;
			return a.title.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Gallery</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} albums</p>
	</div>
	<div class="flex gap-2">
		<button onclick={() => showCatModal = true} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface"><Plus size={16} class="inline" /> Create Category</button>
		<button onclick={openAdd} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Album</button>
	</div>
</div>

<div class="mt-4 flex flex-wrap items-center gap-3">
	<input type="text" placeholder="Search albums..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
	<div class="flex flex-wrap gap-1">
		<button onclick={() => catFilter = 'All'} class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === 'All' ? 'bg-primary text-white' : 'border border-border text-text-muted hover:bg-surface'}">All</button>
		{#each categories as cat}
			<button onclick={() => catFilter = cat} class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === cat ? 'bg-primary text-white' : 'border border-border text-text-muted hover:bg-surface'}">{cat}</button>
		{/each}
	</div>
</div>

<div class="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
	{#each filtered as item}
		<div class="cursor-pointer rounded-xl border border-border bg-surface p-4 transition hover:shadow-md" onclick={() => goto(`/admin/gallery/${item.slug}`)}>
			<div class="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-background">
				{#if item.cover}
					<img src={item.cover} alt={item.title} class="h-full w-full object-cover" />
				{:else}
					<ImageIcon size={40} class="text-text-muted/40" />
				{/if}
			</div>
			<h3 class="font-semibold text-text">{item.title}</h3>
			<p class="mt-0.5 text-xs text-text-muted">{item.date}</p>
			<div class="mt-2 flex items-center gap-2">
				<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{item.category}</span>
				<span class="text-xs text-text-muted">{item.images.length} images</span>
			</div>
		</div>
	{/each}
	{#if filtered.length === 0}
		<div class="col-span-full py-10 text-center text-text-muted">No albums found</div>
	{/if}
</div>

<!-- Create Category Modal -->
{#if showCatModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showCatModal = false}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Create Category</h2>
			<div class="mt-4">
				<label class="mb-1 block text-sm font-medium text-text">Category Name</label>
				<input type="text" bind:value={newCat} placeholder="e.g. Seminar" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
					onkeydown={(e) => { if (e.key === 'Enter') addCategory(); }} />
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => { showCatModal = false; newCat = ''; }} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={addCategory} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}

<!-- Add/Edit Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeModal}>
		<div class="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editing ? 'Edit Album' : 'Add Album'}</h2>
			<div class="mt-5 max-h-[70vh] space-y-4 overflow-y-auto">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Title</label>
						<input type="text" bind:value={form.title} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Date</label>
						<input type="text" bind:value={form.date} placeholder="e.g. January 2026" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Category</label>
						<select bind:value={form.category} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
							<option value="">Select</option>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Cover Image</label>
						<input type="file" accept="image/*" onchange={(e) => {
							const file = (e.target as HTMLInputElement).files?.[0];
							if (file) {
								const reader = new FileReader();
								reader.onload = () => { form.cover = reader.result as string; };
								reader.readAsDataURL(file);
							}
						}} class="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
						{#if form.cover}
							<div class="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-border bg-background">
								<img src={form.cover} alt="Cover preview" class="h-full w-full object-cover" />
							</div>
						{/if}
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Description</label>
					<textarea bind:value={form.description} rows="2" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeModal} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={save} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}



