<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getStore, DEFAULT_ALBUMS, DEFAULT_GALLERY_CATEGORIES } from '$lib/stores/data';
	import { Image as ImageIcon } from '@lucide/svelte';

	let albums = $state<(typeof DEFAULT_ALBUMS[number])[]>([]);
	let categories = $state<string[]>([]);
	let search = $state('');
	let catFilter = $state('All');

	onMount(() => {
		if (!browser) return;
		albums = getStore('albums', DEFAULT_ALBUMS);
		categories = getStore('gallery_categories', DEFAULT_GALLERY_CATEGORIES);
	});

	const filtered = $derived(
		albums.filter((a) => {
			if (catFilter !== 'All' && a.category !== catFilter) return false;
			return a.title.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">Gallery</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			A visual archive of official meetings, training programs, conferences,
			and statewide initiatives conducted by the association.
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-3">
			<input type="text" placeholder="Search albums..." bind:value={search}
				class="w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
			<div class="flex flex-wrap gap-1">
				<button onclick={() => catFilter = 'All'} class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === 'All' ? 'bg-primary text-white' : 'border border-border text-text-muted hover:bg-surface'}">All</button>
				{#each categories as cat}
					<button onclick={() => catFilter = cat} class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === cat ? 'bg-primary text-white' : 'border border-border text-text-muted hover:bg-surface'}">{cat}</button>
				{/each}
			</div>
		</div>

		<div class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
			{#each filtered as album (album.id)}
				<div class="border border-border rounded-lg overflow-hidden bg-surface flex flex-col">
					<div class="h-56 flex items-center justify-center overflow-hidden bg-background">
						{#if album.cover}
							<img src={album.cover} alt={album.title} class="w-full h-full object-cover" />
						{:else}
							<ImageIcon size={48} class="text-text-muted/40" />
						{/if}
					</div>
					<div class="p-6 flex flex-col justify-between flex-1">
						<div>
							<h2 class="text-lg font-semibold text-primary leading-tight">{album.title}</h2>
							<p class="mt-2 text-sm text-text-muted">{album.date}</p>
							<div class="mt-2 flex items-center gap-2">
								<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{album.category}</span>
								<span class="text-xs text-text-muted">{album.images.length} photos</span>
							</div>
							<p class="mt-3 text-sm text-text-muted leading-relaxed line-clamp-2">{album.description}</p>
						</div>
						<div class="mt-6">
							<a href={`/gallery/${album.slug}`}
								class="inline-block border border-primary text-primary px-6 py-2 rounded-md text-sm font-medium tracking-wide hover:bg-background transition">
								View Album
							</a>
						</div>
					</div>
				</div>
			{/each}
			{#if filtered.length === 0}
				<div class="md:col-span-2 lg:col-span-3 py-16 text-center text-text-muted">No albums found</div>
			{/if}
		</div>

	</div>
</section>
