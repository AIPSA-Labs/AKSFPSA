<script lang="ts">
	const objectives: string[] = [
		"To provide unified representation for private self-financing institutions.",
		"To facilitate collaboration and knowledge sharing across districts.",
		"To support institutional governance and compliance frameworks.",
		"To promote faculty development and certification initiatives.",
		"To strengthen financial and operational sustainability of member schools."
	];
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			About the Association
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl leading-relaxed">
			The All Kerala Self Financing Private Schools Association is a statewide body
			representing private educational institutions committed to institutional excellence,
			collaborative growth, and structured governance.
		</p>

		<div class="mt-20 grid lg:grid-cols-2 gap-16">

			<div>
				<h2 class="text-2xl font-semibold text-primary">
					Our Vision
				</h2>

				<p class="mt-6 text-text-muted leading-relaxed">
					To build a unified network of self-financing institutions across Kerala
					that operate with transparency, compliance, and educational excellence.
				</p>
			</div>

			<div>
				<h2 class="text-2xl font-semibold text-primary">
					Our Mission
				</h2>

				<p class="mt-6 text-text-muted leading-relaxed">
					To provide structured representation, professional development opportunities,
					and strategic support mechanisms that strengthen institutional growth and
					statewide collaboration.
				</p>
			</div>

		</div>

		<div class="mt-20">

			<h2 class="text-2xl font-semibold text-primary">
				Core Objectives
			</h2>

			<ul class="mt-8 space-y-4 text-text-muted text-sm">
				{#each objectives as objective}
					<li>• {objective}</li>
				{/each}
			</ul>

		</div>

		<div class="mt-20 border border-border rounded-lg p-10 bg-surface">

			<h2 class="text-2xl font-semibold text-primary">
				Statewide Presence
			</h2>

			<p class="mt-6 text-text-muted leading-relaxed">
				The association maintains representation across multiple districts in Kerala,
				ensuring local coordination while maintaining unified statewide policy alignment.
			</p>

		</div>

		<div class="mt-20">

			<a
				href="/leadership"
				class="inline-block border border-primary text-primary px-8 py-3 rounded-md font-medium tracking-wide hover:bg-background transition"
			>
				View Executive Committee
			</a>

		</div>

	</div>
</section>
