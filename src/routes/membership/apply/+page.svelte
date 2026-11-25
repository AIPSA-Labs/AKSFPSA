<script lang="ts">
	import { create } from '$lib/stores/api';
	import type { ContactSubmission } from '$lib/stores/data';
	import { STRINGS } from '$lib/constants/strings';

	type FormData = {
		institutionName: string;
		registrationNumber: string;
		district: string;
		address: string;
		principalName: string;
		email: string;
		phone: string;
		category: string;
	};

	let step = $state(1);
	let submitting = $state(false);
	let submitted = $state(false);
	let submitError = $state('');

	const districts = [
		'Alappuzha',
		'Ernakulam',
		'Idukki',
		'Kannur',
		'Kasaragod',
		'Kollam',
		'Kottayam',
		'Kozhikode',
		'Malappuram',
		'Palakkad',
		'Pathanamthitta',
		'Thiruvananthapuram',
		'Thrissur',
		'Wayanad'
	];

	const steps = [
		'Institution Details',
		'Contact Information',
		'Membership Category',
		'Review & Submit'
	];

	let form = $state<FormData>({
		institutionName: '',
		registrationNumber: '',
		district: '',
		address: '',
		principalName: '',
		email: '',
		phone: '',
		category: ''
	});

	function next() {
		if (step < steps.length) {
			step += 1;
		}
	}

	function prev() {
		if (step > 1) {
			step -= 1;
		}
	}

	async function submit() {
		submitting = true;
		submitError = '';
		try {
			const messageLines = [
				`Membership Category: ${form.category}`,
				`Registration Number: ${form.registrationNumber}`,
				`District: ${form.district}`,
				`Address: ${form.address}`
			].join('\n');

			await create<ContactSubmission>('contact-submissions', {
				name: form.principalName || form.institutionName,
				institution: form.institutionName,
				email: form.email,
				phone: form.phone,
				message: messageLines,
				date: new Date().toLocaleDateString('en-IN', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				}),
				status: 'new',
				notes: '',
				source: 'membership-application'
			});

			submitted = true;
			form = {
				institutionName: '',
				registrationNumber: '',
				district: '',
				address: '',
				principalName: '',
				email: '',
				phone: '',
				category: ''
			};
			step = 1;
		} catch {
			submitError = STRINGS.MEMBERSHIP_SUBMIT_ERROR;
		} finally {
			submitting = false;
		}
	}
</script>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-4xl px-6 py-20 lg:px-8">
		<h1 class="text-3xl font-semibold text-primary">Membership Application</h1>

		{#if submitted}
			<div
				class="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800"
			>
				{STRINGS.MEMBERSHIP_SUBMIT_SUCCESS}
			</div>
		{/if}

		{#if submitError}
			<div class="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
				{submitError}
			</div>
		{/if}

		<div class="mt-10 flex items-center gap-4">
			{#each steps as label, index}
				<div class="flex items-center gap-3">
					<div
						class={`flex h-8 w-8 items-center justify-center rounded-full p-2 text-sm font-medium ${
							step === index + 1
								? 'bg-primary text-white'
								: 'border border-border bg-surface text-text-muted'
						}`}
					>
						{index + 1}
					</div>

					<span
						class={`text-sm ${
							step === index + 1 ? 'p-2 font-medium text-primary' : 'text-text-muted'
						}`}
					>
						{label}
					</span>
				</div>
			{/each}
		</div>

		<div class="mt-12 rounded-lg border border-border bg-surface p-10">
			{#if step === 1}
				<div class="space-y-6">
					<input
						type="text"
						placeholder="Institution Name"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.institutionName}
					/>

					<input
						type="text"
						placeholder="Registration Number"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.registrationNumber}
					/>

					<select
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.district}
					>
						<option value="">Select District</option>
						{#each districts as d}
							<option value={d}>{d}</option>
						{/each}
					</select>

					<textarea
						placeholder="Institution Address"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						rows="3"
						bind:value={form.address}
					></textarea>
				</div>
			{/if}

			{#if step === 2}
				<div class="space-y-6">
					<input
						type="text"
						placeholder="Principal / Head Name"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.principalName}
					/>

					<input
						type="email"
						placeholder="Official Email Address"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.email}
					/>

					<input
						type="tel"
						placeholder="Contact Phone Number"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.phone}
					/>
				</div>
			{/if}

			{#if step === 3}
				<div class="space-y-6">
					<select
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.category}
					>
						<option value="">Select Membership Category</option>
						<option value="recognized">Recognized Member Institution</option>
						<option value="associate">Associate Member Institution</option>
					</select>
				</div>
			{/if}

			{#if step === 4}
				<div class="space-y-4 text-sm text-text-muted">
					<p><strong class="text-primary">Institution:</strong> {form.institutionName}</p>
					<p><strong class="text-primary">Registration:</strong> {form.registrationNumber}</p>
					<p><strong class="text-primary">District:</strong> {form.district}</p>
					<p><strong class="text-primary">Principal:</strong> {form.principalName}</p>
					<p><strong class="text-primary">Email:</strong> {form.email}</p>
					<p><strong class="text-primary">Phone:</strong> {form.phone}</p>
					<p><strong class="text-primary">Category:</strong> {form.category}</p>
				</div>
			{/if}
		</div>

		<div class="mt-10 flex justify-between">
			{#if step > 1}
				<button
					type="button"
					onclick={prev}
					class="rounded-md border border-primary px-6 py-3 font-medium text-primary"
				>
					Back
				</button>
			{/if}

			{#if step < steps.length}
				<button
					type="button"
					onclick={next}
					class="ml-auto rounded-md bg-primary px-6 py-3 font-medium text-white"
				>
					Next
				</button>
			{:else}
				<button
					type="button"
					onclick={submit}
					disabled={submitting}
					class="ml-auto rounded-md bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
				>
					{submitting ? 'Submitting...' : 'Submit Application'}
				</button>
			{/if}
		</div>
	</div>
</section>
