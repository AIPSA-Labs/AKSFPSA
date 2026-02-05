<script lang="ts">
	type CTA = {
		title: string;
		description: string;
		primaryLink: string;
		secondaryLink: string;
	};

	const cta: CTA = {
		title: 'Become a Recognized Member Institution',
		description:
			'Join the statewide network of self-financing private schools and strengthen institutional representation, collaboration, and growth.',
		primaryLink: '/membership',
		secondaryLink: '/contact'
	};
</script>

<section class="bg-primary text-white">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="text-3xl leading-tight font-semibold lg:text-4xl">
					{cta.title}
				</h2>

				<p class="mt-6 leading-relaxed text-white/80">
					{cta.description}
				</p>
			</div>

			<div class="flex flex-col gap-4 sm:flex-row lg:justify-end">
				<a
					href={cta.primaryLink}
					class="inline-block rounded-md bg-white px-8 py-3 text-center font-medium tracking-wide text-primary transition hover:bg-surface"
				>
					Apply for Membership
				</a>

				<a
					href={cta.secondaryLink}
					class="inline-block rounded-md border border-white px-8 py-3 text-center font-medium tracking-wide text-white transition hover:bg-white/10"
				>
					Contact Association
				</a>
			</div>
		</div>
	</div>
</section>
