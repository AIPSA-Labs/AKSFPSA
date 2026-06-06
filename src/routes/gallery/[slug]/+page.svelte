<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getStore, DEFAULT_ALBUMS } from '$lib/stores/data';
	import { ArrowLeft, ChevronLeft, ChevronRight, X } from '@lucide/svelte';

	let album = $state<(typeof DEFAULT_ALBUMS[number]) | null>(null);
	let lightboxOpen = $state(false);
	let currentIndex = $state(0);
	let touchStartX = $state(0);
	let touchEndX = $state(0);

	onMount(() => {
		if (!browser) return;
		const albums = getStore('albums', DEFAULT_ALBUMS);
		album = albums.find((a) => a.slug === $page.params.slug) ?? null;
	});

	function openLightbox(index: number) {
		currentIndex = index;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function next() {
		if (!album) return;
		currentIndex = (currentIndex + 1) % album.images.length;
	}

	function prev() {
		if (!album) return;
		currentIndex = (currentIndex - 1 + album.images.length) % album.images.length;
	}

	function handleKey(e: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) next();
			else prev();
		}
	}

	onMount(() => {
		if (!browser) return;
		window.addEventListener('keydown', handleKey);
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('keydown', handleKey);
	});
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">

		<a href="/gallery" class="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
			<ArrowLeft size={16} /> Back to Gallery
		</a>

		{#if album}
			<h1 class="mt-4 text-2xl sm:text-4xl font-semibold text-primary">{album.title}</h1>
			<div class="mt-2 flex flex-wrap items-center gap-3 text-sm">
				<span class="text-text-muted">{album.date}</span>
				<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{album.category}</span>
				<span class="text-text-muted">{album.images.length} photos</span>
			</div>
			{#if album.description}
				<p class="mt-4 text-sm sm:text-base text-text-muted max-w-3xl leading-relaxed">{album.description}</p>
			{/if}

			<div class="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
				{#each album.images as img, i}
					<button onclick={() => openLightbox(i)} class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background transition hover:shadow-md">
						<img src={img.src} alt={img.alt} class="h-full w-full object-cover transition group-hover:scale-105" />
					</button>
				{/each}
			</div>
		{:else}
			<div class="mt-12 text-center text-text-muted">
				<p>Album not found.</p>
				<a href="/gallery" class="mt-2 inline-block text-primary hover:underline">Browse all albums</a>
			</div>
		{/if}

	</div>
</section>

<!-- Lightbox -->
{#if lightboxOpen && album}
	<div class="fixed inset-0 z-50 flex flex-col bg-black/95"
		onkeydown={handleKey}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}>

		<!-- Top bar -->
		<div class="flex items-center justify-between px-4 py-3">
			<button onclick={closeLightbox} class="text-white/80 hover:text-white"><X size={24} /></button>
			<span class="text-sm text-white/70">{currentIndex + 1} / {album.images.length}</span>
			<div class="w-6"></div>
		</div>

		<!-- Image area -->
		<div class="flex flex-1 items-center justify-center px-4">
			<button onclick={prev} class="absolute left-2 sm:left-4 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white">
				<ChevronLeft size={24} />
			</button>
			<img src={album.images[currentIndex].src} alt={album.images[currentIndex].alt}
				class="max-h-[70vh] max-w-full object-contain" />
			<button onclick={next} class="absolute right-2 sm:right-4 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white">
				<ChevronRight size={24} />
			</button>
		</div>

		<!-- Thumbnail strip -->
		<div class="flex items-center justify-center gap-2 overflow-x-auto px-4 py-3">
			{#each album.images as img, i}
				<button onclick={() => currentIndex = i}
					class="shrink-0 overflow-hidden rounded border-2 transition {i === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}">
					<img src={img.src} alt={img.alt} class="h-12 w-16 object-cover" />
				</button>
			{/each}
		</div>
	</div>
{/if}
