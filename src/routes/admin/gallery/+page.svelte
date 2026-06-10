<script lang="ts">
	import { onMount } from 'svelte';
	import { list, create, update, remove } from '$lib/stores/api';
	import type { GalleryAlbum } from '$lib/stores/data';
	import { Plus, Image as ImageIcon, MoreVertical, Pencil, Trash2 } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	type Category = { id: number; name: string };

	let items = $state<GalleryAlbum[]>([]);
	let loading = $state(true);
	let search = $state('');
	let catFilter = $state('All');
	let categories = $state<Category[]>([]);
	let albumCountByCat = $state<Record<string, number>>({});

	let openDropdown = $state<number | null>(null);

	let showCatModal = $state(false);
	let editCat = $state<Category | null>(null);
	let newCat = $state('');

	let deleteTarget = $state<Category | null>(null);

	async function loadCategories() {
		try {
			const cats = await list<Category>('gallery-categories');
			categories = cats.sort((a, b) => a.name.localeCompare(b.name));
			const counts: Record<string, number> = {};
			for (const a of items) {
				if (a.category) counts[a.category] = (counts[a.category] || 0) + 1;
			}
			albumCountByCat = counts;
		} catch {}
	}

	onMount(async () => {
		try {
			items = await list<GalleryAlbum>('gallery');
			await loadCategories();
		} catch (e) {
			console.error('Failed to load albums:', e);
		} finally {
			loading = false;
		}
	});

	function closeDropdown() { openDropdown = null; }

	function openCatModal(cat?: Category) {
		closeDropdown();
		if (cat) {
			editCat = cat;
			newCat = cat.name;
		} else {
			editCat = null;
			newCat = '';
		}
		showCatModal = true;
	}

	async function saveCategory() {
		const trimmed = newCat.trim();
		if (!trimmed) return;

		try {
			if (editCat) {
				await update('gallery-categories', editCat.id, { name: trimmed });
				snackbar.send(`Category renamed to "${trimmed}"`, 'success');
				recentActions.add(`Renamed category "${editCat.name}" to "${trimmed}"`, 'gallery');
			} else {
				await create('gallery-categories', { name: trimmed });
				snackbar.send(`Category "${trimmed}" created`, 'success');
				recentActions.add(`Created gallery category "${trimmed}"`, 'gallery');
			}
			await loadCategories();
		} catch (e) {
			snackbar.send('Failed to save category', 'error');
		}

		newCat = '';
		editCat = null;
		showCatModal = false;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		try {
			await remove('gallery-categories', deleteTarget.id);
			snackbar.send(`Category "${deleteTarget.name}" deleted`, 'success');
			recentActions.add(`Deleted gallery category "${deleteTarget.name}"`, 'gallery');
			if (catFilter === deleteTarget.name) catFilter = 'All';
			await loadCategories();
		} catch (e) {
			snackbar.send('Failed to delete category', 'error');
		}
		deleteTarget = null;
	}

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
		<button onclick={() => openCatModal()} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface"><Plus size={16} class="inline" /> Create Category</button>
		<a href="/admin/gallery/new" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover inline-block">+ Add Album</a>
	</div>
</div>

<div class="mt-4 flex flex-wrap items-center gap-3">
	<input type="text" placeholder="Search albums..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
	<div class="flex flex-wrap gap-1">
		<button onclick={() => catFilter = 'All'} class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === 'All' ? 'bg-primary text-white' : 'border border-border text-text-muted hover:bg-surface'}">All</button>
		{#each categories as cat}
			<div class="relative">
				<button onclick={() => { catFilter = cat.name; closeDropdown(); }} class="rounded-l-lg border border-border px-3 py-1.5 text-xs font-medium transition {catFilter === cat.name ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface'}">{cat.name}</button>
				<button onclick={(e) => { e.stopPropagation(); openDropdown = openDropdown === cat.id ? null : cat.id; }} class="-ml-px rounded-r-lg border border-border px-1.5 py-1.5 text-xs text-text-muted transition hover:bg-surface {catFilter === cat.name ? 'border-primary bg-primary text-white hover:bg-primary-hover' : ''}">
					<MoreVertical size={14} />
				</button>
				{#if openDropdown === cat.id}
					<div class="absolute left-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-surface py-1 shadow-lg" onclick={(e) => e.stopPropagation()}>
						<button onclick={() => openCatModal(cat)} class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-text transition hover:bg-background">
							<Pencil size={14} /> Edit
						</button>
						<button onclick={() => { closeDropdown(); deleteTarget = cat; }} class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-500 transition hover:bg-background">
							<Trash2 size={14} /> Delete
						</button>
						{#if albumCountByCat[cat.name]}
							<div class="border-t border-border px-3 py-1 text-[10px] text-text-muted">{albumCountByCat[cat.name]} album(s) use this</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<!-- click-outside to close dropdown -->
{#if openDropdown !== null}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="fixed inset-0 z-40" onclick={closeDropdown}></div>
{/if}

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

<!-- Create / Edit Category Modal -->
{#if showCatModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => { showCatModal = false; editCat = null; newCat = ''; }}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">{editCat ? 'Edit Category' : 'Create Category'}</h2>
			<div class="mt-4">
				<label class="mb-1 block text-sm font-medium text-text">Category Name</label>
				<input type="text" bind:value={newCat} placeholder="e.g. Seminar"
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
					onkeydown={(e) => { if (e.key === 'Enter') saveCategory(); }} />
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => { showCatModal = false; editCat = null; newCat = ''; }} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={saveCategory} disabled={!newCat.trim()} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{editCat ? 'Update' : 'Save'}</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if deleteTarget}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => deleteTarget = null}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Delete Category</h2>
			<p class="mt-2 text-sm text-text-muted">Are you sure you want to delete "{deleteTarget.name}"? {albumCountByCat[deleteTarget.name] ? `This will NOT remove ${albumCountByCat[deleteTarget.name]} album(s) using it.` : ''}</p>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => deleteTarget = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={confirmDelete} class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Delete</button>
			</div>
		</div>
	</div>
{/if}
