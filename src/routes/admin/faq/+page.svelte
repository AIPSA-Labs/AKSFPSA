<script lang="ts">
	import { onMount } from 'svelte';
	import { list, create, update, remove } from '$lib/stores/api';
	import type { FAQ } from '$lib/stores/data';
	import TipTap from '$lib/components/admin/TipTap.svelte';
	import { X, Plus, LoaderCircle } from '@lucide/svelte';
	import { snackbar, recentActions } from '$lib/stores/snackbar';

	let faqs = $state<FAQ[]>([]);
	let loading = $state(true);
	let savingFaq = $state(false);
	let deletingFaq = $state<number | null>(null);

	let selected = $state<{ id: number; faq: FAQ } | null>(null);

	let showEditModal = $state(false);
	let editingFAQId = $state<number | null>(null);
	let faqForm = $state({ question: '', answer: '' });

	onMount(async () => {
		try {
			faqs = await list<FAQ>('faqs');
		} catch (e) {
			console.error('Failed to load FAQs:', e);
		} finally {
			loading = false;
		}
	});

	function openEdit(id: number | null) {
		editingFAQId = id;
		if (id !== null) {
			const item = faqs.find((f) => (f as any).id === id);
			faqForm = { question: item?.question ?? '', answer: item?.answer ?? '' };
		} else {
			faqForm = { question: '', answer: '' };
		}
		showEditModal = true;
	}

	async function saveFAQ() {
		savingFaq = true;
		try {
			if (editingFAQId !== null) {
				const updated = await update<FAQ>('faqs', editingFAQId, faqForm);
				faqs = faqs.map((f) => ((f as any).id === editingFAQId ? updated : f));
				if (selected && selected.id === editingFAQId) {
					selected = { id: selected.id, faq: updated };
				}
			} else {
				const created = await create<FAQ>('faqs', faqForm);
				faqs = [...faqs, created];
			}
			showEditModal = false;
			try { snackbar.send(editingFAQId !== null ? 'FAQ updated' : 'FAQ created', 'success'); recentActions.add(`${editingFAQId !== null ? 'Updated' : 'Created'} FAQ`, 'faqs'); } catch {}
		} finally { savingFaq = false; }
	}

	async function removeFAQ(id: number) {
		deletingFaq = id;
		try {
			await remove('faqs', id);
			faqs = faqs.filter((f) => (f as any).id !== id);
			selected = null;
			try { snackbar.send('FAQ deleted', 'success'); recentActions.add('Deleted FAQ', 'faqs'); } catch {}
		} finally { deletingFaq = null; }
	}

	function createFAQ() { openEdit(null); }
</script>

<h1 class="text-2xl font-bold text-primary">FAQs</h1>
<p class="mt-0.5 text-sm text-text-muted">Manage frequently asked questions</p>

<div class="mt-8">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold text-primary">All FAQs</h2>
		<div class="flex gap-2">
			<button onclick={createFAQ} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"><Plus size={16} class="inline" /> Create FAQ</button>
		</div>
	</div>

	<div class="mt-4 space-y-3">
		{#each faqs as faq, i}
			<button onclick={() => selected = { id: (faq as any).id, faq }} class="w-full rounded-xl border border-border bg-surface p-4 text-left transition hover:shadow-md">
				<p class="font-medium text-text">{faq.question}</p>
				<p class="mt-1 text-xs text-text-muted line-clamp-2">{faq.answer}</p>
			</button>
		{/each}
		{#if faqs.length === 0}
			<p class="py-8 text-center text-sm text-text-muted">No FAQs added yet</p>
		{/if}
	</div>
</div>

<!-- Detail Modal -->
{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selected = null}>
		<div class="mx-4 w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-border px-5 py-4">
				<h2 class="text-base font-semibold text-text">FAQ Details</h2>
				<button onclick={() => selected = null} class="rounded-full p-1 text-text-muted transition hover:bg-background"><X size={18} /></button>
			</div>
			<div class="space-y-4 p-5">
				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Question</p>
					<p class="mt-1 text-sm font-medium text-text">{selected.faq.question}</p>
				</div>
				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-text-muted">Answer</p>
					<div class="mt-1 text-sm leading-relaxed text-text-muted prose-content">{@html selected.faq.answer}</div>
				</div>
			</div>
			<div class="flex justify-end gap-3 border-t border-border px-5 py-4">
				<button onclick={() => { const s = selected!; const id = s.id; selected = null; openEdit(id); }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">Update</button>
				<button onclick={() => { const s = selected!; removeFAQ(s.id); }} disabled={deletingFaq === s.id} class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50">{#if deletingFaq === s.id}<LoaderCircle size={14} class="inline animate-spin" /> Deleting...{:else}Delete{/if}</button>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showEditModal = false}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editingFAQId !== null ? 'Edit FAQ' : 'Add FAQ'}</h2>
			<div class="mt-5 space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Question</label>
					<input type="text" bind:value={faqForm.question} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Answer</label>
					<TipTap content={faqForm.answer} onUpdate={(v) => faqForm.answer = v} compact />
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => showEditModal = false} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={saveFAQ} disabled={savingFaq} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{#if savingFaq}<LoaderCircle size={16} class="inline animate-spin" /> Saving...{:else}Save{/if}</button>
			</div>
		</div>
	</div>
{/if}
