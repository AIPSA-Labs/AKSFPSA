<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { list, create, update, remove } from '$lib/stores/api';
	import type { GalleryAlbum, GalleryImage } from '$lib/stores/data';
	import { ArrowLeft, Edit3, Trash2, Plus, Image as ImageIcon, LoaderCircle } from '@lucide/svelte';
	import { compressImage } from '$lib/utils/compress';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	let categories = $state(['Conference', 'Meeting', 'Workshop']);
	let album = $state<GalleryAlbum | null>(null);

	let showEditModal = $state(false);
	let showDeleteConfirm = $state(false);

	let editForm = $state({ id: 0, slug: '', title: '', date: '', category: '', cover: '', description: '', images: [] });

	let pendingImages: (GalleryImage & { uploading?: boolean })[] = $state([]);

	let deletingImageId = $state<number | null>(null);
	let savingEdit = $state(false);
	let deletingAlbum = $state(false);
	let deletingImageLoading = $state(false);

	onMount(async () => {
		try {
			const items = await list<GalleryAlbum>('gallery');
			album = items.find((a) => a.slug === $page.params.slug) ?? null;
		} catch (e) {
			console.error('Failed to load albums:', e);
		}
	});

	function openEdit() {
		if (!album) return;
		editForm = { ...album, images: album.images.map((i) => ({ ...i })) } as any;
		showEditModal = true;
	}

	async function saveEdit() {
		if (!album) return;
		savingEdit = true;
		try {
			const data = { ...editForm };
			const updated = await update<GalleryAlbum>('gallery', album.id, data);
			album = updated;
			showEditModal = false;
			snackbar.send('Album updated', 'success');
			recentActions.add(`Updated album "${album.title}"`, 'gallery');
		} finally { savingEdit = false; }
	}

	async function deleteAlbum() {
		if (!album) return;
		deletingAlbum = true;
		try {
			const title = album.title;
			await remove('gallery', album.id);
			snackbar.send(`Album "${title}" deleted`, 'success');
			recentActions.add(`Deleted album "${title}"`, 'gallery');
			goto('/admin/gallery');
		} finally { deletingAlbum = false; }
	}

	async function handlePendingUpload(e: Event) {
		const fileList = (e.target as HTMLInputElement).files;
		if (!fileList || !album) return;
		const files = Array.from(fileList);
		let addedCount = 0;
		let failCount = 0;

		for (const file of files) {
			const placeholderId = -Date.now() - Math.random();
			const placeholder: any = { id: placeholderId, album_id: album.id, src: URL.createObjectURL(file), alt: file.name.replace(/\.[^.]+$/, ''), uploading: true };
			pendingImages = [...pendingImages, placeholder];
		}

		(e.target as HTMLInputElement).value = '';

		for (let i = 0; i < pendingImages.length; i++) {
			const p = pendingImages[i];
			if (!p.uploading) continue;
			const fileIdx = i - (pendingImages.length - files.length);
			const file = files[fileIdx];
			if (!file) continue;
			try {
				const compressed = await compressImage(file);
				const formData = new FormData();
				formData.set('file', compressed, file.name);
				const res = await fetch('/api/upload', { method: 'POST', body: formData });
				if (res.ok) {
					const { url } = await res.json();
					const created = await create<GalleryImage>('gallery-images', { album_id: album.id, src: url, alt: file.name.replace(/\.[^.]+$/, '') });
					pendingImages[i] = { ...created, uploading: false };
					addedCount++;
				} else {
					pendingImages[i] = { ...p, uploading: false, error: 'Upload failed' };
					failCount++;
				}
			} catch {
				pendingImages[i] = { ...p, uploading: false, error: 'Upload error' };
				failCount++;
			}
		}

		if (failCount > 0) {
			snackbar.send(`${failCount} image(s) failed to upload`, 'warning');
		}
		if (addedCount > 0 && failCount === 0) {
			snackbar.send(`${addedCount} image(s) uploaded successfully`, 'success');
		}
	}

	async function addPendingImages() {
		if (!album || pendingImages.length === 0) return;
		const good = pendingImages.filter((p) => !(p as any).error);
		if (good.length === 0) {
			snackbar.send('No images to add — all failed to upload', 'error');
			return;
		}
		album = { ...album, images: [...album.images, ...good] };
		pendingImages = [];
		const count = good.length;
		snackbar.send(`${count} image(s) added to album`, 'success');
		recentActions.add(`Added images to album "${album.title}"`, 'gallery');
	}

	function confirmDeleteImage(id: number) {
		deletingImageId = id;
	}

	async function doDeleteImage() {
		if (!album || deletingImageId === null) return;
		deletingImageLoading = true;
		try {
			await remove('gallery-images', deletingImageId);
			album = { ...album, images: album.images.filter((i) => i.id !== deletingImageId) };
			snackbar.send('Image deleted', 'success');
		} finally { deletingImageId = null; deletingImageLoading = false; }
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
			{#if pendingImages.filter((p) => !(p as any).uploading && !(p as any).error).length > 0}
				{@const good = pendingImages.filter((p) => !(p as any).uploading && !(p as any).error)}
				<button onclick={addPendingImages}
					class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">Add {good.length} image(s)</button>
			{/if}
		</div>
		{#if pendingImages.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each pendingImages as img}
					<div class="relative h-16 w-20 overflow-hidden rounded-lg border border-border bg-background">
						<img src={img.src} alt={img.alt} class="h-full w-full object-cover" />
						{#if (img as any).uploading}
							<div class="absolute inset-0 flex items-center justify-center bg-black/40">
								<LoaderCircle size={18} class="animate-spin text-white" />
							</div>
						{/if}
						{#if (img as any).error}
							<div class="absolute inset-x-0 bottom-0 bg-red-500/80 px-1 py-0.5 text-[10px] text-white leading-tight">{(img as any).error}</div>
						{/if}
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
							<input type="file" accept="image/*" onchange={async (e) => {
								const file = (e.target as HTMLInputElement).files?.[0];
								if (file) {
									const fd = new FormData();
									fd.set('file', file);
									const res = await fetch('/api/upload', { method: 'POST', body: fd });
									if (res.ok) {
										const { url } = await res.json();
										editForm.cover = url;
									}
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
					<button onclick={saveEdit} disabled={savingEdit} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if savingEdit}<LoaderCircle size={14} class="inline animate-spin" />{:else}Save{/if}</button>
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
					<button onclick={deleteAlbum} disabled={deletingAlbum} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if deletingAlbum}<LoaderCircle size={14} class="inline animate-spin" />{:else}Delete{/if}</button>
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
					<button onclick={doDeleteImage} disabled={deletingImageLoading} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if deletingImageLoading}<LoaderCircle size={14} class="inline animate-spin" />{:else}Delete{/if}</button>
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
