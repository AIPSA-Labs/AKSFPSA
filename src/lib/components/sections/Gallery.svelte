<script lang="ts">
	import Reveal from "../utils/shared/Reveal.svelte";
    	import { fade } from "svelte/transition";

	type Album = {
		title: string;
		description: string;
		image: string;
		link: string;
	};

	const albums: Album[] = [
		{
			title: "State-Level Educational Leadership Conference 2026",
			description:
				"Educational leaders from across Kerala convened to discuss institutional growth and policy direction.",
			image: "/images/highlight1.jpg",
			link: "/gallery/conference-2026"
		},
		{
			title: "District Coordinators Meeting – Malappuram",
			description:
				"District-level coordination meeting focusing on administrative alignment and membership expansion.",
			image: "/images/highlight2.jpg",
			link: "/gallery/malappuram-meet"
		},
		{
			title: "Teacher Certification Program",
			description:
				"Professional certification workshop conducted for faculty members across member institutions.",
			image: "/images/highlight3.jpg",
			link: "/gallery/certification-program"
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
<section class="bg-surface border-y border-border">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="flex justify-between items-end mb-12">

			<div class="max-w-3xl">
				<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
					Association Highlights
				</p>

				<h2 class="text-3xl lg:text-4xl font-semibold text-primary">
					Key Activities & Events
				</h2>
			</div>

			

		</div>

		<div class="grid lg:grid-cols-2 gap-16 items-center">

			{#key current}
				<div
					class="overflow-hidden rounded-lg border border-border bg-background"
					on:touchstart={handleTouchStart}
					on:touchend={handleTouchEnd}
					in:fade={{ duration: 200 }}
				>
					<img
						src={albums[current].image}
						alt={albums[current].title}
						class="w-full h-full object-cover"
					/>
				</div>
			{/key}

			<div>
				<h3 class="text-2xl font-semibold text-primary leading-tight">
					{albums[current].title}
				</h3>

				<p class="mt-6 text-text-muted leading-relaxed">
					{albums[current].description}
				</p>

				<div class="mt-10 flex flex-wrap gap-4">
					<a
						href={albums[current].link}
						class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
					>
						View Album
					</a>

					<a
						href="/gallery"
						class="inline-block border border-primary text-primary px-8 py-3 rounded-md font-medium tracking-wide hover:bg-background transition"
					>
						All Albums
					</a>
				</div>
			</div>

		</div>
<div class="flex gap-3 w-full justify-around mt-12">
				<button
					type="button"
					on:click={prev}
					class="border border-primary text-primary px-4 py-2 rounded-md hover:bg-background transition"
				>
					←
				</button>

				<button
					type="button"
					on:click={next}
					class="border border-primary text-primary px-4 py-2 rounded-md hover:bg-background transition"
				>
					→
				</button>
			</div>
		<div class="flex justify-center gap-2 mt-12">
			{#each albums as _, i}
				<button
					type="button"
					on:click={() => (current = i)}
					class={`w-3 h-3 rounded-full transition ${
						current === i ? "bg-primary" : "bg-border"
					}`}
				></button>
			{/each}
		</div>

	</div>
</section>

</Reveal>