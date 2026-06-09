<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { list, create, update } from '$lib/stores/api';
	import type { Course } from '$lib/stores/data';
	import TipTap from '$lib/components/admin/TipTap.svelte';
	import { onMount } from 'svelte';
	import { Check } from '@lucide/svelte';

	const STEPS = [
		{ num: 1, label: 'Title & Description' },
		{ num: 2, label: 'Course Details' },
		{ num: 3, label: 'Content' },
		{ num: 4, label: 'Review & Publish' }
	];

	const categories = ['Administrative', 'Professional Development', 'Finance', 'Technology'];
	const modes = ['Online', 'Offline', 'Hybrid'];

	let step = $state(1);
	let saving = $state(false);

	let form = $state({ title: '', category: '', duration: '', mode: '', description: '', link: '', content: '' });
	let editingId = $state<number | null>(null);

	onMount(async () => {
		const id = $page.url.searchParams.get('id');
		if (id) {
			editingId = Number(id);
			try {
				const items = await list<Course>('courses');
				const existing = items.find((c) => c.id === editingId);
				if (existing) {
					form = {
						title: existing.title, category: existing.category,
						duration: existing.duration, mode: existing.mode,
						description: existing.description, link: existing.link,
						content: existing.content || ''
					};
				}
			} catch (e) { console.error('Failed to load course:', e); }
		}
	});

	const isNew = $derived(!editingId);
	const step1Valid = $derived(form.title.trim().length > 0);
	const step3Valid = $derived(form.content.trim().length > 0);

	function nextStep() { if (step < 4) step++; }
	function prevStep() { if (step > 1) step--; }

	async function save() {
		saving = true;
		const data = {
			title: form.title, category: form.category, duration: form.duration,
			mode: form.mode, description: form.description,
			link: form.link || '/courses/' + form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
			content: form.content
		};
		try {
			if (isNew) await create<Course>('courses', data);
			else await update<Course>('courses', editingId!, data);
		} catch (e) { console.error('Failed to save course:', e); }
		saving = false;
		goto('/admin/courses');
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold text-primary">{isNew ? 'New Course' : 'Edit Course'}</h1>
		<p class="mt-0.5 text-sm text-text-muted">Step {step} of 4</p>
	</div>
	<button onclick={() => goto('/admin/courses')} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted transition hover:bg-surface">Cancel</button>
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
				<input id="title" type="text" bind:value={form.title} placeholder="Enter course title"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
			</div>
			<div>
				<label for="desc" class="mb-1.5 block text-sm font-medium text-text">Description / Excerpt</label>
				<textarea id="desc" bind:value={form.description} rows="3" placeholder="Brief description shown on course card..."
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"></textarea>
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
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-1.5 block text-sm font-medium text-text">Duration</label>
					<input type="text" bind:value={form.duration} placeholder="e.g. 6 Weeks"
						class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-text">Mode</label>
					<select bind:value={form.mode} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary">
						<option value="">Select</option>
						{#each modes as m}<option value={m}>{m}</option>{/each}
					</select>
				</div>
			</div>
			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">Link</label>
				<input type="text" bind:value={form.link} placeholder="Auto-generated from title if empty"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
			</div>
		</div>

	{:else if step === 3}
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<label class="block text-sm font-medium text-text">Course Content</label>
				{#if !step3Valid}<span class="text-xs text-amber-500">Content is empty</span>{/if}
			</div>
			<TipTap content={form.content} onUpdate={(v) => form.content = v} />
		</div>

	{:else if step === 4}
		<div class="max-w-2xl space-y-5 rounded-xl border border-border bg-surface p-6">
			<h3 class="text-lg font-semibold text-text">Summary</h3>
			<div class="space-y-3 text-sm">
				<div><span class="font-medium text-text">Title:</span> <span class="text-text-muted">{form.title || '(not set)'}</span></div>
				<div><span class="font-medium text-text">Category:</span> <span class="text-text-muted">{form.category || '(not set)'}</span></div>
				<div><span class="font-medium text-text">Duration:</span> <span class="text-text-muted">{form.duration || '(not set)'}</span></div>
				<div><span class="font-medium text-text">Mode:</span> <span class="text-text-muted">{form.mode || '(not set)'}</span></div>
				<div><span class="font-medium text-text">Description:</span> <span class="text-text-muted">{form.description || '(not set)'}</span></div>
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
				{saving ? 'Saving...' : isNew ? 'Create Course' : 'Update Course'}
			</button>
		{/if}
	</div>
</div>
