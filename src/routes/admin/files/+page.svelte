<script lang="ts">
	import { onMount } from 'svelte';
	import { list, create, remove } from '$lib/stores/api';
	import type { UploadedFile } from '$lib/stores/data';
	import { Upload, Trash2, Download, Copy, X, File, FileImage, FileText, FolderOpen } from '@lucide/svelte';

	let items = $state<UploadedFile[]>([]);
	let loading = $state(true);
	let search = $state('');
	let typeFilter = $state('All');
	let showUploadModal = $state(false);
	let selected = $state<UploadedFile | null>(null);
	let deleting = $state<UploadedFile | null>(null);
	let pendingFiles: { name: string; type: string; size: number; data: string }[] = $state([]);
	let uploadError = $state('');

	const fileTypes = ['All', 'Images', 'PDFs', 'Documents', 'Others'];

	onMount(async () => {
		try {
			items = await list<UploadedFile>('files');
		} catch (e) {
			console.error('Failed to load files:', e);
		} finally {
			loading = false;
		}
	});

	function getFileCategory(type: string): string {
		if (type.startsWith('image/')) return 'Images';
		if (type === 'application/pdf') return 'PDFs';
		if (type.startsWith('text/') || type.includes('document') || type.includes('sheet') || type.includes('presentation')) return 'Documents';
		return 'Others';
	}

	function getFileIcon(type: string): string {
		if (type.startsWith('image/')) return 'image';
		if (type === 'application/pdf') return 'pdf';
		if (type.startsWith('text/')) return 'text';
		return 'file';
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / 1048576).toFixed(1) + ' MB';
	}

	const filtered = $derived(
		items.filter((f) => {
			if (typeFilter !== 'All' && getFileCategory(f.type) !== typeFilter) return false;
			return f.name.toLowerCase().includes(search.toLowerCase());
		})
	);

	async function handleFileSelect(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files || files.length === 0) return;
		uploadError = '';
		const newFiles: { name: string; type: string; size: number; data: string }[] = [];
		for (const file of Array.from(files)) {
			const formData = new FormData();
			formData.set('file', file);
			formData.set('folder', 'files');
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			if (res.ok) {
				const { url } = await res.json();
				newFiles.push({ name: file.name, type: file.type, size: file.size, data: url });
			} else {
				uploadError = `Failed to upload ${file.name}`;
			}
		}
		pendingFiles = [...pendingFiles, ...newFiles];
		(e.target as HTMLInputElement).value = '';
	}

	function removePending(index: number) {
		pendingFiles = pendingFiles.filter((_, i) => i !== index);
	}

	async function doUpload() {
		if (pendingFiles.length === 0) return;
		const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
		for (const pf of pendingFiles) {
			const created = await create<UploadedFile>('files', {
				name: pf.name,
				type: pf.type,
				size: pf.size,
				data: pf.data,
				date
			});
			items = [...items, created];
		}
		pendingFiles = [];
		showUploadModal = false;
	}

	function closeUploadModal() {
		pendingFiles = [];
		uploadError = '';
		showUploadModal = false;
	}

	function extractR2Key(url: string): string | null {
		try { return new URL(url).pathname.replace(/^\//, ''); } catch { return null; }
	}

	function copyDataUrl(file: UploadedFile) {
		navigator.clipboard.writeText(file.data);
	}

	function downloadFile(file: UploadedFile) {
		const a = document.createElement('a');
		a.href = file.data;
		a.download = file.name;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	function confirmDelete(file: UploadedFile) {
		deleting = file;
	}

	async function doDelete() {
		if (!deleting) return;
		if (deleting.data.startsWith('http')) {
			const key = extractR2Key(deleting.data);
			if (key) await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ key }), headers: { 'Content-Type': 'application/json' } });
		}
		await remove('files', deleting.id);
		items = items.filter((f) => f.id !== deleting!.id);
		if (selected?.id === deleting!.id) selected = null;
		deleting = null;
	}

	function openDetail(file: UploadedFile) {
		selected = file;
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">File Manager</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} file(s)</p>
	</div>
	<button onclick={() => showUploadModal = true}
		class="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">
		<Upload size={16} /> Upload Files
	</button>
</div>

<div class="mt-4 flex flex-wrap items-center gap-3">
	<input type="text" placeholder="Search files..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
	<div class="flex flex-wrap gap-1">
		{#each fileTypes as ft}
			<button onclick={() => typeFilter = ft}
				class="rounded-lg px-3 py-1.5 text-xs font-medium transition {typeFilter === ft ? 'bg-primary text-white' : 'border border-border text-text-muted hover:bg-surface'}">{ft}</button>
		{/each}
	</div>
</div>

<div class="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each filtered as file}
		<div class="group relative cursor-pointer rounded-xl border border-border bg-surface p-3 transition hover:shadow-md" onclick={() => openDetail(file)}>
			<div class="mb-2 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-background">
				{#if file.type.startsWith('image/')}
					<img src={file.data} alt={file.name} class="h-full w-full object-cover" />
				{:else if file.type === 'application/pdf'}
					<FileText size={40} class="text-red-400" />
				{:else if file.type.startsWith('text/')}
					<FileText size={40} class="text-blue-400" />
				{:else}
					<File size={40} class="text-text-muted/40" />
				{/if}
			</div>
			<button onclick={(e) => { e.stopPropagation(); confirmDelete(file); }}
				class="absolute right-2 top-2 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition hover:bg-black/70 group-hover:opacity-100">
				<Trash2 size={14} />
			</button>
			<p class="truncate text-sm font-medium text-text">{file.name}</p>
			<p class="text-xs text-text-muted">{formatSize(file.size)}</p>
		</div>
	{/each}
	{#if filtered.length === 0}
		<div class="col-span-full py-10 text-center text-text-muted">No files found</div>
	{/if}
</div>

<!-- Upload Modal -->
{#if showUploadModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeUploadModal}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-primary"><Upload size={18} class="inline" /> Upload Files</h2>
				<button onclick={closeUploadModal} class="rounded-lg p-1 text-text-muted hover:bg-background"><X size={18} /></button>
			</div>
			<div class="mt-4">
				<label class="mb-2 block text-sm font-medium text-text">Select files</label>
				<input type="file" multiple onchange={handleFileSelect}
					class="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
			</div>
			{#if uploadError}
				<p class="mt-2 text-sm text-red-500">{uploadError}</p>
			{/if}
			{#if pendingFiles.length > 0}
				<div class="mt-4 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border bg-background p-3">
					{#each pendingFiles as pf, i}
						<div class="flex items-center justify-between gap-2">
							<div class="min-w-0 flex-1 truncate">
								<p class="truncate text-sm font-medium text-text">{pf.name}</p>
								<p class="text-xs text-text-muted">{formatSize(pf.size)}</p>
							</div>
							<button onclick={() => removePending(i)} class="shrink-0 rounded-lg p-1 text-text-muted hover:bg-surface"><X size={14} /></button>
						</div>
					{/each}
				</div>
				<div class="mt-6 flex justify-end gap-3">
					<button onclick={closeUploadModal} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
					<button onclick={doUpload} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Upload {pendingFiles.length} file(s)</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Detail Modal -->
{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selected = null}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-text">File Details</h2>
				<button onclick={() => selected = null} class="rounded-lg p-1 text-text-muted hover:bg-background"><X size={18} /></button>
			</div>
			<div class="mt-4 flex items-center justify-center rounded-lg bg-background p-4">
				{#if selected.type.startsWith('image/')}
					<img src={selected.data} alt={selected.name} class="max-h-64 rounded-lg object-contain" />
				{:else if selected.type === 'application/pdf'}
					<FileText size={64} class="text-red-400" />
				{:else}
					<File size={64} class="text-text-muted/40" />
				{/if}
			</div>
			<div class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between"><span class="text-text-muted">Name:</span><span class="font-medium text-text">{selected.name}</span></div>
				<div class="flex justify-between"><span class="text-text-muted">Type:</span><span class="font-medium text-text">{selected.type}</span></div>
				<div class="flex justify-between"><span class="text-text-muted">Size:</span><span class="font-medium text-text">{formatSize(selected.size)}</span></div>
				<div class="flex justify-between"><span class="text-text-muted">Uploaded:</span><span class="font-medium text-text">{selected.date}</span></div>
			</div>
			<div class="mt-6 grid grid-cols-3 gap-3">
				<button onclick={() => { const s = selected!; copyDataUrl(s); }} class="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">
					<Copy size={14} /> Copy
				</button>
				<button onclick={() => { const s = selected!; downloadFile(s); }} class="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">
					<Download size={14} /> Download
				</button>
				<button onclick={() => { const s = selected; selected = null; if (s) confirmDelete(s); }} class="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50">
					<Trash2 size={14} /> Delete
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if deleting}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => deleting = null}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Delete File</h2>
			<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{deleting.name}"?</p>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => deleting = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={doDelete} class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">Delete</button>
			</div>
		</div>
	</div>
{/if}
