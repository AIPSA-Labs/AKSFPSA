<script lang="ts">
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

	let step = 1;

	const steps = [
		"Institution Details",
		"Contact Information",
		"Membership Category",
		"Review & Submit"
	];

	let form: FormData = {
		institutionName: "",
		registrationNumber: "",
		district: "",
		address: "",
		principalName: "",
		email: "",
		phone: "",
		category: ""
	};

	function next() {
		if (step < steps.length) step++;
	}

	function prev() {
		if (step > 1) step--;
	}

	function submit() {
		console.log(form);
	}
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-4xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-3xl font-semibold text-primary">
			Membership Application
		</h1>

		<div class="mt-10 flex items-center gap-4">
			{#each steps as label, index}
				<div class="flex items-center gap-3">
					<div
						class={`w-8 h-8 rounded-full p-2 flex items-center justify-center text-sm font-medium ${
							step === index + 1
								? "bg-primary text-white"
								: "bg-surface border border-border text-text-muted"
						}`}
					>
						{index + 1}
					</div>

					<span
						class={`text-sm ${
							step === index + 1 ? "text-primary font-medium p-2" : "text-text-muted"
						}`}
					>
						{label}
					</span>
				</div>
			{/each}
		</div>

		<div class="mt-12 border border-border rounded-lg p-10 bg-surface">

			{#if step === 1}
				<div class="space-y-6">
					<input
						type="text"
						placeholder="Institution Name"
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
						bind:value={form.institutionName}
					/>

					<input
						type="text"
						placeholder="Registration Number"
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
						bind:value={form.registrationNumber}
					/>

					<input
						type="text"
						placeholder="District"
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
						bind:value={form.district}
					/>

					<textarea
						placeholder="Institution Address"
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
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
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
						bind:value={form.principalName}
					/>

					<input
						type="email"
						placeholder="Official Email Address"
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
						bind:value={form.email}
					/>

					<input
						type="tel"
						placeholder="Contact Phone Number"
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
						bind:value={form.phone}
					/>
				</div>
			{/if}

			{#if step === 3}
				<div class="space-y-6">
					<select
						class="w-full border border-border rounded-md px-4 py-3 bg-background"
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
					on:click={prev}
					class="border border-primary text-primary px-6 py-3 rounded-md font-medium"
				>
					Back
				</button>
			{/if}

			{#if step < steps.length}
				<button
					type="button"
					on:click={next}
					class="ml-auto bg-primary text-white px-6 py-3 rounded-md font-medium"
				>
					Next
				</button>
			{:else}
				<button
					type="button"
					on:click={submit}
					class="ml-auto bg-primary text-white px-6 py-3 rounded-md font-medium"
				>
					Submit Application
				</button>
			{/if}

		</div>

	</div>
</section>
