<script lang="ts">
	import { onMount } from 'svelte';
	import { list, update, remove } from '$lib/stores/api';
	import type { BlogPost } from '$lib/stores/data';
	import { Eye, Edit3, Trash2, X, Plus, LoaderCircle } from '@lucide/svelte';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	let items = $state<BlogPost[]>([]);
	let loading = $state(true);
	let search = $state('');
	let deleting = $state<BlogPost | null>(null);
	let deletingLoading = $state(false);
	let togglingStatus = $state<number | null>(null);
	let selected = $state<BlogPost | null>(null);
	let statusFilter = $state<'all' | 'draft' | 'published'>('all');
	let typeFilter = $state<'all' | 'post' | 'event'>('all');
	let categories = $state<string[]>([]);
	let showCatModal = $state(false);
	let newCat = $state('');

	onMount(async () => {
		try {
			items = await list<BlogPost>('blog');
		} catch (e) {
			console.error('Failed to load posts:', e);
		} finally {
			loading = false;
		}
	});

	function addCategory() {
		const trimmed = newCat.trim();
		if (trimmed && !categories.includes(trimmed)) {
			categories = [...categories, trimmed];
		}
		newCat = '';
		showCatModal = false;
		try { snackbar.send(`Category "${trimmed}" created`, 'success'); } catch {}
	}

	const filtered = $derived(
		items.filter((b) => {
			const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
			const matchStatus = statusFilter === 'all' || b.status === statusFilter;
			const matchType = typeFilter === 'all' || b.type === typeFilter;
			return matchSearch && matchStatus && matchType;
		})
	);

	function confirmDelete(item: BlogPost) { deleting = item; selected = null; }

	async function doDelete() {
		if (deleting) {
			deletingLoading = true;
			try {
				const title = deleting.title;
				await remove('blog', deleting.id);
				items = items.filter((b) => b.id !== deleting!.id);
				deleting = null;
				try { snackbar.send('Post deleted', 'success'); recentActions.add(`Deleted post "${title}"`, 'blog'); } catch {}
			} finally { deletingLoading = false; }
		}
	}

	async function toggleStatus(item: BlogPost) {
		togglingStatus = item.id;
		try {
			const newStatus = item.status === 'published' ? 'draft' : 'published';
			const updated = await update<BlogPost>('blog', item.id, { status: newStatus });
			items = items.map((b) => (b.id === item.id ? updated : b));
			if (selected?.id === item.id) selected = updated;
			try { snackbar.send(`Post "${item.title}" ${newStatus}`, 'success'); recentActions.add(`${newStatus === 'published' ? 'Published' : 'Drafted'} post "${item.title}"`, 'blog'); } catch {}
		} finally { togglingStatus = null; }
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Blog & Events</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<div class="flex gap-2">
		<button onclick={() => showCatModal = true} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface"><Plus size={16} class="inline" /> Create Category</button>
		<a href="/admin/blog/edit" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ New Post</a>
	</div>
</div>

<div class="mt-4 flex flex-wrap gap-3">
	<input type="text" placeholder="Search posts..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
	<select bind:value={statusFilter} class="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary">
		<option value="all">All Status</option>
		<option value="published">Published</option>
		<option value="draft">Drafts</option>
	</select>
</div>

<div class="mt-3 flex flex-wrap gap-2">
	<button onclick={() => typeFilter = 'all'} class="rounded-lg border px-3 py-1.5 text-xs font-medium transition {typeFilter === 'all' ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text hover:bg-background'}">All</button>
	<button onclick={() => typeFilter = 'post'} class="rounded-lg border px-3 py-1.5 text-xs font-medium transition {typeFilter === 'post' ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text hover:bg-background'}">Posts</button>
	<button onclick={() => typeFilter = 'event'} class="rounded-lg border px-3 py-1.5 text-xs font-medium transition {typeFilter === 'event' ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text hover:bg-background'}">Events</button>
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Title</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Type</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Status</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Date</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Tags</th>

			</tr>
		</thead>
		<tbody>
			{#each filtered as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50 max-sm:transition-colors" onclick={() => selected = item}>
					<td class="px-4 py-3 font-medium text-text">{item.title}</td>
					<td class="hidden px-4 py-3 md:table-cell">
						<span class="rounded-md px-2 py-0.5 text-xs font-medium {item.type === 'event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}">
							{item.type === 'event' ? 'Event' : 'Post'}
						</span>
					</td>
					<td class="hidden px-4 py-3 md:table-cell">
						<button onclick={(e) => { e.stopPropagation(); toggleStatus(item); }} disabled={togglingStatus === item.id}
							class="rounded-md px-2 py-0.5 text-xs font-medium disabled:opacity-50 {item.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}">
							{togglingStatus === item.id ? '...' : item.status}
						</button>
					</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.date}</td>
					<td class="hidden px-4 py-3 sm:table-cell">
						<div class="flex flex-wrap gap-1">
							{#each item.tags.slice(0, 2) as tag}
								<span class="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">{tag}</span>
							{/each}
							{#if item.tags.length > 2}
								<span class="text-xs text-text-muted">+{item.tags.length - 2}</span>
							{/if}
						</div>
					</td>

				</tr>
			{/each}
			{#if filtered.length === 0}
				<tr><td colspan="5" class="px-4 py-8 text-center text-text-muted">No posts found</td></tr>
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
				<input type="text" bind:value={newCat} placeholder="e.g. Education" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
					onkeydown={(e) => { if (e.key === 'Enter') addCategory(); }} />
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => { showCatModal = false; newCat = ''; }} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={addCategory} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}

{#if deleting}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => deleting = null}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Delete Post</h2>
			<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{deleting.title}"?</p>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => deleting = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={doDelete} disabled={deletingLoading} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if deletingLoading}<LoaderCircle size={16} class="inline animate-spin" /> Deleting...{:else}Delete{/if}</button>
			</div>
		</div>
	</div>
{/if}

{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selected = null}>
		<div class="mx-4 w-full max-w-md rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">Post Details</h2>
				<button onclick={() => selected = null} class="text-text-muted hover:text-text"><X size={18} /></button>
			</div>

			<!-- Thumbnail -->
			{#if selected.cover}
				<div class="h-48 overflow-hidden">
					<img src={selected.cover} alt={selected.title} class="h-full w-full object-cover" />
				</div>
			{:else}
				<div class="flex h-32 items-center justify-center bg-surface text-sm text-text-muted">No thumbnail</div>
			{/if}

			<!-- Body -->
			<div class="space-y-4 px-5 py-4">
				<h3 class="text-lg font-semibold text-text leading-snug">{selected.title}</h3>

				<div class="flex flex-wrap items-center gap-3 text-sm">
					<span class="rounded-md px-2.5 py-0.5 text-xs font-medium {selected.type === 'event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}">
						{selected.type === 'event' ? 'Event' : 'Post'}
					</span>
					<button onclick={(e) => { e.stopPropagation(); toggleStatus(selected!); }} disabled={togglingStatus === selected.id}
						class="rounded-md px-2.5 py-0.5 text-xs font-medium disabled:opacity-50 {selected.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
						{togglingStatus === selected.id ? '...' : selected.status}
					</button>
					<span class="text-text-muted">{selected.date}</span>
				</div>

				{#if selected.tags.length > 0}
					<div class="flex flex-wrap gap-1.5">
						{#each selected.tags as tag}
							<span class="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{tag}</span>
						{/each}
					</div>
				{/if}

				{#if selected.excerpt}
					<p class="text-sm text-text-muted leading-relaxed">{selected.excerpt}</p>
				{/if}
			</div>

			<!-- Actions -->
			<div class="grid grid-cols-3 gap-2 border-t border-border px-5 py-4">
				<a href="/blog/{selected.slug}" target="_blank"
					class="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-text transition hover:bg-background">
					<Eye size={16} /> View
				</a>
				<a href="/admin/blog/edit?slug={selected.slug}"
					class="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">
					<Edit3 size={16} /> Edit
				</a>
				<button onclick={() => { const s = selected; if (s) confirmDelete(s); }}
					class="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
					<Trash2 size={16} /> Delete
				</button>
			</div>
		</div>
	</div>
{/if}
