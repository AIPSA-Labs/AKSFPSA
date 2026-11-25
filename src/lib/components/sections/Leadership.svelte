<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import type { Leader } from '$lib/stores/data';
	import { STRINGS } from '$lib/constants/strings';

	// - Maximum number of leaders displayed on the home page
	const HOME_LEADERS_LIMIT = 4;

	let leaders = $state<Leader[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const items = await list<Leader>('leaders');
			const officeBearers = items.filter((l) => l.group === 'office-bearers');
			const pool = officeBearers.length > 0 ? officeBearers : items;
			leaders = pool.slice(0, HOME_LEADERS_LIMIT);
		} catch {
			leaders = [];
		} finally {
			loading = false;
		}
	});

	function getInitials(name: string): string {
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() || '')
			.join('');
	}
</script>

<section class="bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<div class="max-w-3xl">
			<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">Leadership</p>

			<h2 class="text-3xl font-semibold text-primary lg:text-4xl">Executive Committee</h2>

			<p class="mt-6 leading-relaxed text-text-muted">
				The association is guided by experienced educational leaders representing institutions
				across Kerala.
			</p>
		</div>

		{#if loading}
			<div class="mt-16 text-center text-sm text-text-muted">Loading leadership...</div>
		{:else if leaders.length === 0}
			<div class="mt-16 text-center text-sm text-text-muted">{STRINGS.LEADERS_EMPTY}</div>
		{:else}
			<div class="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
				{#each leaders as leader}
					<div class="text-center">
						<div
							class="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-border bg-surface"
						>
							{#if leader.image}
								<img
									src={leader.image}
									alt={leader.name}
									width="144"
									height="144"
									loading="lazy"
									decoding="async"
									class="h-full w-full object-cover"
								/>
							{:else}
								<span class="text-2xl font-semibold text-primary">{getInitials(leader.name)}</span>
							{/if}
						</div>

						<h3 class="mt-6 text-lg font-semibold text-primary">
							{leader.name}
						</h3>

						<p class="mt-2 text-sm tracking-wide text-text-muted uppercase">
							{leader.role}
						</p>

						{#if leader.district}
							<p class="mt-1 text-xs text-text-muted">
								{leader.district}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-16">
			<a
				href="/leadership"
				class="inline-block rounded-md border border-primary px-8 py-3 font-medium tracking-wide text-primary transition hover:bg-surface"
			>
				View Full Committee
			</a>
		</div>
	</div>
</section>
