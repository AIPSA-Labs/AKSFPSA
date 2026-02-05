<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";

	export let data;
	const { album } = data;

	let current = 0;

	function next() {
		current = (current + 1) % album.images.length;
	}

	function prev() {
		current = (current - 1 + album.images.length) % album.images.length;
	}

	function goTo(index: number) {
		current = index;
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === "ArrowRight") next();
		if (e.key === "ArrowLeft") prev();
	}

	onMount(() => {
		if (!browser) return;
		window.addEventListener("keydown", handleKey);
	});
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">

		<a
			href="/gallery"
			class="text-sm text-primary font-medium hover:underline"
		>
			← Back to Gallery
		</a>

		<h1 class="mt-6 text-4xl font-semibold text-primary">
			{album.title}
		</h1>

		<p class="mt-4 text-text-muted">
			{album.date}
		</p>

		<div class="mt-12 relative border border-border rounded-lg overflow-hidden bg-surface">

			<!-- svelte-ignore a11y_img_redundant_alt -->
			<img
				src={album.images[current]}
				alt="Gallery Image"
				class="w-full max-h-150 object-contain"
			/>

			<button
				type="button"
				on:click={prev}
				class="absolute left-4 top-1/2 -translate-y-1/2 bg-background border border-border px-4 py-2 rounded-md"
			>
				←
			</button>

			<button
				type="button"
				on:click={next}
				class="absolute right-4 top-1/2 -translate-y-1/2 bg-background border border-border px-4 py-2 rounded-md"
			>
				→
			</button>

		</div>

		<div class="mt-8 flex gap-4 overflow-x-auto">

			{#each album.images as image, index}
				<button
					type="button"
					on:click={() => goTo(index)}
					class={`border rounded-md overflow-hidden ${
						current === index
							? "border-primary"
							: "border-border"
					}`}
				>
					<img
						src={image}
						alt="Thumbnail"
						class="h-20 w-32 object-cover"
					/>
				</button>
			{/each}

		</div>

	</div>
</section>
