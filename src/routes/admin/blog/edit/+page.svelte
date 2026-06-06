<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getStore, setStore, DEFAULT_BLOG_POSTS } from '$lib/stores/data';
	import type { BlogPost } from '$lib/stores/data';
	import TipTap from '$lib/components/admin/TipTap.svelte';
	import { onMount } from 'svelte';
	import { Check, X } from '@lucide/svelte';

	const CATEGORIES = [
		'Conference', 'Leadership', 'Governance', 'Training',
		'Certification', 'Teachers', 'Events', 'Policy',
		'Membership', 'Administrative', 'Academic', 'Announcement'
	];

	const STEPS = [
		{ num: 1, label: 'Title & Description' },
		{ num: 2, label: 'Thumbnail' },
		{ num: 3, label: 'Content' },
		{ num: 4, label: 'Tags & Settings' }
	];

	let step = $state(1);
	let saving = $state(false);
	let items = $state(getStore('blog_posts', DEFAULT_BLOG_POSTS));
	let previewError = $state(false);

	let form = $state({
		title: '', excerpt: '', author: 'AKSFPSA Office',
		cover: '', content: '', tags: [] as string[],
		status: 'draft' as 'draft' | 'published',
		type: 'post' as 'post' | 'event'
	});

	let editingSlug = $state<string | null>(null);
	let tagInput = $state('');

	onMount(() => {
		const slug = $page.url.searchParams.get('slug');
		if (slug) {
			const existing = items.find((b) => b.slug === slug);
			if (existing) {
				editingSlug = slug;
				form = {
					title: existing.title,
					excerpt: existing.excerpt,
					author: existing.author,
					cover: existing.cover,
					content: existing.content,
					tags: [...existing.tags],
					status: existing.status
				};
			}
		}
	});

	const isNew = $derived(!editingSlug);
	const step1Valid = $derived(form.title.trim().length > 0);
	const step3Valid = $derived(form.content.trim().length > 0);

	function addTag() {
		const t = tagInput.trim();
		if (t && !form.tags.includes(t)) {
			form.tags = [...form.tags, t];
		}
		tagInput = '';
	}

	function removeTag(tag: string) {
		form.tags = form.tags.filter((t) => t !== tag);
	}

	function toggleCategory(cat: string) {
		if (form.tags.includes(cat)) {
			form.tags = form.tags.filter((t) => t !== cat);
		} else {
			form.tags = [...form.tags, cat];
		}
	}

	function handleContentUpdate(html: string) {
		form.content = html;
	}

	function nextStep() {
		if (step < 4) step++;
	}

	function prevStep() {
		if (step > 1) step--;
	}

	async function save() {
		saving = true;
		await new Promise((r) => setTimeout(r, 300));

		const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
		const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

		if (isNew) {
			const newPost: BlogPost = {
				id: Math.max(0, ...items.map((b) => b.id)) + 1,
				title: form.title,
				slug,
				excerpt: form.excerpt,
				content: form.content,
				author: form.author,
				date,
				status: form.status,
				cover: form.cover,
				tags: form.tags.filter(Boolean)
			};
			items = [...items, newPost];
		} else {
			items = items.map((b) =>
				b.slug === editingSlug
					? { ...b, ...form, tags: form.tags.filter(Boolean), slug: b.slug }
					: b
			);
		}

		setStore('blog_posts', items);
		saving = false;
		goto('/admin/blog');
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold text-primary">{isNew ? 'New Post' : 'Edit Post'}</h1>
		<p class="mt-0.5 text-sm text-text-muted">Step {step} of 4</p>
	</div>
	<button onclick={() => goto('/admin/blog')} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted transition hover:bg-surface">
		Cancel
	</button>
</div>

<!-- Step Indicator -->
<div class="mt-6 flex items-center gap-0">
	{#each STEPS as s, i}
		<button onclick={() => { if (s.num < step) step = s.num; }} class="flex items-center disabled:opacity-50" disabled={s.num >= step}>
			<div class="flex items-center gap-2">
				<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold {s.num <= step ? 'bg-primary text-white' : 'bg-surface text-text-muted'}">
					{#if s.num < step}
						<Check size={16} />
					{:else}
						{s.num}
					{/if}
				</div>
				<span class="hidden text-sm font-medium text-text sm:inline">{s.label}</span>
			</div>
		</button>
		{#if i < STEPS.length - 1}
			<div class="mx-3 h-px flex-1 {s.num < step ? 'bg-primary' : 'bg-border'}"></div>
		{/if}
	{/each}
</div>

<div class="mt-8">
	<!-- Step 1: Title & Description -->
	{#if step === 1}
		<div class="space-y-5">
			<div>
				<label for="title" class="mb-1.5 block text-sm font-medium text-text">Title *</label>
				<input id="title" type="text" bind:value={form.title} placeholder="Enter post title"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
			</div>
			<div>
				<label for="author" class="mb-1.5 block text-sm font-medium text-text">Author</label>
				<input id="author" type="text" bind:value={form.author}
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
			</div>
			<div>
				<label for="excerpt" class="mb-1.5 block text-sm font-medium text-text">Excerpt / Description</label>
				<textarea id="excerpt" bind:value={form.excerpt} rows="3" placeholder="Brief description of the post..."
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"></textarea>
			</div>
		</div>

	<!-- Step 2: Thumbnail -->
	{:else if step === 2}
		<div class="space-y-5">
			<div>
				<label for="cover" class="mb-1.5 block text-sm font-medium text-text">Cover Image URL</label>
				<input id="cover" type="text" bind:value={form.cover} placeholder="/images/blog/cover.jpg"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
				<p class="mt-1 text-xs text-text-muted">Optional. Enter a URL or path to the cover image.</p>
			</div>
			{#if form.cover}
				<div class="overflow-hidden rounded-xl border border-border">
					{#if previewError}
						<div class="flex h-48 items-center justify-center bg-surface text-sm text-text-muted">
							Could not load image preview
						</div>
					{:else}
						<img src={form.cover} alt="Cover preview" class="max-h-64 w-full object-cover" onerror={() => previewError = true} onload={() => previewError = false} />
					{/if}
				</div>
			{:else}
				<div class="flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-surface text-sm text-text-muted">
					No cover image selected
				</div>
			{/if}
		</div>

	<!-- Step 3: Content -->
	{:else if step === 3}
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<label class="block text-sm font-medium text-text">Post Content</label>
				{#if !step3Valid}
					<span class="text-xs text-amber-500">Content is empty</span>
				{/if}
			</div>
			<TipTap content={form.content} onUpdate={handleContentUpdate} />
		</div>

	<!-- Step 4: Tags & Settings -->
	{:else if step === 4}
		<div class="space-y-6">
			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">Post Type</label>
				<div class="flex gap-3">
					<label class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 {form.type === 'post' ? 'border-primary bg-primary/5' : 'border-border'}">
						<input type="radio" name="type" value="post" bind:group={form.type} class="text-primary" />
						<div>
							<span class="text-sm font-medium text-text">Post</span>
							<p class="text-xs text-text-muted">Appears on the Blog page</p>
						</div>
					</label>
					<label class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 {form.type === 'event' ? 'border-primary bg-primary/5' : 'border-border'}">
						<input type="radio" name="type" value="event" bind:group={form.type} class="text-primary" />
						<div>
							<span class="text-sm font-medium text-text">Event</span>
							<p class="text-xs text-text-muted">Appears on the Events page</p>
						</div>
					</label>
				</div>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">Status</label>
				<div class="flex gap-3">
					<label class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 {form.status === 'draft' ? 'border-primary bg-primary/5' : 'border-border'}">
						<input type="radio" name="status" value="draft" bind:group={form.status} class="text-primary" />
						<div>
							<span class="text-sm font-medium text-text">Draft</span>
							<p class="text-xs text-text-muted">Save as draft, publish later</p>
						</div>
					</label>
					<label class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 {form.status === 'published' ? 'border-primary bg-primary/5' : 'border-border'}">
						<input type="radio" name="status" value="published" bind:group={form.status} class="text-primary" />
						<div>
							<span class="text-sm font-medium text-text">Published</span>
							<p class="text-xs text-text-muted">Publish immediately</p>
						</div>
					</label>
				</div>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">Categories</label>
				<p class="mb-2 text-xs text-text-muted">Select one or more categories for this post:</p>
				<div class="flex flex-wrap gap-2">
					{#each CATEGORIES as cat}
						<button onclick={() => toggleCategory(cat)} class="rounded-lg border px-3 py-1.5 text-sm transition {form.tags.includes(cat) ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text hover:bg-background'}">
							{cat}
						</button>
					{/each}
				</div>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-text">Tags</label>
				<div class="flex gap-2">
					<input type="text" bind:value={tagInput} placeholder="Type a tag and click Add" onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
						class="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
					<button onclick={addTag} class="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">Add</button>
				</div>
				{#if form.tags.length > 0}
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each form.tags as tag}
							<span class="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
								{tag}
								<button onclick={() => removeTag(tag)} class="ml-0.5 text-primary hover:text-red-500"><X size={12} /></button>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Navigation -->
<div class="mt-8 flex items-center justify-between border-t border-border pt-6" class:mb-14={step === 3}>
	<button onclick={prevStep} disabled={step === 1}
		class="rounded-lg border border-border px-5 py-2.5 text-sm text-text transition hover:bg-surface disabled:opacity-30">
		← Back
	</button>

	<div class="flex items-center gap-2">
		<span class="text-xs text-text-muted">Step {step} of 4</span>
		{#if step < 4}
			<button onclick={nextStep} disabled={(step === 1 && !step1Valid) || (step === 3 && !step3Valid)}
				class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50">
				Next →
			</button>
		{:else}
			<button onclick={save} disabled={saving || !step1Valid}
				class="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50">
				{saving ? 'Saving...' : isNew ? 'Publish Post' : 'Update Post'}
			</button>
		{/if}
	</div>
</div>
