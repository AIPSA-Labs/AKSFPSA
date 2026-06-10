<script lang="ts">
	import { create, remove as dbRemove } from '$lib/stores/api';
	import type { GalleryImage } from '$lib/stores/data';
	import { ArrowLeft, Check, Upload, LoaderCircle, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { compressImage } from '$lib/utils/compress';
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import { snackbar, recentActions } from '$lib/stores/snackbar';
	import DatePicker from '$lib/components/admin/DatePicker.svelte';

	type FileItem = {
		file: File;
		preview: string;
		compressed: Blob | null;
		uploading: boolean;
		uploadedKey: string | null;
		uploadedId: number | null;
		error: string | null;
	};

	type Category = { id: number; name: string };

	let categories = $state<Category[]>([]);
	let step = $state(1);

	let form = $state({ id: 0, slug: '', title: '', date: '', category: '', cover: '', description: '', images: [] });

	let selectedFiles = $state<FileItem[]>([]);
	let saving = $state(false);
	let coverFile = $state<{ file: File; preview: string; compressed: Blob | null } | null>(null);
	let showCatModal = $state(false);
	let newCat = $state('');
	let catSaving = $state(false);

	onMount(async () => {
		try {
			const cats = await list<Category>('gallery-categories');
			categories = cats.sort((a, b) => a.name.localeCompare(b.name));
		} catch {}
	});

	async function addCategory() {
		const trimmed = newCat.trim();
		if (!trimmed) return;
		catSaving = true;
		try {
			await create('gallery-categories', { name: trimmed });
			const cats = await list<Category>('gallery-categories');
			categories = cats.sort((a, b) => a.name.localeCompare(b.name));
			snackbar.send(`Category "${trimmed}" created`, 'success');
			recentActions.add(`Created gallery category "${trimmed}"`, 'gallery');
		} catch {
			snackbar.send('Failed to create category', 'error');
		}
		newCat = '';
		showCatModal = false;
		catSaving = false;
	}

	async function removeR2File(key: string) {
		try {
			await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ key }), headers: { 'Content-Type': 'application/json' } });
		} catch {}
	}

	async function save() {
		saving = true;
		const uploaded: { key: string; id: number; index: number }[] = [];
		let albumId: number | null = null;
		let uploadFailCount = 0;
		let uploadTotal = 0;
		try {
			const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `album-${Date.now()}`;

			if (coverFile?.compressed) {
				const fd = new FormData();
				fd.set('file', coverFile.compressed, coverFile.file.name);
				const res = await fetch('/api/upload', { method: 'POST', body: fd });
				if (res.ok) {
					const { url, key } = await res.json();
					form.cover = url;
					uploaded.push({ key, id: -1, index: -1 });
				}
			}

			const created = await create<any>('gallery', { ...form, slug });
			albumId = created.id;

			for (let i = 0; i < selectedFiles.length; i++) {
				const item = selectedFiles[i];
				if (!item.compressed) continue;
				uploadTotal++;
				item.uploading = true;
				item.error = null;
				try {
					const fd = new FormData();
					fd.set('file', item.compressed, item.file.name);
					const res = await fetch('/api/upload', { method: 'POST', body: fd });
					if (!res.ok) { item.error = 'Upload failed'; item.uploading = false; uploadFailCount++; continue; }
					const { url, key } = await res.json();
					const img = await create<GalleryImage>('gallery-images', {
						album_id: albumId,
						src: url,
						alt: item.file.name.replace(/\.[^.]+$/, ''),
					});
					item.uploading = false;
					item.uploadedKey = key;
					item.uploadedId = img.id;
					uploaded.push({ key, id: img.id, index: i });
				} catch {
					item.error = 'Upload error';
					item.uploading = false;
					uploadFailCount++;
				}
			}

			if (uploadFailCount === 0) {
				snackbar.send('Album created successfully', 'success');
			} else if (uploadFailCount < uploadTotal) {
				snackbar.send(`Album created. ${uploadFailCount}/${uploadTotal} image(s) failed to upload.`, 'warning');
			} else {
				snackbar.send('Album created but no images were uploaded. Try adding images later.', 'warning');
			}
			recentActions.add(`Created album "${form.title}"`, 'gallery');
			goto('/admin/gallery');
		} catch (e) {
			snackbar.send('Failed to create album. Changes rolled back.', 'error');
			console.error('Save failed:', e);
			for (const u of uploaded) {
				if (u.key) await removeR2File(u.key);
				if (u.id > 0) await dbRemove('gallery-images', u.id).catch(() => {});
			}
			if (albumId !== null) await dbRemove('gallery', albumId).catch(() => {});
		} finally {
			saving = false;
		}
	}

	function nextStep() { step = 2; }
	function prevStep() { step = 1; }
	function goToReview() { step = 3; }

	async function handleCoverSelect(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		try {
			const compressed = await compressImage(file);
			const preview = URL.createObjectURL(file);
			coverFile = { file, preview, compressed };
		} catch {
			snackbar.send('Failed to compress cover image', 'error');
		}
	}

	async function handleFilesSelect(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files) return;
		const items: FileItem[] = [];
		for (const file of files) {
			try {
				const compressed = await compressImage(file);
				const preview = URL.createObjectURL(file);
				items.push({ file, preview, compressed, uploading: false, uploadedKey: null, uploadedId: null, error: null });
			} catch {
				snackbar.send(`Failed to compress "${file.name}"`, 'warning');
			}
		}
		selectedFiles = [...selectedFiles, ...items];
		(e.target as HTMLInputElement).value = '';
	}

	function removeFile(index: number) {
		const removed = selectedFiles[index];
		URL.revokeObjectURL(removed.preview);
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
	}

	function formatSize(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
		return `${(bytes / 1048576).toFixed(1)} MB`;
	}

	const step1Valid = $derived(form.title && form.category);
	const step2Valid = $derived(selectedFiles.length > 0 && selectedFiles.every((f) => f.compressed));
</script>

<div class="mx-auto max-w-3xl">
	<div class="mb-6 flex items-center gap-3">
		<a href="/admin/gallery" class="rounded-lg border border-border p-2 text-text-muted transition hover:bg-surface">
			<ArrowLeft size={18} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-primary">New Album</h1>
			<p class="mt-0.5 text-sm text-text-muted">Create a new gallery album with images</p>
		</div>
	</div>

	<!-- Step Indicator -->
	<div class="mb-8 flex items-center gap-2">
		<div class="flex items-center gap-1.5">
			<div class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold {step >= 1 ? 'bg-primary text-white' : 'border border-border text-text-muted'}">1</div>
			<span class="text-xs {step >= 1 ? 'text-text font-medium' : 'text-text-muted'}">Details</span>
		</div>
		<div class="h-px flex-1 {step >= 2 ? 'bg-primary' : 'bg-border'}"></div>
		<div class="flex items-center gap-1.5">
			<div class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold {step >= 2 ? 'bg-primary text-white' : 'border border-border text-text-muted'}">2</div>
			<span class="text-xs {step >= 2 ? 'text-text font-medium' : 'text-text-muted'}">Images</span>
		</div>
		<div class="h-px flex-1 {step >= 3 ? 'bg-primary' : 'bg-border'}"></div>
		<div class="flex items-center gap-1.5">
			<div class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold {step >= 3 ? 'bg-primary text-white' : 'border border-border text-text-muted'}">3</div>
			<span class="text-xs {step >= 3 ? 'text-text font-medium' : 'text-text-muted'}">Review</span>
		</div>
	</div>

	<div class="rounded-xl border border-border bg-surface p-6">
		{#if step === 1}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-text">Album Details</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Title *</label>
						<input type="text" bind:value={form.title} placeholder="e.g. Annual Conference 2026" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Date</label>
						<DatePicker bind:value={form.date} />
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Category *</label>
						<div class="flex gap-2">
							<select bind:value={form.category} class="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
								<option value="">Select</option>
								{#each categories as cat}
									<option value={cat.name}>{cat.name}</option>
								{/each}
							</select>
							<button onclick={() => { showCatModal = true; newCat = ''; }} class="rounded-lg border border-border px-3 py-2 text-xs text-text-muted hover:bg-background">+</button>
						</div>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-text">Cover Image</label>
						<input type="file" accept="image/*" onchange={handleCoverSelect}
							class="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
						{#if coverFile}
							<div class="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-border bg-background">
								<img src={coverFile.preview} alt="Cover preview" class="h-full w-full object-cover" />
							</div>
						{/if}
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Description</label>
					<textarea bind:value={form.description} rows="2" placeholder="Optional description of the album..."
						class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
				</div>
			</div>
		{:else if step === 2}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-text">Upload Images</h2>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Select Images (multiple allowed)</label>
					<input type="file" accept="image/*" multiple onchange={handleFilesSelect}
						class="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
				</div>

				{#if selectedFiles.length > 0}
					<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
						{#each selectedFiles as item, i}
							<div class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
								<img src={item.preview} alt={item.file.name} class="h-full w-full object-cover" />
								{#if item.compressed}
									<div class="absolute right-1 top-1 rounded-full bg-green-500 p-0.5">
										<Check size={12} class="text-white" />
									</div>
								{/if}
								<button onclick={() => removeFile(i)}
									class="absolute left-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
								</button>
								<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
									<p class="truncate text-xs text-white">{item.file.name}</p>
									<p class="text-[10px] text-white/70">{formatSize(item.file.size)} → {item.compressed ? formatSize(item.compressed.size) : '...'}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background py-14 text-text-muted">
						<Upload size={36} class="mb-2" />
						<p class="text-sm">No images selected yet</p>
						<p class="mt-1 text-xs">Images will be compressed for fast loading</p>
					</div>
				{/if}
			</div>
		{:else if step === 3}
			<div class="space-y-4">
				<h2 class="text-lg font-semibold text-text">Review Album</h2>
				<div class="rounded-lg border border-border bg-background p-4">
					<h3 class="font-semibold text-text">{form.title || '(Untitled)'}</h3>
					<div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
						{#if form.category}<span class="rounded bg-primary/10 px-2 py-0.5 font-medium text-primary">{form.category}</span>{/if}
						{#if form.date}<span>{form.date}</span>{/if}
						<span>{selectedFiles.length} image(s)</span>
					</div>
					{#if form.description}
						<p class="mt-2 text-sm text-text-muted">{form.description}</p>
					{/if}
					{#if coverFile}
						<div class="mt-3 h-24 w-40 overflow-hidden rounded-lg border border-border">
							<img src={coverFile.preview} alt="Cover" class="h-full w-full object-cover" />
						</div>
					{/if}
				</div>

				<div class="grid grid-cols-4 gap-2 sm:grid-cols-5">
					{#each selectedFiles as item, i}
						<div class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background">
							<img src={item.preview} alt={item.file.name} class="h-full w-full object-cover" />
							{#if saving && item.uploading}
								<div class="absolute inset-0 flex items-center justify-center bg-black/50">
									<LoaderCircle size={20} class="animate-spin text-white" />
								</div>
							{/if}
							{#if item.error}
								<div class="absolute inset-x-0 bottom-0 bg-red-500/80 px-1.5 py-0.5 text-[10px] text-white">{item.error}</div>
							{/if}
							{#if !saving}
								<button onclick={() => removeFile(i)}
									class="absolute left-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500">
									<X size={14} />
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-6 flex items-center justify-between">
		<button onclick={() => goto('/admin/gallery')} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
		<div class="flex gap-3">
			{#if step === 1}
				<button onclick={nextStep} disabled={!step1Valid}
					class="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">Next</button>
			{:else if step === 2}
				<button onclick={prevStep} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Back</button>
				<button onclick={goToReview} disabled={!step2Valid}
					class="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">Review</button>
			{:else}
				<button onclick={prevStep} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Back</button>
				<button onclick={save} disabled={saving}
					class="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
					{#if saving}
						<LoaderCircle size={16} class="inline animate-spin" /> Saving...
					{:else}
						Create Album
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>

<!-- Create Category Modal -->
{#if showCatModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => { showCatModal = false; newCat = ''; }}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Create Category</h2>
			<div class="mt-4">
				<label class="mb-1 block text-sm font-medium text-text">Category Name</label>
				<input type="text" bind:value={newCat} placeholder="e.g. Seminar" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
					onkeydown={(e) => { if (e.key === 'Enter') addCategory(); }} />
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => { showCatModal = false; newCat = ''; }} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={addCategory} disabled={!newCat.trim() || catSaving} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if catSaving}<LoaderCircle size={14} class="inline animate-spin" />{:else}Save{/if}</button>
			</div>
		</div>
	</div>
{/if}
