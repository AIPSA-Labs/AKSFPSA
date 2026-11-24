<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { list } from '$lib/stores/api';
	import type { GalleryAlbum } from '$lib/stores/data';
	import { ArrowLeft, ChevronLeft, ChevronRight, X } from '@lucide/svelte';
	import { SITE_CONFIG } from '$lib/constants/strings';

	let album = $state<GalleryAlbum | null>(null);
	let lightboxOpen = $state(false);
	let currentIndex = $state(0);
	let touchStartX = $state(0);
	let touchEndX = $state(0);

	const gallerySchema = $derived(
		album
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'ImageGallery',
					name: album.title,
					description: album.description || `${album.title} - Photo gallery from AKSFPSA`,
					url: `${SITE_CONFIG.BASE_URL}/gallery/${album.slug}`,
					datePublished: album.date,
					provider: {
						'@type': 'EducationalOrganization',
						name: SITE_CONFIG.SITE_NAME,
						url: SITE_CONFIG.BASE_URL
					}
				})
			: ''
	);

	const galleryScript = $derived(
		gallerySchema ? `<script type="application/ld+json">${gallerySchema}</` + `script>` : ''
	);

	onMount(async () => {
		const albums = await list<GalleryAlbum>('gallery');
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
		if (!album) {
			return;
		}
		currentIndex = (currentIndex + 1) % album.images.length;
	}

	function prev() {
		if (!album) {
			return;
		}
		currentIndex = (currentIndex - 1 + album.images.length) % album.images.length;
	}

	function handleKey(e: KeyboardEvent) {
		if (!lightboxOpen) {
			return;
		}
		if (e.key === 'Escape') {
			closeLightbox();
		}
		if (e.key === 'ArrowRight') {
			next();
		}
		if (e.key === 'ArrowLeft') {
			prev();
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				next();
			} else {
				prev();
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKey);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKey);
	});
</script>

<svelte:head>
	{#if album}
		<title>{album.title} — AKSFPSA Gallery</title>
		<meta
			name="description"
			content={album.description || `${album.title} - Photo gallery from AKSFPSA`}
		/>
		<link rel="canonical" href="{SITE_CONFIG.BASE_URL}/gallery/{album.slug}" />
		<meta property="og:title" content="{album.title} — AKSFPSA Gallery" />
		<meta
			property="og:description"
			content={album.description || `${album.title} - Photo gallery from AKSFPSA`}
		/>
		<meta property="og:type" content="website" />
		<meta property="og:url" content="{SITE_CONFIG.BASE_URL}/gallery/{album.slug}" />
		{#if galleryScript}
			{@html galleryScript}
		{/if}
	{/if}
</svelte:head>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
		<a
			href="/gallery"
			class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
		>
			<ArrowLeft size={16} /> Back to Gallery
		</a>

		{#if album}
			<h1 class="mt-4 text-2xl font-semibold text-primary sm:text-4xl">{album.title}</h1>
			<div class="mt-2 flex flex-wrap items-center gap-3 text-sm">
				<span class="text-text-muted">{album.date}</span>
				<span class="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
					>{album.category}</span
				>
				<span class="text-text-muted">{album.images.length} photos</span>
			</div>
			{#if album.description}
				<p class="mt-4 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
					{album.description}
				</p>
			{/if}

			<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each album.images as img, i}
					<button
						onclick={() => openLightbox(i)}
						class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background transition hover:shadow-md"
					>
						<img
							src={img.src}
							alt={img.alt}
							class="h-full w-full object-cover transition group-hover:scale-105"
						/>
					</button>
				{/each}
			</div>
		{:else}
			<div class="mt-12 text-center text-text-muted">
				<p>Album not found.</p>
				<a href="/gallery" class="mt-2 inline-block text-primary hover:underline"
					>Browse all albums</a
				>
			</div>
		{/if}
	</div>
</section>

<!-- Lightbox -->
{#if lightboxOpen && album}
	<div
		class="fixed inset-0 z-50 flex flex-col bg-black/95"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onkeydown={handleKey}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		<!-- Top bar -->
		<div class="flex items-center justify-between px-4 py-3">
			<button onclick={closeLightbox} class="text-white/80 hover:text-white"><X size={24} /></button
			>
			<span class="text-sm text-white/70">{currentIndex + 1} / {album.images.length}</span>
			<div class="w-6"></div>
		</div>

		<!-- Image area -->
		<div class="flex flex-1 items-center justify-center px-4">
			<button
				onclick={prev}
				class="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white sm:left-4"
			>
				<ChevronLeft size={24} />
			</button>
			<img
				src={album.images[currentIndex].src}
				alt={album.images[currentIndex].alt}
				class="max-h-[70vh] max-w-full object-contain"
			/>
			<button
				onclick={next}
				class="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white sm:right-4"
			>
				<ChevronRight size={24} />
			</button>
		</div>

		<!-- Thumbnail strip -->
		<div class="flex items-center justify-center gap-2 overflow-x-auto px-4 py-3">
			{#each album.images as img, i}
				<button
					onclick={() => (currentIndex = i)}
					class="shrink-0 overflow-hidden rounded border-2 transition {i === currentIndex
						? 'border-white'
						: 'border-transparent opacity-50 hover:opacity-80'}"
				>
					<img src={img.src} alt={img.alt} class="h-12 w-16 object-cover" />
				</button>
			{/each}
		</div>
	</div>
{/if}
