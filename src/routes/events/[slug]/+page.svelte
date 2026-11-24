<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { list } from '$lib/stores/api';
	import type { BlogPost } from '$lib/stores/data';
	import { SITE_CONFIG } from '$lib/constants/strings';

	let { data } = $props();
	let clientEvent = $state<BlogPost | null>(null);
	let event = $derived<BlogPost | null>(data?.event ?? clientEvent);

	const eventSchema = $derived(
		event
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Event',
					name: event.title,
					description: event.excerpt,
					startDate: event.date,
					eventStatus: 'https://schema.org/EventScheduled',
					eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
					location: {
						'@type': 'Place',
						name: 'Kerala, India',
						address: {
							'@type': 'PostalAddress',
							addressRegion: 'Kerala',
							addressCountry: 'IN'
						}
					},
					organizer: {
						'@type': 'EducationalOrganization',
						name: SITE_CONFIG.SITE_NAME,
						url: SITE_CONFIG.BASE_URL
					},
					image: event.cover
						? event.cover.startsWith('http')
							? event.cover
							: `${SITE_CONFIG.BASE_URL}${event.cover}`
						: `${SITE_CONFIG.BASE_URL}/logo.png`
				})
			: ''
	);

	const eventScript = $derived(
		eventSchema ? `<script type="application/ld+json">${eventSchema}</` + `script>` : ''
	);

	onMount(async () => {
		if (!event) {
			const posts = await list<BlogPost>('blog');
			clientEvent =
				posts.find(
					(p) => p.status === 'published' && p.type === 'event' && p.slug === $page.params.slug
				) ?? null;
		}
	});
</script>

<svelte:head>
	{#if event}
		<title>{event.title} — AKSFPSA Events</title>
		<meta name="description" content={event.excerpt} />
		<link rel="canonical" href="{SITE_CONFIG.BASE_URL}/events/{event.slug}" />
		<meta property="og:title" content="{event.title} — AKSFPSA Events" />
		<meta property="og:description" content={event.excerpt} />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="{SITE_CONFIG.BASE_URL}/events/{event.slug}" />
		{#if event.cover}
			<meta
				property="og:image"
				content={event.cover.startsWith('http')
					? event.cover
					: `${SITE_CONFIG.BASE_URL}${event.cover}`}
			/>
		{/if}
		{#if eventScript}
			{@html eventScript}
		{/if}
	{/if}
</svelte:head>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-3xl px-6 py-20 lg:px-8">
		<a
			href="/events"
			class="mb-8 inline-flex items-center gap-1 text-sm text-primary hover:underline"
			>← Back to Events</a
		>

		{#if event}
			<article>
				<div class="mb-4 flex flex-wrap gap-2">
					{#each event.tags as tag}
						<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
							>{tag}</span
						>
					{/each}
				</div>

				<h1 class="text-3xl leading-tight font-semibold text-primary">{event.title}</h1>

				<div class="mt-4 flex items-center gap-4 text-sm text-text-muted">
					<span>{event.date}</span>
					<span>•</span>
					<span>{event.author}</span>
				</div>

				{#if event.cover}
					<div class="mt-8 overflow-hidden rounded-xl">
						<img src={event.cover} alt={event.title} class="h-64 w-full object-cover" />
					</div>
				{/if}

				<div class="prose-content mt-8">
					{@html event.content}
				</div>
			</article>

			<div class="mt-12">
				<a
					href="/contact"
					class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
				>
					Register / Enquire
				</a>
			</div>
		{:else}
			<div class="mt-12 text-center text-text-muted">
				<p>Event not found.</p>
				<a href="/events" class="mt-2 inline-block text-primary hover:underline"
					>Browse all events</a
				>
			</div>
		{/if}
	</div>
</section>

<style>
	:global(.prose-content h2) {
		font-size: 1.375rem;
		font-weight: 600;
		color: var(--color-text);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}
	:global(.prose-content h3) {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--color-text);
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose-content p) {
		color: var(--color-text-muted);
		line-height: 1.8;
		margin-bottom: 1rem;
	}
	:global(.prose-content ul),
	:global(.prose-content ol) {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
		color: var(--color-text-muted);
	}
	:global(.prose-content li) {
		margin-bottom: 0.375rem;
	}
	:global(.prose-content blockquote) {
		border-left: 3px solid var(--color-primary);
		padding-left: 1rem;
		margin: 1rem 0;
		font-style: italic;
		color: var(--color-text-muted);
	}
	:global(.prose-content pre) {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}
	:global(.prose-content code) {
		background: var(--color-surface);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}
	:global(.prose-content hr) {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: 2rem 0;
	}
	:global(.prose-content a) {
		color: var(--color-primary);
		text-decoration: underline;
	}
</style>
