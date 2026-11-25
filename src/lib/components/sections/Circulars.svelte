<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import type { Circular } from '$lib/stores/data';
	import { STRINGS } from '$lib/constants/strings';

	// - Maximum number of circulars displayed on the home page
	const HOME_CIRCULARS_LIMIT = 4;

	let circulars = $state<Circular[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const items = await list<Circular>('circulars');
			circulars = items.slice(0, HOME_CIRCULARS_LIMIT);
		} catch {
			circulars = [];
		} finally {
			loading = false;
		}
	});
</script>

<section class="bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<div class="max-w-3xl">
			<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
				Official Communications
			</p>

			<h2 class="text-3xl font-semibold text-primary lg:text-4xl">Latest Circulars & Notices</h2>

			<p class="mt-6 leading-relaxed text-text-muted">
				Access official announcements, administrative guidelines, and policy communications issued
				by the association.
			</p>
		</div>

		<div class="mt-16 overflow-hidden rounded-lg border border-border">
			{#if loading}
				<div class="p-8 text-center text-sm text-text-muted">Loading circulars...</div>
			{:else if circulars.length === 0}
				<div class="p-8 text-center text-sm text-text-muted">{STRINGS.CIRCULARS_EMPTY}</div>
			{:else}
				{#each circulars as circular, index}
					<a
						href={circular.file}
						target="_blank"
						rel="noopener noreferrer"
						class={`flex flex-col justify-between p-6 transition hover:bg-surface md:flex-row md:items-center ${
							index !== circulars.length - 1 ? 'border-b border-border' : ''
						}`}
					>
						<div class="space-y-2">
							<span class="text-xs tracking-wide text-text-muted uppercase">
								{circular.category}
							</span>

							<h3 class="text-lg font-semibold text-primary">
								{circular.title}
							</h3>

							<p class="text-sm text-text-muted">
								{circular.date}
							</p>
						</div>

						<span class="mt-4 text-sm font-medium tracking-wide text-primary uppercase md:mt-0">
							View PDF
						</span>
					</a>
				{/each}
			{/if}
		</div>

		<div class="mt-16">
			<a
				href="/circulars"
				class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
			>
				View All Circulars
			</a>
		</div>
	</div>
</section>
