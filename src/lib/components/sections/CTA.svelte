<script lang="ts">
	type CTA = {
		title: string;
		description: string;
		primaryLink: string;
		secondaryLink: string;
	};

	const cta: CTA = {
		title: "Become a Recognized Member Institution",
		description:
			"Join the statewide network of self-financing private schools and strengthen institutional representation, collaboration, and growth.",
		primaryLink: "/membership",
		secondaryLink: "/contact"
	};
</script>

<section class="bg-primary text-white">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="grid lg:grid-cols-2 gap-12 items-center">

			<div>
				<h2 class="text-3xl lg:text-4xl font-semibold leading-tight">
					{cta.title}
				</h2>

				<p class="mt-6 text-white/80 leading-relaxed">
					{cta.description}
				</p>
			</div>

			<div class="flex flex-col sm:flex-row gap-4 lg:justify-end">

				<a
					href={cta.primaryLink}
					class="inline-block bg-white text-primary px-8 py-3 rounded-md font-medium tracking-wide hover:bg-surface transition text-center"
				>
					Apply for Membership
				</a>

				<a
					href={cta.secondaryLink}
					class="inline-block border border-white text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-white/10 transition text-center"
				>
					Contact Association
				</a>

			</div>

		</div>

	</div>
</section>
