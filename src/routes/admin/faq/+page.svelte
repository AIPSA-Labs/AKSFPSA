<script lang="ts">
	import { getStore, setStore, DEFAULT_FAQS } from '$lib/stores/data';
	import type { FAQ } from '$lib/stores/data';
	import { X, Plus } from '@lucide/svelte';

	let faqs = $state(getStore('faqs', DEFAULT_FAQS));

	let selected = $state<{ index: number; faq: FAQ } | null>(null);

	let showEditModal = $state(false);
	let editingFAQIndex = $state<number | null>(null);
	let faqForm = $state<FAQ>({ question: '', answer: '' });

	function openEdit(index: number | null) {
		editingFAQIndex = index;
		if (index !== null) {
			faqForm = { ...faqs[index] };
		} else {
			faqForm = { question: '', answer: '' };
		}
		showEditModal = true;
	}

	function saveFAQ() {
		if (editingFAQIndex !== null) {
			faqs[editingFAQIndex] = { ...faqForm };
		} else {
			faqs = [...faqs, { ...faqForm }];
		}
		setStore('faqs', faqs);
		if (selected && editingFAQIndex === selected.index) {
			selected = { index: selected.index, faq: faqs[selected.index] };
		}
		showEditModal = false;
	}

	function removeFAQ(index: number) {
		faqs = faqs.filter((_, i) => i !== index);
		setStore('faqs', faqs);
		selected = null;
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
			<button onclick={() => selected = { index: i, faq }} class="w-full rounded-xl border border-border bg-surface p-4 text-left transition hover:shadow-md">
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
					<p class="mt-1 text-sm leading-relaxed text-text-muted">{selected.faq.answer}</p>
				</div>
			</div>
			<div class="flex justify-end gap-3 border-t border-border px-5 py-4">
				<button onclick={() => { const idx = selected.index; selected = null; openEdit(idx); }} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">Update</button>
				<button onclick={() => { removeFAQ(selected.index); }} class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">Delete</button>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => showEditModal = false}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editingFAQIndex !== null ? 'Edit FAQ' : 'Add FAQ'}</h2>
			<div class="mt-5 space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Question</label>
					<input type="text" bind:value={faqForm.question} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Answer</label>
					<textarea bind:value={faqForm.answer} rows="4" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={() => showEditModal = false} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={saveFAQ} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}
