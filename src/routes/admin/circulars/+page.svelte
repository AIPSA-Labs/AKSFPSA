<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { list, remove } from '$lib/stores/api';
	import type { Circular } from '$lib/stores/data';
	import { Edit3, Trash2, X, Plus, LoaderCircle } from '@lucide/svelte';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	let items = $state<Circular[]>([]);
	let loading = $state(true);
	let search = $state('');
	let deleting = $state<Circular | null>(null);
	let deletingLoading = $state(false);
	let selected = $state<Circular | null>(null);

	onMount(async () => {
		try {
			items = await list<Circular>('circulars');
		} catch (e) {
			console.error('Failed to load circulars:', e);
		} finally {
			loading = false;
		}
	});

	function confirmDelete(item: Circular) { deleting = item; }

	async function doDelete() {
		if (deleting) {
			deletingLoading = true;
			try {
				const title = deleting.title;
				if (deleting.file.startsWith('http')) {
					const key = extractR2Key(deleting.file);
					if (key) await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ key }), headers: { 'Content-Type': 'application/json' } });
				}
				await remove('circulars', deleting.id);
				items = items.filter((c) => c.id !== deleting!.id);
				deleting = null;
				try { snackbar.send('Circular deleted', 'success'); recentActions.add(`Deleted circular "${title}"`, 'circulars'); } catch {}
			} finally { deletingLoading = false; }
		}
	}

	function extractR2Key(url: string): string | null {
		try { return new URL(url).pathname.replace(/^\//, ''); } catch { return null; }
	}

	const filtered = $derived(
		items.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
	);
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Circulars</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<button onclick={() => goto('/admin/circulars/edit')} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Circular</button>
</div>

<div class="mt-4">
	<input type="text" placeholder="Search circulars..." bind:value={search}
		class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted">Title</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Category</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Date</th>
				<th class="px-4 py-3 font-medium text-text-muted w-24"></th>
			</tr>
		</thead>
		<tbody>
			{#each filtered as item}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50" onclick={() => selected = item}>
					<td class="px-4 py-3 font-medium text-text">{item.title}</td>
					<td class="hidden px-4 py-3 text-text-muted md:table-cell">{item.category}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{item.date}</td>
					<td class="px-4 py-3" onclick={(e) => e.stopPropagation()}>
						<div class="flex gap-1">
							<button onclick={() => goto('/admin/circulars/edit?id=' + item.id)} class="rounded p-1.5 text-text-muted transition hover:bg-background hover:text-primary"><Edit3 size={15} /></button>
							<button onclick={() => confirmDelete(item)} class="rounded p-1.5 text-text-muted transition hover:bg-background hover:text-red-500"><Trash2 size={15} /></button>
						</div>
					</td>
				</tr>
			{/each}
			{#if filtered.length === 0}
				<tr><td colspan="4" class="px-4 py-8 text-center text-text-muted">No circulars found</td></tr>
			{/if}
		</tbody>
	</table>
</div>

{#if deleting}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => deleting = null}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Delete Circular</h2>
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
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">Circular Details</h2>
				<button onclick={() => selected = null} class="text-text-muted hover:text-text"><X size={18} /></button>
			</div>
			<div class="space-y-4 px-5 py-4">
				<h3 class="text-lg font-semibold text-text leading-snug">{selected.title}</h3>
				<div class="flex flex-wrap items-center gap-3 text-sm">
					<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{selected.category}</span>
					<span class="text-text-muted">{selected.date}</span>
				</div>
				{#if selected.file}
					<a href={selected.file} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">View PDF</a>
				{/if}
			</div>
			<div class="grid grid-cols-2 gap-2 border-t border-border px-5 py-4">
				<button onclick={() => { const s = selected; selected = null; goto('/admin/circulars/edit?id=' + s!.id); }}
					class="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">
					<Edit3 size={16} /> Edit
				</button>
				<button onclick={() => { const s = selected; if (s) confirmDelete(s); }}
					class="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
					<Trash2 size={16} /> Delete
				</button>
			</div>
		</div>
	</div>
{/if}
