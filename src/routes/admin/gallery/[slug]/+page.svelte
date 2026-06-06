<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getStore, setStore, DEFAULT_ALBUMS, DEFAULT_GALLERY_CATEGORIES } from '$lib/stores/data';
	import type { GalleryAlbum, GalleryImage } from '$lib/stores/data';
	import { ArrowLeft, Edit3, Trash2, Plus, Image as ImageIcon } from '@lucide/svelte';

	let album = $state<GalleryAlbum | null>(null);
	let items = $state<GalleryAlbum[]>([]);
	let categories = $state<string[]>([]);

	let showEditModal = $state(false);
	let showDeleteConfirm = $state(false);

	let editForm = $state<GalleryAlbum>({ id: 0, slug: '', title: '', date: '', category: '', cover: '', description: '', images: [] });

	let pendingImages: GalleryImage[] = $state([]);

	let deletingImageId = $state<number | null>(null);

	let showCatModal = $state(false);
	let newCat = $state('');

	function loadAlbum() {
		if (!browser) return;
		items = getStore('albums', DEFAULT_ALBUMS);
		categories = getStore('gallery_categories', DEFAULT_GALLERY_CATEGORIES);
		album = items.find((a) => a.slug === $page.params.slug) ?? null;
	}

	onMount(loadAlbum);

	function saveStore() {
		setStore('albums', items);
	}

	function addCategory() {
		const trimmed = newCat.trim();
		if (trimmed && !categories.includes(trimmed)) {
			categories = [...categories, trimmed];
			setStore('gallery_categories', categories);
		}
		newCat = '';
		showCatModal = false;
	}

	function openEdit() {
		if (!album) return;
		editForm = { ...album, images: album.images.map((i) => ({ ...i })) };
		showEditModal = true;
	}

	function saveEdit() {
		if (!album) return;
		items = items.map((a) => (a.id === album!.id ? { ...editForm, images: editForm.images } : a));
		saveStore();
		album = items.find((a) => a.id === album!.id) ?? null;
		showEditModal = false;
	}

	function deleteAlbum() {
		if (!album) return;
		items = items.filter((a) => a.id !== album!.id);
		saveStore();
		goto('/admin/gallery');
	}

	function addPendingImages() {
		if (!album || pendingImages.length === 0) return;
		items = items.map((a) => {
			if (a.id === album!.id) return { ...a, images: [...a.images, ...pendingImages] };
			return a;
		});
		saveStore();
		album = items.find((a) => a.id === album!.id) ?? null;
		pendingImages = [];
	}

	function handlePendingUpload(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files) return;
		let maxId = 0;
		if (album) maxId = Math.max(0, ...album.images.map((i) => i.id));
		const imgs: GalleryImage[] = [];
		let loaded = 0;
		for (const file of files) {
			const reader = new FileReader();
			reader.onload = () => {
				maxId++;
				imgs.push({ id: maxId, src: reader.result as string, alt: file.name.replace(/\.[^.]+$/, '') });
				loaded++;
				if (loaded === files.length) {
					pendingImages = [...pendingImages, ...imgs];
				}
			};
			reader.readAsDataURL(file);
		}
		(e.target as HTMLInputElement).value = '';
	}

	function confirmDeleteImage(id: number) {
		deletingImageId = id;
	}

	function doDeleteImage() {
		if (!album || deletingImageId === null) return;
		items = items.map((a) => {
			if (a.id === album!.id) {
				return { ...a, images: a.images.filter((i) => i.id !== deletingImageId) };
			}
			return a;
		});
		saveStore();
		album = items.find((a) => a.id === album!.id) ?? null;
		deletingImageId = null;
	}
</script>

{#if album}
	<div class="mb-6 flex items-center justify-between">
		<a href="/admin/gallery" class="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
			<ArrowLeft size={16} /> Back to Gallery
		</a>
		<div class="flex gap-2">
			<button onclick={openEdit}
				class="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">
				<Edit3 size={16} /> Edit Album
			</button>
			<button onclick={() => showDeleteConfirm = true}
				class="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
				<Trash2 size={16} /> Delete
			</button>
		</div>
	</div>

	<div class="mb-8 rounded-xl border border-border bg-surface p-6">
		<div class="flex flex-wrap gap-6">
			<div class="h-40 w-60 shrink-0 overflow-hidden rounded-lg bg-background">
				{#if album.cover}
					<img src={album.cover} alt={album.title} class="h-full w-full object-cover" />
				{:else}
					<div class="flex h-full items-center justify-center"><ImageIcon size={40} class="text-text-muted/40" /></div>
				{/if}
			</div>
			<div class="flex-1">
				<h1 class="text-2xl font-bold text-primary">{album.title}</h1>
				<div class="mt-2 flex flex-wrap items-center gap-3 text-sm">
					<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{album.category}</span>
					<span class="text-text-muted">{album.date}</span>
					<span class="text-text-muted">{album.images.length} images</span>
				</div>
				{#if album.description}
					<p class="mt-3 text-sm text-text-muted leading-relaxed">{album.description}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Add Images -->
	<div class="mb-8 rounded-xl border border-border bg-surface p-5">
		<h2 class="text-base font-semibold text-text mb-4"><Plus size={16} class="inline" /> Add Images</h2>
		<div class="flex flex-wrap items-center gap-3">
			<input type="file" accept="image/*" multiple onchange={handlePendingUpload}
				class="max-w-xs text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
			{#if pendingImages.length > 0}
				<button onclick={addPendingImages}
					class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">Upload {pendingImages.length} image(s)</button>
			{/if}
		</div>
		{#if pendingImages.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each pendingImages as img}
					<div class="h-16 w-20 overflow-hidden rounded-lg border border-border bg-background">
						<img src={img.src} alt={img.alt} class="h-full w-full object-cover" />
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Images -->
	<h2 class="text-lg font-semibold text-text mb-4">Images ({album.images.length})</h2>
	<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
		{#each album.images as img (img.id)}
			<div class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
				<img src={img.src} alt={img.alt} class="h-full w-full object-cover" />
				<div class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
					<button onclick={() => confirmDeleteImage(img.id)}
						class="rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600">
						<Trash2 size={18} />
					</button>
				</div>
			</div>
		{/each}
		{#if album.images.length === 0}
			<div class="col-span-full py-12 text-center text-text-muted">No images yet. Add one above.</div>
		{/if}
	</div>

	<!-- Edit Album Modal -->
	{#if showEditModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showEditModal = false}>
			<div class="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
				<h2 class="text-lg font-semibold text-primary">Edit Album</h2>
				<div class="mt-5 space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1 block text-sm font-medium text-text">Title</label>
							<input type="text" bind:value={editForm.title} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium text-text">Date</label>
							<input type="text" bind:value={editForm.date} placeholder="e.g. January 2026" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="mb-1 block text-sm font-medium text-text">Category</label>
							<select bind:value={editForm.category} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
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
									reader.onload = () => { editForm.cover = reader.result as string; };
									reader.readAsDataURL(file);
								}
							}} class="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
							{#if editForm.cover}
								<div class="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-border bg-background">
									<img src={editForm.cover} alt="Cover preview" class="h-full w-full object-cover" />
								</div>
							{/if}
						</div>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Description</label>
						<textarea bind:value={editForm.description} rows="2" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
					</div>
				</div>
				<div class="mt-6 flex justify-end gap-3">
					<button onclick={() => showEditModal = false} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
					<button onclick={saveEdit} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Delete Album Confirm -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showDeleteConfirm = false}>
			<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
				<h2 class="text-lg font-semibold text-text">Delete Album</h2>
				<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{album.title}" and all its images?</p>
				<div class="mt-6 flex justify-end gap-3">
					<button onclick={() => showDeleteConfirm = false} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
					<button onclick={deleteAlbum} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Delete Image Confirm -->
	{#if deletingImageId !== null}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => deletingImageId = null}>
			<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
				<h2 class="text-lg font-semibold text-text">Delete Image</h2>
				<p class="mt-2 text-sm text-text-muted">Are you sure you want to remove this image?</p>
				<div class="mt-6 flex justify-end gap-3">
					<button onclick={() => deletingImageId = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
					<button onclick={doDeleteImage} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white">Delete</button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="py-16 text-center text-text-muted">
		<p>Album not found.</p>
		<a href="/admin/gallery" class="mt-2 inline-block text-primary hover:underline">Back to Gallery</a>
	</div>
{/if}
