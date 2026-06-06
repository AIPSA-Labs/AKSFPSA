<script lang="ts">
	import { page } from '$app/stores';
	import { getStore, DEFAULT_BLOG_POSTS } from '$lib/stores/data';
	import type { BlogPost } from '$lib/stores/data';

	const posts: BlogPost[] = getStore('blog_posts', DEFAULT_BLOG_POSTS).filter((p) => p.status === 'published' && p.type === 'event');
	const event = posts.find((p) => p.slug === $page.params.slug);

	if (!event) {
		throw new Error('Event not found');
	}
</script>

<svelte:head>
	<title>{event.title} — AKSFPSA Events</title>
	<meta name="description" content={event.excerpt} />
</svelte:head>

<section class="bg-background min-h-screen">
	<div class="max-w-3xl mx-auto px-6 lg:px-8 py-20">
		<a href="/events" class="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-8">← Back to Events</a>

		<article>
			<div class="flex flex-wrap gap-2 mb-4">
				{#each event.tags as tag}
					<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{tag}</span>
				{/each}
			</div>

			<h1 class="text-3xl font-semibold text-primary leading-tight">{event.title}</h1>

			<div class="mt-4 flex items-center gap-4 text-sm text-text-muted">
				<span>{event.date}</span>
				<span>•</span>
				<span>{event.author}</span>
			</div>

			{#if event.cover}
				<div class="mt-8 rounded-xl overflow-hidden">
					<img src={event.cover} alt={event.title} class="w-full h-64 object-cover" />
				</div>
			{/if}

			<div class="mt-8 prose-content">
				{@html event.content}
			</div>
		</article>

		<div class="mt-12">
			<a
				href="/contact"
				class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
			>
				Register / Enquire
			</a>
		</div>

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
