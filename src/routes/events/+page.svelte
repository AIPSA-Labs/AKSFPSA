<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import type { BlogPost } from '$lib/stores/data';

	let events = $state<BlogPost[]>([]);
	let search = $state('');

	onMount(async () => {
		const posts = await list<BlogPost>('blog');
		events = posts
			.filter((p) => p.status === 'published' && p.type === 'event')
			.sort((a, b) => {
				const months = [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				];
				const da = a.date.split(' ');
				const db = b.date.split(' ');
				const na = months.indexOf(da[1]) * 100 + parseInt(da[0]);
				const nb = months.indexOf(db[1]) * 100 + parseInt(db[0]);
				return nb - na;
			});
	});

	const filtered = $derived(
		events.filter(
			(e) =>
				e.title.toLowerCase().includes(search.toLowerCase()) ||
				e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
		)
	);
</script>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-6xl px-6 py-20 lg:px-8">
		<h1 class="text-4xl font-semibold text-primary">Events & Programs</h1>

		<p class="mt-6 max-w-3xl text-text-muted">
			Official events, conferences, workshops, and statewide meetings conducted by the association.
		</p>

		<div class="mt-8">
			<input
				type="text"
				placeholder="Search events..."
				bind:value={search}
				class="w-full max-w-md rounded-lg border border-border bg-surface px-4 py-2.5 text-sm transition outline-none focus:border-primary"
			/>
		</div>

		<div class="mt-10 overflow-hidden rounded-lg border border-border">
			{#each filtered as event, index}
				<a
					href={`/events/${event.slug}`}
					class={`flex flex-col justify-between p-8 transition hover:bg-surface md:flex-row md:items-center ${
						index !== filtered.length - 1 ? 'border-b border-border' : ''
					}`}
				>
					<div>
						<span class="text-xs tracking-wide text-text-muted uppercase">
							{event.tags[0] || ''}
						</span>

						<h2 class="mt-2 text-xl font-semibold text-primary">
							{event.title}
						</h2>

						<p class="mt-2 text-sm text-text-muted">
							{event.date}
						</p>

						<p class="mt-4 text-sm leading-relaxed text-text-muted">
							{event.excerpt}
						</p>
					</div>

					<span class="mt-6 text-sm font-medium tracking-wide text-primary uppercase md:mt-0">
						View Details →
					</span>
				</a>
			{/each}

			{#if filtered.length === 0}
				<div class="py-16 text-center text-text-muted">
					{events.length === 0
						? 'No events scheduled yet. Check back soon!'
						: 'No events match your search.'}
				</div>
			{/if}
		</div>
	</div>
</section>
