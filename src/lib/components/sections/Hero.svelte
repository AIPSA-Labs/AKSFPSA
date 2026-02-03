<script>
    import Kerala from '../../assets/kerala.jpeg'
</script>
<section class="relative bg-background overflow-hidden">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10">

		<p class="text-primary font-medium uppercase tracking-widest text-xs mb-6">
			All Kerala Self Financing Private Schools Association
		</p>

		<h1 class="text-4xl lg:text-5xl font-semibold text-primary leading-tight max-w-3xl">
			The Unified Voice of Self Financing Private Schools in Kerala
		</h1>

		<p class="mt-6 text-lg text-text-muted max-w-2xl leading-relaxed">
			Empowering institutions through policy advocacy, financial partnerships,
			teacher development programs, and collective representation across the state.
		</p>

		<div class="mt-10 flex flex-col sm:flex-row gap-4">
			<a
				href="/membership"
				class="bg-primary text-white px-6 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition">
				Become a Member
			</a>

			<a
				href="/about"
				class="border border-primary text-primary px-6 py-3 rounded-md font-medium tracking-wide hover:bg-surface transition">
				Learn More
			</a>
		</div>
	</div>

	<!-- Satellite Image Layer -->
	<div class="absolute inset-y-0 right-0 w-1/2 hidden lg:block pointer-events-none">
		<img
			src={Kerala}
			alt="Kerala Satellite View"
			class="h-full w-full object-cover opacity-60"
		/>

		<!-- Maroon Overlay -->
		<div class="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
	</div>
</section>
