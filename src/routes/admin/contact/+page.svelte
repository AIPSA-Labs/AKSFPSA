<script lang="ts">
	import { getStore, setStore, DEFAULT_CONTACT_INFO } from '$lib/stores/data';
	import type { ContactInfo, ContactSubmission } from '$lib/stores/data';
	import { X } from '@lucide/svelte';

	let info = $state(getStore('contact_info', DEFAULT_CONTACT_INFO));
	let editing = $state(false);
	let form = $state<ContactInfo>({ ...info });

	function saveInfo() {
		info = { ...form };
		setStore('contact_info', info);
		editing = false;
	}

	function resetInfo() {
		info = { ...DEFAULT_CONTACT_INFO };
		form = { ...DEFAULT_CONTACT_INFO };
		setStore('contact_info', info);
		editing = false;
	}

	function startEdit() {
		form = { ...info };
		editing = true;
	}

	// Submissions
	let submissions = $state(getStore<ContactSubmission[]>('submissions', []));
	let selectedSubmission = $state<ContactSubmission | null>(null);

	function viewSubmission(s: ContactSubmission) {
		selectedSubmission = s;
	}

	function clearSubmissions() {
		submissions = [];
		setStore('submissions', submissions);
	}
</script>

<h1 class="text-2xl font-bold text-primary">Contact</h1>
<p class="mt-0.5 text-sm text-text-muted">Manage contact information and view inquiries</p>

<!-- Contact Info Section -->
<div class="mt-8">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold text-primary">Contact Information</h2>
		<div class="flex gap-2">
			<button onclick={resetInfo} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">Reset</button>
			{#if editing}
				<button onclick={() => editing = false} class="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition hover:bg-surface">Cancel</button>
				<button onclick={saveInfo} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Save</button>
			{:else}
				<button onclick={startEdit} class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Edit</button>
			{/if}
		</div>
	</div>

	{#if editing}
		<div class="mt-4 space-y-4 rounded-xl border border-border bg-surface p-5">
			<div>
				<label class="mb-1 block text-sm font-medium text-text">Address</label>
				<textarea bind:value={form.address} rows="3" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Email</label>
					<input type="text" bind:value={form.email} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium text-text">Phone</label>
					<input type="text" bind:value={form.phone} class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
				</div>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium text-text">Office Hours</label>
				<textarea bind:value={form.hours} rows="2" class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"></textarea>
			</div>
		</div>
	{:else}
		<div class="mt-4 rounded-xl border border-border bg-surface p-5">
			<div class="space-y-3 text-sm">
				<div>
					<span class="font-medium text-text-muted">Address:</span>
					<p class="mt-0.5 whitespace-pre-line text-text">{info.address}</p>
				</div>
				<div class="grid gap-3 sm:grid-cols-3">
					<div>
						<span class="font-medium text-text-muted">Email:</span>
						<p class="text-text">{info.email}</p>
					</div>
					<div>
						<span class="font-medium text-text-muted">Phone:</span>
						<p class="text-text">{info.phone}</p>
					</div>
					<div>
						<span class="font-medium text-text-muted">Hours:</span>
						<p class="whitespace-pre-line text-text">{info.hours}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Submissions Section -->
<div class="mt-12">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold text-primary">Contact Form Submissions</h2>
		{#if submissions.length > 0}
			<button onclick={clearSubmissions} class="rounded-lg border border-border px-3 py-2 text-sm text-red-500 transition hover:bg-surface">Clear All</button>
		{/if}
	</div>

	{#if submissions.length === 0}
		<div class="mt-4 rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
			No contact form submissions yet.
		</div>
	{:else}
		<div class="mt-4 overflow-hidden rounded-xl border border-border">
			<table class="w-full text-left text-sm">
				<thead class="border-b border-border bg-surface">
					<tr>
						<th class="px-4 py-3 font-medium text-text-muted">Name</th>
						<th class="hidden px-4 py-3 font-medium text-text-muted md:table-cell">Email</th>
						<th class="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">Date</th>
						<th class="px-4 py-3 font-medium text-text-muted">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each submissions as sub}
						<tr class="border-b border-border last:border-0 hover:bg-surface/50">
							<td class="px-4 py-3 font-medium text-text">{sub.name}</td>
							<td class="hidden px-4 py-3 text-text-muted md:table-cell">{sub.email}</td>
							<td class="hidden px-4 py-3 text-text-muted sm:table-cell">{sub.date}</td>
							<td class="px-4 py-3">
								<button onclick={() => viewSubmission(sub)} class="text-sm text-primary hover:underline">View</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Submission Detail Modal -->
{#if selectedSubmission}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onclick={() => selectedSubmission = null}>
		<div class="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-text">Submission Details</h2>
				<button onclick={() => selectedSubmission = null} class="text-text-muted hover:text-text"><X size={20} /></button>
			</div>
			<div class="mt-5 space-y-3 text-sm">
				<div><span class="font-medium text-text-muted">Name:</span> <p class="text-text">{selectedSubmission.name}</p></div>
				<div><span class="font-medium text-text-muted">Institution:</span> <p class="text-text">{selectedSubmission.institution}</p></div>
				<div><span class="font-medium text-text-muted">Email:</span> <p class="text-text">{selectedSubmission.email}</p></div>
				<div><span class="font-medium text-text-muted">Phone:</span> <p class="text-text">{selectedSubmission.phone}</p></div>
				<div><span class="font-medium text-text-muted">Date:</span> <p class="text-text">{selectedSubmission.date}</p></div>
				<div><span class="font-medium text-text-muted">Message:</span> <p class="mt-1 whitespace-pre-wrap rounded-lg bg-background p-3 text-text">{selectedSubmission.message}</p></div>
			</div>
			<div class="mt-6 flex justify-end">
				<button onclick={() => selectedSubmission = null} class="rounded-lg border border-border px-4 py-2 text-sm text-text-muted">Close</button>
			</div>
		</div>
	</div>
{/if}
