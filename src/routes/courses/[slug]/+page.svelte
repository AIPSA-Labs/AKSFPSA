<script lang="ts">
	export let data;

	const { course } = data;
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-5xl mx-auto px-6 lg:px-8 py-20">

		<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
			{course.category}
		</p>

		<h1 class="text-4xl font-semibold text-primary leading-tight">
			{course.title}
		</h1>

		<p class="mt-6 text-text-muted leading-relaxed">
			{course.description}
		</p>

		<div class="mt-10 grid sm:grid-cols-3 gap-6 border border-border rounded-lg p-6 bg-surface">

			<div>
				<p class="text-xs uppercase text-text-muted">Duration</p>
				<p class="mt-2 font-medium text-primary">{course.duration}</p>
			</div>

			<div>
				<p class="text-xs uppercase text-text-muted">Mode</p>
				<p class="mt-2 font-medium text-primary">{course.mode}</p>
			</div>

			<div>
				<p class="text-xs uppercase text-text-muted">Fee</p>
				<p class="mt-2 font-medium text-primary">{course.fee}</p>
			</div>

		</div>

		<div class="mt-16">

			<h2 class="text-2xl font-semibold text-primary">
				Eligibility
			</h2>

			<p class="mt-6 text-text-muted leading-relaxed">
				{course.eligibility}
			</p>

		</div>

		<div class="mt-16">

			<h2 class="text-2xl font-semibold text-primary">
				Learning Outcomes
			</h2>

			<ul class="mt-8 space-y-3 text-text-muted text-sm">
				{#each course.outcomes as outcome}
					<li>• {outcome}</li>
				{/each}
			</ul>

		</div>

		<div class="mt-20">

			<a
				href="/contact"
				class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
			>
				Enquire About This Program
			</a>

		</div>

	</div>
</section>
