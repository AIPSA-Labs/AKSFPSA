<script lang="ts">
	import Reveal from '../utils/shared/Reveal.svelte';
	import { fade } from 'svelte/transition';

	type Album = {
		title: string;
		description: string;
		image: string;
		link: string;
	};

	const albums: Album[] = [
		{
			title: 'State-Level Educational Leadership Conference 2026',
			description:
				'Educational leaders from across Kerala convened to discuss institutional growth and policy direction.',
			image: '/images/highlight1.jpg',
			link: '/gallery/conference-2026'
		},
		{
			title: 'District Coordinators Meeting – Malappuram',
			description:
				'District-level coordination meeting focusing on administrative alignment and membership expansion.',
			image: '/images/highlight2.jpg',
			link: '/gallery/malappuram-meet'
		},
		{
			title: 'Teacher Certification Program',
			description:
				'Professional certification workshop conducted for faculty members across member institutions.',
			image: '/images/highlight3.jpg',
			link: '/gallery/certification-program'
		}
	];

	let current = 0;
	let startX = 0;
	let endX = 0;

	function next() {
		current = (current + 1) % albums.length;
	}

	function prev() {
		current = (current - 1 + albums.length) % albums.length;
	}

	function handleTouchStart(e: TouchEvent) {
		startX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		endX = e.changedTouches[0].clientX;
		const diff = startX - endX;
		if (diff > 50) next();
		if (diff < -50) prev();
	}
</script>

<Reveal>
	<section class="border-y border-border bg-surface">
		<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
			<div class="mb-12 flex items-end justify-between">
				<div class="max-w-3xl">
					<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
						Association Highlights
					</p>

					<h2 class="text-3xl font-semibold text-primary lg:text-4xl">Key Activities & Events</h2>
				</div>
			</div>

			<div class="grid items-center gap-16 lg:grid-cols-2">
				{#key current}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="overflow-hidden rounded-lg border border-border bg-background"
						on:touchstart={handleTouchStart}
						on:touchend={handleTouchEnd}
						in:fade={{ duration: 200 }}
					>
						<img
							src={albums[current].image}
							alt={albums[current].title}
							class="h-full w-full object-cover"
						/>
					</div>
				{/key}

				<div>
					<h3 class="text-2xl leading-tight font-semibold text-primary">
						{albums[current].title}
					</h3>

					<p class="mt-6 leading-relaxed text-text-muted">
						{albums[current].description}
					</p>

					<div class="mt-10 flex flex-wrap gap-4">
						<a
							href={albums[current].link}
							class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
						>
							View Album
						</a>

						<a
							href="/gallery"
							class="inline-block rounded-md border border-primary px-8 py-3 font-medium tracking-wide text-primary transition hover:bg-background"
						>
							All Albums
						</a>
					</div>
				</div>
			</div>
			<div class="mt-12 flex w-full justify-around gap-3">
				<button
					type="button"
					on:click={prev}
					class="rounded-md border border-primary px-4 py-2 text-primary transition hover:bg-background"
				>
					←
				</button>

				<button
					type="button"
					on:click={next}
					class="rounded-md border border-primary px-4 py-2 text-primary transition hover:bg-background"
				>
					→
				</button>
			</div>
			<div class="mt-12 flex justify-center gap-2">
				{#each albums as _, i}
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						type="button"
						on:click={() => (current = i)}
						class={`h-3 w-3 rounded-full transition ${current === i ? 'bg-primary' : 'bg-border'}`}
					></button>
				{/each}
			</div>
		</div>
	</section>
</Reveal>
