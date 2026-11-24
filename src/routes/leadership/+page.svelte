<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import type { Leader } from '$lib/stores/data';

	let officeBearers = $state<Leader[]>([]);
	let committeeMembers = $state<Leader[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const items = await list<Leader>('leaders');
			officeBearers = items.filter((l) => l.group === 'office-bearers');
			committeeMembers = items.filter((l) => l.group === 'executive-members');
		} catch {
			/* keep empty */
		} finally {
			loading = false;
		}
	});
</script>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<h1 class="text-4xl font-semibold text-primary">Executive Committee</h1>

		<p class="mt-6 max-w-3xl leading-relaxed text-text-muted">
			The association is governed by a structured executive committee representing institutions
			across districts in Kerala. The leadership ensures coordinated policy alignment and statewide
			representation.
		</p>

		<div class="mt-20">
			<h2 class="text-2xl font-semibold text-primary">Office Bearers</h2>

			<div class="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
				{#each officeBearers as member}
					<div class="text-center">
						<div
							class="mx-auto h-40 w-40 overflow-hidden rounded-full border border-border bg-surface"
						>
							<img
								src={member.image}
								alt={member.name}
								width="160"
								height="160"
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
						</div>

						<h3 class="mt-6 text-lg font-semibold text-primary">
							{member.name}
						</h3>

						<p class="mt-2 text-sm tracking-wide text-text-muted uppercase">
							{member.role}
						</p>

						{#if member.district}
							<p class="mt-1 text-xs text-text-muted">
								{member.district}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-24">
			<h2 class="text-2xl font-semibold text-primary">Executive Members</h2>

			<div class="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
				{#each committeeMembers as member}
					<div class="text-center">
						<div
							class="mx-auto h-32 w-32 overflow-hidden rounded-full border border-border bg-surface"
						>
							<img
								src={member.image}
								alt={member.name}
								width="128"
								height="128"
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
						</div>

						<h3 class="mt-5 text-base font-semibold text-primary">
							{member.name}
						</h3>

						<p class="mt-2 text-xs tracking-wide text-text-muted uppercase">
							{member.role}
						</p>

						{#if member.district}
							<p class="mt-1 text-xs text-text-muted">
								{member.district}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
