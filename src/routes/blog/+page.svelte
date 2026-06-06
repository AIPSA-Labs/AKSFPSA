<script lang="ts">
	import { page } from '$app/stores';
	import { getStore, DEFAULT_BLOG_POSTS } from '$lib/stores/data';
	import type { BlogPost } from '$lib/stores/data';

	const posts: BlogPost[] = getStore('blog_posts', DEFAULT_BLOG_POSTS)
		.filter((p) => p.status === 'published' && p.type === 'post')
		.sort((a, b) => {
			const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
			const da = a.date.split(' ');
			const db = b.date.split(' ');
			const na = months.indexOf(da[1]) * 100 + parseInt(da[0]);
			const nb = months.indexOf(db[1]) * 100 + parseInt(db[0]);
			return nb - na;
		});

	let search = $state('');

	const filtered = $derived(
		posts.filter(
			(p) =>
				p.title.toLowerCase().includes(search.toLowerCase()) ||
				p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
		)
	);
</script>

<svelte:head>
	<title>Blog — AKSFPSA</title>
	<meta name="description" content="Latest news, announcements, and articles from the All Kerala Self Financing Private Schools Association." />
</svelte:head>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">
		<h1 class="text-4xl font-semibold text-primary">Blog & Updates</h1>
		<p class="mt-4 text-text-muted max-w-3xl">
			Latest news, announcements, and articles from the association.
		</p>

		<div class="mt-8">
			<input
				type="text"
				placeholder="Search posts..."
				bind:value={search}
				class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary"
			/>
		</div>

		<div class="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each filtered as post}
				<article class="flex flex-col rounded-xl border border-border bg-surface overflow-hidden transition hover:shadow-md">
					{#if post.cover}
						<div class="h-48 overflow-hidden">
							<img src={post.cover} alt={post.title} class="h-full w-full object-cover" />
						</div>
					{/if}
					<div class="flex flex-1 flex-col p-6">
						<div class="flex flex-wrap gap-2 mb-3">
							{#each post.tags as tag}
								<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{tag}</span>
							{/each}
						</div>
						<h2 class="text-lg font-semibold text-primary leading-tight">
							<a href="/blog/{post.slug}" class="hover:underline">{post.title}</a>
						</h2>
						<p class="mt-2 text-sm text-text-muted line-clamp-3">{post.excerpt}</p>
						<div class="mt-auto pt-4 flex items-center justify-between text-xs text-text-muted">
							<span>{post.date}</span>
							<span>{post.author}</span>
						</div>
					</div>
				</article>
			{/each}
			{#if filtered.length === 0}
				<div class="col-span-full py-16 text-center text-text-muted">
					{posts.length === 0 ? 'No posts published yet. Check back soon!' : 'No posts match your search.'}
				</div>
			{/if}
		</div>
	</div>
</section>
