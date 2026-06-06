<script lang="ts">
	import { getStore, DEFAULT_BLOG_POSTS } from '$lib/stores/data';
	import type { BlogPost } from '$lib/stores/data';

	const events: BlogPost[] = getStore('blog_posts', DEFAULT_BLOG_POSTS)
		.filter((p) => p.status === 'published' && p.type === 'event')
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
		events.filter(
			(e) =>
				e.title.toLowerCase().includes(search.toLowerCase()) ||
				e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
		)
	);
</script>

<svelte:head>
	<title>Events — AKSFPSA</title>
	<meta name="description" content="Official events, conferences, workshops, and statewide meetings conducted by the association." />
</svelte:head>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Events & Programs
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			Official events, conferences, workshops, and statewide meetings conducted by the association.
		</p>

		<div class="mt-8">
			<input
				type="text"
				placeholder="Search events..."
				bind:value={search}
				class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition focus:border-primary"
			/>
		</div>

		<div class="mt-10 border border-border rounded-lg overflow-hidden">

			{#each filtered as event, index}
				<a
					href={`/events/${event.slug}`}
					class={`flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-surface transition ${
						index !== filtered.length - 1 ? "border-b border-border" : ""
					}`}
				>
					<div>
						<span class="text-xs uppercase tracking-wide text-text-muted">
							{event.tags[0] || ''}
						</span>

						<h2 class="mt-2 text-xl font-semibold text-primary">
							{event.title}
						</h2>

						<p class="mt-2 text-sm text-text-muted">
							{event.date}
						</p>

						<p class="mt-4 text-sm text-text-muted leading-relaxed">
							{event.excerpt}
						</p>
					</div>

					<span class="mt-6 md:mt-0 text-sm font-medium text-primary uppercase tracking-wide">
						View Details →
					</span>
				</a>
			{/each}

			{#if filtered.length === 0}
				<div class="py-16 text-center text-text-muted">
					{events.length === 0 ? 'No events scheduled yet. Check back soon!' : 'No events match your search.'}
				</div>
			{/if}

		</div>

	</div>
</section>
