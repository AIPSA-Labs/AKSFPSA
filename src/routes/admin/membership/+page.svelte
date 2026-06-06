<script lang="ts">
	import { getStore, setStore, DEFAULT_PLANS, DEFAULT_FAQS } from '$lib/stores/data';
	import type { MembershipPlan, FAQ } from '$lib/stores/data';
	import { X } from '@lucide/svelte';

	let plans = $state(getStore('plans', DEFAULT_PLANS));
	let faqs = $state(getStore('faqs', DEFAULT_FAQS));

	// Plans
	let showPlanModal = $state(false);
	let editingPlanIndex = $state<number | null>(null);
	let planForm = $state<MembershipPlan>({ title: '', fee: '', description: '', features: [''] });

	function openPlan(index: number | null) {
		editingPlanIndex = index;
		if (index !== null) {
			planForm = { ...plans[index], features: [...plans[index].features] };
		} else {
			planForm = { title: '', fee: '', description: '', features: [''] };
		}
		showPlanModal = true;
	}

	function savePlan() {
		const cleaned = { ...planForm, features: planForm.features.filter((f) => f.trim()) };
		if (editingPlanIndex !== null) {
			plans[editingPlanIndex] = cleaned;
		} else {
			plans = [...plans, cleaned];
		}
		setStore('plans', plans);
		showPlanModal = false;
	}

	function removePlan(index: number) {
		plans = plans.filter((_, i) => i !== index);
		setStore('plans', plans);
	}

	function addFeature() {
		planForm.features = [...planForm.features, ''];
	}

	function removeFeature(index: number) {
		planForm.features = planForm.features.filter((_, i) => i !== index);
	}

	// FAQs
	let showFAQModal = $state(false);
	let editingFAQIndex = $state<number | null>(null);
	let faqForm = $state<FAQ>({ question: '', answer: '' });

	function openFAQ(index: number | null) {
		editingFAQIndex = index;
		if (index !== null) {
			faqForm = { ...faqs[index] };
		} else {
			faqForm = { question: '', answer: '' };
		}
		showFAQModal = true;
	}

	function saveFAQ() {
		if (editingFAQIndex !== null) {
			faqs[editingFAQIndex] = { ...faqForm };
		} else {
			faqs = [...faqs, { ...faqForm }];
		}
		setStore('faqs', faqs);
		showFAQModal = false;
	}

	function removeFAQ(index: number) {
		faqs = faqs.filter((_, i) => i !== index);
		setStore('faqs', faqs);
	}

	function closeAll() { showPlanModal = false; showFAQModal = false; }

	function resetPlans() { plans = [...DEFAULT_PLANS]; setStore('plans', plans); }
	function resetFAQs() { faqs = [...DEFAULT_FAQS]; setStore('faqs', faqs); }
</script>

<h1 class="text-2xl font-bold text-primary">Membership</h1>
<p class="mt-0.5 text-sm text-text-muted">Manage membership plans and FAQs</p>

<!-- Plans Section -->
<div class="mt-8">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold text-primary">Membership Plans</h2>
		<div class="flex gap-2">
			<button onclick={resetPlans} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">Reset</button>
			<button onclick={() => openPlan(null)} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add Plan</button>
		</div>
	</div>

	<div class="mt-4 grid gap-5 sm:grid-cols-2">
		{#each plans as plan, i}
			<div class="rounded-xl border border-border bg-surface p-5">
				<div class="flex items-start justify-between">
					<div>
						<h3 class="font-semibold text-text">{plan.title}</h3>
						<p class="mt-0.5 text-sm font-medium text-primary">{plan.fee}</p>
					</div>
					<div class="flex gap-2">
						<button onclick={() => openPlan(i)} class="text-xs text-primary hover:underline">Edit</button>
						<button onclick={() => removePlan(i)} class="text-xs text-red-500 hover:underline">Delete</button>
					</div>
				</div>
				<p class="mt-3 text-xs text-text-muted">{plan.description}</p>
				<ul class="mt-3 space-y-1">
					{#each plan.features as feature}
						<li class="text-xs text-text-muted">• {feature}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>

<!-- FAQs Section -->
<div class="mt-12">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold text-primary">FAQs</h2>
		<div class="flex gap-2">
			<button onclick={resetFAQs} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">Reset</button>
			<button onclick={() => openFAQ(null)} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover">+ Add FAQ</button>
		</div>
	</div>

	<div class="mt-4 space-y-3">
		{#each faqs as faq, i}
			<div class="rounded-xl border border-border bg-surface p-4">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<p class="font-medium text-text">{faq.question}</p>
						<p class="mt-1 text-xs text-text-muted">{faq.answer}</p>
					</div>
					<div class="ml-4 flex gap-2">
						<button onclick={() => openFAQ(i)} class="text-xs text-primary hover:underline">Edit</button>
						<button onclick={() => removeFAQ(i)} class="text-xs text-red-500 hover:underline">Delete</button>
					</div>
				</div>
			</div>
		{/each}
		{#if faqs.length === 0}
			<p class="py-8 text-center text-sm text-text-muted">No FAQs added yet</p>
		{/if}
	</div>
</div>

<!-- Plan Modal -->
{#if showPlanModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeAll}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-lg font-semibold text-primary">{editingPlanIndex !== null ? 'Edit Plan' : 'Add Plan'}</h2>
			<div class="mt-5 max-h-80 space-y-4 overflow-y-auto">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Title</label>
					<input type="text" bind:value={planForm.title} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Fee</label>
					<input type="text" bind:value={planForm.fee} placeholder="e.g. ₹5,000 (Annual)" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Description</label>
					<textarea bind:value={planForm.description} rows="2" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
				</div>
				<div>
					<div class="mb-1 flex items-center justify-between">
						<label class="text-sm font-medium text-text">Features</label>
						<button onclick={addFeature} class="text-xs text-primary hover:underline">+ Add</button>
					</div>
					<div class="space-y-2">
						{#each planForm.features as _, i}
							<div class="flex gap-2">
								<input type="text" bind:value={planForm.features[i]} placeholder="Feature"
									class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
								<button onclick={() => removeFeature(i)} class="text-red-500 hover:text-red-700"><X size={14} /></button>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeAll} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={savePlan} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}

<!-- FAQ Modal -->
{#if showFAQModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={closeAll}>
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
				<button onclick={closeAll} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Cancel</button>
				<button onclick={saveFAQ} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			</div>
		</div>
	</div>
{/if}
