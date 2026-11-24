<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { list } from '$lib/stores/api';
	import type { BlogPost } from '$lib/stores/data';
	import { SITE_CONFIG } from '$lib/constants/strings';

	let post = $state<BlogPost | null>(null);

	const blogPostingSchema = $derived(
		post
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: post.title,
					description: post.excerpt,
					datePublished: post.date,
					author: {
						'@type': 'Person',
						name: post.author || SITE_CONFIG.SITE_NAME
					},
					publisher: {
						'@type': 'EducationalOrganization',
						name: SITE_CONFIG.SITE_NAME,
						logo: {
							'@type': 'ImageObject',
							url: `${SITE_CONFIG.BASE_URL}/logo.png`
						}
					},
					image: post.cover
						? post.cover.startsWith('http')
							? post.cover
							: `${SITE_CONFIG.BASE_URL}${post.cover}`
						: `${SITE_CONFIG.BASE_URL}/logo.png`,
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': `${SITE_CONFIG.BASE_URL}/blog/${post.slug}`
					}
				})
			: ''
	);

	const blogPostingScript = $derived(
		blogPostingSchema ? `<script type="application/ld+json">${blogPostingSchema}</` + `script>` : ''
	);

	onMount(async () => {
		const posts = await list<BlogPost>('blog');
		post = posts.find((p) => p.status === 'published' && p.slug === $page.params.slug) ?? null;
	});
</script>

<svelte:head>
	{#if post}
		<title>{post.title} — AKSFPSA</title>
		<meta name="description" content={post.excerpt} />
		<link rel="canonical" href="{SITE_CONFIG.BASE_URL}/blog/{post.slug}" />
		<meta property="og:title" content="{post.title} — AKSFPSA" />
		<meta property="og:description" content={post.excerpt} />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="{SITE_CONFIG.BASE_URL}/blog/{post.slug}" />
		{#if post.cover}
			<meta
				property="og:image"
				content={post.cover.startsWith('http')
					? post.cover
					: `${SITE_CONFIG.BASE_URL}${post.cover}`}
			/>
		{/if}
		{#if blogPostingScript}
			{@html blogPostingScript}
		{/if}
	{/if}
</svelte:head>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-3xl px-6 py-20 lg:px-8">
		<a href="/blog" class="mb-8 inline-flex items-center gap-1 text-sm text-primary hover:underline"
			>← Back to Blog</a
		>

		{#if post}
			<article>
				<div class="mb-4 flex flex-wrap gap-2">
					{#each post.tags as tag}
						<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
							>{tag}</span
						>
					{/each}
				</div>

				<h1 class="text-3xl leading-tight font-semibold text-primary">{post.title}</h1>

				<div class="mt-4 flex items-center gap-4 text-sm text-text-muted">
					<span>{post.date}</span>
					<span>•</span>
					<span>{post.author}</span>
				</div>

				{#if post.cover}
					<div class="mt-8 overflow-hidden rounded-xl">
						<img src={post.cover} alt={post.title} class="h-64 w-full object-cover" />
					</div>
				{/if}

				<div class="prose-content mt-8">
					{@html post.content}
				</div>
			</article>
		{:else}
			<div class="mt-12 text-center text-text-muted">
				<p>Post not found.</p>
				<a href="/blog" class="mt-2 inline-block text-primary hover:underline">Browse all posts</a>
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
