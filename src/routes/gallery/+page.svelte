<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import type { GalleryAlbum } from '$lib/stores/data';
	import { Image as ImageIcon } from '@lucide/svelte';

	let albums = $state<GalleryAlbum[]>([]);
	let categories = $state<string[]>([]);
	let search = $state('');
	let catFilter = $state('All');

	onMount(async () => {
		try {
			const [albumList, catList] = await Promise.all([
				list<GalleryAlbum>('gallery'),
				list<{ id: number; name: string }>('gallery-categories')
			]);
			albums = albumList;
			categories = catList.map((c) => c.name).sort((a, b) => a.localeCompare(b));
		} catch {
			albums = [];
			categories = [];
		}
	});

	const filtered = $derived(
		albums.filter((a) => {
			if (catFilter !== 'All' && a.category !== catFilter) return false;
			return a.title.toLowerCase().includes(search.toLowerCase());
		})
	);
</script>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<h1 class="text-4xl font-semibold text-primary">Gallery</h1>

		<p class="mt-6 max-w-3xl text-text-muted">
			A visual archive of official meetings, training programs, conferences, and statewide
			initiatives conducted by the association.
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-3">
			<input
				type="text"
				placeholder="Search albums..."
				bind:value={search}
				class="w-full max-w-sm rounded-lg border border-border bg-surface px-4 py-2.5 text-sm transition outline-none focus:border-primary"
			/>
			<div class="flex flex-wrap gap-1">
				<button
					onclick={() => (catFilter = 'All')}
					class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === 'All'
						? 'bg-primary text-white'
						: 'border border-border text-text-muted hover:bg-surface'}">All</button
				>
				{#each categories as cat}
					<button
						onclick={() => (catFilter = cat)}
						class="rounded-lg px-3 py-1.5 text-xs font-medium transition {catFilter === cat
							? 'bg-primary text-white'
							: 'border border-border text-text-muted hover:bg-surface'}">{cat}</button
					>
				{/each}
			</div>
		</div>

		<div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
			{#each filtered as album (album.id)}
				<div class="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
					<div class="flex h-56 items-center justify-center overflow-hidden bg-background">
						{#if album.cover}
							<img
								src={album.cover}
								alt={album.title}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
						{:else}
							<ImageIcon size={48} class="text-text-muted/40" />
						{/if}
					</div>
					<div class="flex flex-1 flex-col justify-between p-6">
						<div>
							<h2 class="text-lg leading-tight font-semibold text-primary">{album.title}</h2>
							<p class="mt-2 text-sm text-text-muted">{album.date}</p>
							<div class="mt-2 flex items-center gap-2">
								<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
									>{album.category}</span
								>
								<span class="text-xs text-text-muted">{album.images.length} photos</span>
							</div>
							<p class="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
								{album.description}
							</p>
						</div>
						<div class="mt-6">
							<a
								href={`/gallery/${album.slug}`}
								class="inline-block rounded-md border border-primary px-6 py-2 text-sm font-medium tracking-wide text-primary transition hover:bg-background"
							>
								View Album
							</a>
						</div>
					</div>
				</div>
			{/each}
			{#if filtered.length === 0}
				<div class="py-16 text-center text-text-muted md:col-span-2 lg:col-span-3">
					No albums found
				</div>
			{/if}
		</div>
	</div>
</section>
