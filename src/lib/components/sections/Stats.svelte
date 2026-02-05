<script>
	import Counter from '../utils/Home/Counter.svelte';
	import Reveal from '../utils/shared/Reveal.svelte';
</script>

<Reveal>
	<section class=" border-y border-border">
		<div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
			<div class="grid grid-cols-2 gap-10 text-center md:grid-cols-4">
				<div>
					<p class="text-4xl font-semibold tracking-tight text-primary lg:text-5xl">
						<Counter value={1700} suffix="+" />
					</p>
					<p class="mt-3 text-sm tracking-wider text-text-muted uppercase">Students</p>
				</div>

				<div>
					<p class="text-4xl font-semibold tracking-tight text-primary lg:text-5xl">
						<Counter value={60} suffix="+" />
					</p>
					<p class="mt-3 text-sm tracking-wider text-text-muted uppercase">Courses</p>
				</div>

				<div>
					<p class="text-4xl font-semibold tracking-tight text-primary lg:text-5xl">
						<Counter value={800} suffix="+" />
					</p>
					<p class="mt-3 text-sm tracking-wider text-text-muted uppercase">Certified Teachers</p>
				</div>

				<div>
					<p class="text-4xl font-semibold tracking-tight text-primary lg:text-5xl">
						<Counter value={130} suffix="+" />
					</p>
					<p class="mt-3 text-sm tracking-wider text-text-muted uppercase">Awards</p>
				</div>
			</div>
		</div>
	</section>
</Reveal>
