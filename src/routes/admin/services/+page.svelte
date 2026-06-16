<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { list, update, remove } from '$lib/stores/api';
	import type { Service } from '$lib/stores/data';
	import { Edit3, Trash2, X, LoaderCircle } from '@lucide/svelte';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	let items = $state<Service[]>([]);
	let loading = $state(true);
	let deleting = $state<Service | null>(null);
	let deletingLoading = $state(false);
	let selected = $state<Service | null>(null);

	onMount(async () => {
		try {
			items = await list<Service>('services');
		} catch (e) {
			console.error('Failed to load services:', e);
		} finally {
			loading = false;
		}
	});

	function confirmDelete(item: Service) { deleting = item; }

	async function doDelete() {
		if (deleting) {
			deletingLoading = true;
			try {
				const title = deleting.title;
				await remove('services', deleting.id);
				items = items.filter((s) => s.id !== deleting!.id);
				deleting = null;
				try { snackbar.send('Service deleted', 'success'); recentActions.add(`Deleted service "${title}"`, 'services'); } catch {}
			} finally { deletingLoading = false; }
		}
	}

	async function moveUp(index: number) {
		if (index === 0) return;
		[items[index], items[index - 1]] = [items[index - 1], items[index]];
		items = await Promise.all(items.map((s, i) => update<Service>('services', s.id, { ...s, order: i + 1 })));
	}

	async function moveDown(index: number) {
		if (index === items.length - 1) return;
		[items[index], items[index + 1]] = [items[index + 1], items[index]];
		items = await Promise.all(items.map((s, i) => update<Service>('services', s.id, { ...s, order: i + 1 })));
	}
</script>

<div class="flex items-center justify-between gap-4">
	<div>
		<h1 class="text-2xl font-bold text-primary">Services</h1>
		<p class="mt-0.5 text-sm text-text-muted">{items.length} total</p>
	</div>
	<button onclick={() => goto('/admin/services/edit')} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Service</button>
</div>

<div class="mt-6 overflow-hidden rounded-xl border border-border">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-border bg-surface">
			<tr>
				<th class="px-4 py-3 font-medium text-text-muted w-10">#</th>
				<th class="px-4 py-3 font-medium text-text-muted">Title</th>
				<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Description</th>
				<th class="px-4 py-3 font-medium text-text-muted w-24"></th>
			</tr>
		</thead>
		<tbody>
			{#each items as item, i}
				<tr class="cursor-pointer border-b border-border last:border-0 hover:bg-surface/50" onclick={() => selected = item}>
					<td class="px-4 py-3 text-text-muted">{item.order}</td>
					<td class="px-4 py-3 font-medium text-text">{item.title}</td>
					<td class="hidden px-4 py-3 text-text-muted sm:table-cell max-w-xs truncate">{item.description}</td>
					<td class="px-4 py-3">
						<div class="flex gap-1" onclick={(e) => e.stopPropagation()}>
							<button onclick={() => moveUp(i)} disabled={i === 0} class="rounded p-1 text-text-muted transition hover:bg-background disabled:opacity-30">↑</button>
							<button onclick={() => moveDown(i)} disabled={i === items.length - 1} class="rounded p-1 text-text-muted transition hover:bg-background disabled:opacity-30">↓</button>
						</div>
					</td>
				</tr>
			{/each}
			{#if items.length === 0}
				<tr><td colspan="4" class="px-4 py-8 text-center text-text-muted">No services added yet</td></tr>
			{/if}
		</tbody>
	</table>
</div>

{#if deleting}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onclick={() => deleting = null}>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-text">Delete Service</h2>
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
		<div class="mx-4 w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">Service Details</h2>
				<button onclick={() => selected = null} class="text-text-muted hover:text-text"><X size={18} /></button>
			</div>
			<div class="space-y-4 px-5 py-4">
				<div class="flex items-center gap-3">
					<span class="text-2xl">{['🎓','💻','📖','🌐','🏫','🏆','👥','📄'][['GraduationCap','Monitor','BookOpen','Globe','School','Award','Users','FileText'].indexOf(selected.icon)] || '📋'}</span>
					<h3 class="text-lg font-semibold text-text">{selected.title}</h3>
				</div>
				<p class="text-sm text-text-muted leading-relaxed">{selected.description}</p>
				<p class="text-xs text-text-muted">Order: {selected.order}</p>
			</div>
			<div class="grid grid-cols-2 gap-2 border-t border-border px-5 py-4">
				<button onclick={() => { const s = selected; selected = null; goto('/admin/services/edit?id=' + s!.id); }}
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
