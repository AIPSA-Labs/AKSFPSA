<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { list, create, update } from '$lib/stores/api';
	import type { Circular } from '$lib/stores/data';
	import TipTap from '$lib/components/admin/TipTap.svelte';
	import { onMount } from 'svelte';
	import { Check } from '@lucide/svelte';

	const STEPS = [
		{ num: 1, label: 'Title & Date' },
		{ num: 2, label: 'Category & File' },
		{ num: 3, label: 'Content' },
		{ num: 4, label: 'Review & Publish' }
	];

	const categories = ['Administrative', 'Meeting Notice', 'Finance', 'Training'];

	let step = $state(1);
	let saving = $state(false);
	let uploadError = $state('');

	let form = $state({ title: '', date: '', category: '', file: '', content: '' });
	let editingId = $state<number | null>(null);

	onMount(async () => {
		const id = $page.url.searchParams.get('id');
		if (id) {
			editingId = Number(id);
			try {
				const items = await list<Circular>('circulars');
				const existing = items.find((c) => c.id === editingId);
				if (existing) {
					form = {
						title: existing.title, date: existing.date,
						category: existing.category, file: existing.file,
						content: existing.content || ''
					};
				}
			} catch (e) { console.error('Failed to load circular:', e); }
		}
	});

	const isNew = $derived(!editingId);
	const step1Valid = $derived(form.title.trim().length > 0);
	const step3Valid = $derived(form.content.trim().length > 0);

	function nextStep() { if (step < 4) step++; }
	function prevStep() { if (step > 1) step--; }

	async function handleFileUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const fd = new FormData(); fd.set('file', file); fd.set('folder', 'circulars');
		const res = await fetch('/api/upload', { method: 'POST', body: fd });
		if (res.ok) { const { url } = await res.json(); form.file = url; uploadError = ''; }
		else { uploadError = 'Upload failed'; }
	}

	function extractR2Key(url: string): string | null {
		try { return new URL(url).pathname.replace(/^\//, ''); } catch { return null; }
	}

	async function removeFile() {
		if (form.file.startsWith('http')) {
			const key = extractR2Key(form.file);
			if (key) await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ key }), headers: { 'Content-Type': 'application/json' } });
		}
		form.file = '';
	}

	async function save() {
		saving = true;
		const data = {
			title: form.title,
			date: form.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
			category: form.category, file: form.file, content: form.content
		};
		try {
			if (isNew) await create<Circular>('circulars', data);
			else await update<Circular>('circulars', editingId!, data);
		} catch (e) { console.error('Failed to save circular:', e); }
		saving = false;
		goto('/admin/circulars');
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold text-primary">{isNew ? 'New Circular' : 'Edit Circular'}</h1>
		<p class="mt-0.5 text-sm text-text-muted">Step {step} of 4</p>
	</div>
	<button onclick={() => goto('/admin/circulars')} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted transition hover:bg-surface">Cancel</button>
</div>

<div class="mt-6 flex items-center gap-0">
	{#each STEPS as s, i}
		<button onclick={() => { if (s.num < step) step = s.num; }} class="flex items-center disabled:opacity-50" disabled={s.num >= step}>
			<div class="flex items-center gap-2">
				<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold {s.num <= step ? 'bg-primary text-white' : 'bg-surface text-text-muted'}">
					{#if s.num < step}<Check size={16} />{:else}{s.num}{/if}
				</div>
				<span class="hidden text-sm font-medium text-text sm:inline">{s.label}</span>
			</div>
		</button>
		{#if i < STEPS.length - 1}<div class="mx-3 h-px flex-1 {s.num < step ? 'bg-primary' : 'bg-border'}"></div>{/if}
	{/each}
</div>

<div class="mt-8">
	{#if step === 1}
		<div class="space-y-5 max-w-2xl">
			<div>
				<label for="title" class="mb-1.5 block text-sm font-medium text-text">Title *</label>
				<input id="title" type="text" bind:value={form.title} placeholder="Enter circular title"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
			</div>
			<div>
				<label for="date" class="mb-1.5 block text-sm font-medium text-text">Date</label>
				<input id="date" type="text" bind:value={form.date} placeholder="e.g. 12 January 2026"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
			</div>
		</div>

	{:else if step === 2}
		<div class="space-y-5 max-w-2xl">
			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">Category</label>
				<select bind:value={form.category} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
					<option value="">Select</option>
					{#each categories as cat}<option value={cat}>{cat}</option>{/each}
				</select>
			</div>
			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">PDF File</label>
				<input type="file" accept=".pdf,application/pdf" onchange={handleFileUpload}
					class="w-full text-sm text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-hover" />
				{#if form.file}
					<div class="mt-2 flex items-center gap-3">
						<a href={form.file} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:underline">View uploaded PDF</a>
						<button onclick={removeFile} class="text-sm text-red-500 hover:underline">Remove</button>
					</div>
				{/if}
				{#if uploadError}<p class="mt-1 text-sm text-red-500">{uploadError}</p>{/if}
			</div>
		</div>

	{:else if step === 3}
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<label class="block text-sm font-medium text-text">Circular Content</label>
				{#if !step3Valid}<span class="text-xs text-amber-500">Content is empty</span>{/if}
			</div>
			<TipTap content={form.content} onUpdate={(v) => form.content = v} />
		</div>

	{:else if step === 4}
		<div class="max-w-2xl space-y-5 rounded-xl border border-border bg-surface p-6">
			<h3 class="text-lg font-semibold text-text">Summary</h3>
			<div class="space-y-3 text-sm">
				<div><span class="font-medium text-text">Title:</span> <span class="text-text-muted">{form.title || '(not set)'}</span></div>
				<div><span class="font-medium text-text">Date:</span> <span class="text-text-muted">{form.date || '(not set)'}</span></div>
				<div><span class="font-medium text-text">Category:</span> <span class="text-text-muted">{form.category || '(not set)'}</span></div>
				<div><span class="font-medium text-text">PDF:</span> <span class="text-text-muted">{form.file ? 'Uploaded' : 'None'}</span></div>
				<div><span class="font-medium text-text">Content length:</span> <span class="text-text-muted">{form.content.length} characters</span></div>
			</div>
		</div>
	{/if}
</div>

<div class="mt-8 flex items-center justify-between border-t border-border pt-6">
	<button onclick={prevStep} disabled={step === 1}
		class="rounded-lg border border-border px-5 py-2.5 text-sm text-text transition hover:bg-surface disabled:opacity-30">← Back</button>
	<div class="flex items-center gap-2">
		<span class="text-xs text-text-muted">Step {step} of 4</span>
		{#if step < 4}
			<button onclick={nextStep} disabled={(step === 1 && !step1Valid) || (step === 3 && !step3Valid)}
				class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50">Next →</button>
		{:else}
			<button onclick={save} disabled={saving || !step1Valid}
				class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50">
				{saving ? 'Saving...' : isNew ? 'Create Circular' : 'Update Circular'}
			</button>
		{/if}
	</div>
</div>
