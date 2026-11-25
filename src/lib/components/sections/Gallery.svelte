<script lang="ts">
	import { onMount } from 'svelte';
	import Reveal from '../utils/shared/Reveal.svelte';
	import { fade } from 'svelte/transition';
	import { list } from '$lib/stores/api';
	import type { GalleryAlbum } from '$lib/stores/data';
	import { STRINGS } from '$lib/constants/strings';
	import { Image as ImageIcon } from '@lucide/svelte';

	// - Minimum horizontal swipe distance in pixels to trigger slide change
	const SWIPE_THRESHOLD_PX = 50;

	let albums = $state<GalleryAlbum[]>([]);
	let loading = $state(true);
	let current = $state(0);
	let startX = 0;
	let endX = 0;

	onMount(async () => {
		try {
			albums = await list<GalleryAlbum>('gallery');
		} catch {
			albums = [];
		} finally {
			loading = false;
		}
	});

	function next() {
		if (albums.length === 0) {
			return;
		}
		current = (current + 1) % albums.length;
	}

	function prev() {
		if (albums.length === 0) {
			return;
		}
		current = (current - 1 + albums.length) % albums.length;
	}

	function handleTouchStart(e: TouchEvent) {
		startX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		endX = e.changedTouches[0].clientX;
		const diff = startX - endX;
		if (diff > SWIPE_THRESHOLD_PX) {
			next();
		}
		if (diff < -SWIPE_THRESHOLD_PX) {
			prev();
		}
	}

	function getAlbumImage(album: GalleryAlbum): string {
		if (album.cover) {
			return album.cover;
		}
		if (album.images && album.images.length > 0) {
			return album.images[0].src;
		}
		return '';
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

			{#if loading}
				<div class="py-12 text-center text-sm text-text-muted">Loading gallery highlights...</div>
			{:else if albums.length === 0}
				<div class="py-12 text-center text-sm text-text-muted">{STRINGS.GALLERY_EMPTY}</div>
			{:else}
				<div class="grid items-center gap-16 lg:grid-cols-2">
					{#key current}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
							ontouchstart={handleTouchStart}
							ontouchend={handleTouchEnd}
							in:fade={{ duration: 200 }}
						>
							{#if getAlbumImage(albums[current])}
								<img
									src={getAlbumImage(albums[current])}
									alt={albums[current].title}
									loading="lazy"
									decoding="async"
									class="h-full w-full object-cover"
								/>
							{:else}
								<ImageIcon size={48} class="text-text-muted/40" />
							{/if}
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
								href={`/gallery/${albums[current].slug}`}
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
				{#if albums.length > 1}
					<div class="mt-12 flex w-full justify-around gap-3">
						<button
							type="button"
							onclick={prev}
							class="rounded-md border border-primary px-4 py-2 text-primary transition hover:bg-background"
						>
							←
						</button>

						<button
							type="button"
							onclick={next}
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
								onclick={() => (current = i)}
								class={`h-3 w-3 rounded-full transition ${current === i ? 'bg-primary' : 'bg-border'}`}
							></button>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</section>
</Reveal>
