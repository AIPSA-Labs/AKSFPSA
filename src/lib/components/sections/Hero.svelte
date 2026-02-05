<script>
	import Kerala from '../../assets/kerala.jpeg';
	import Reveal from '../utils/shared/Reveal.svelte';
</script>

<Reveal>
	<section class="relative overflow-hidden bg-background">
		<div class="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
			<p class="mb-6 text-xs font-medium tracking-widest text-primary uppercase">
				All Kerala Self Financing Private Schools Association
			</p>

			<h1 class="max-w-3xl text-4xl leading-tight font-semibold text-primary lg:text-5xl">
				The Unified Voice of Self Financing Private Schools in Kerala
			</h1>

			<p class="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
				Empowering institutions through policy advocacy, financial partnerships, teacher development
				programs, and collective representation across the state.
			</p>

			<div class="mt-10 flex flex-col gap-4 sm:flex-row">
				<a
					href="/membership"
					class="rounded-md bg-primary px-6 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
				>
					Become a Member
				</a>

				<a
					href="/about"
					class="rounded-md border border-primary px-6 py-3 font-medium tracking-wide text-primary transition hover:bg-surface"
				>
					Learn More
				</a>
			</div>
		</div>

		<!-- Satellite Image Layer -->
		<div class="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
			<img src={Kerala} alt="Kerala Satellite View" class="h-full w-full object-cover opacity-60" />

			<!-- Maroon Overlay -->
			<div class="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
		</div>
	</section>
</Reveal>
