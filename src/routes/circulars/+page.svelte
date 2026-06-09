<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import ContentCard from '$lib/components/shared/ContentCard.svelte';

	type Circular = {
		id: number;
		title: string;
		date: string;
		category: string;
		file: string;
		content?: string;
	};

	let search = $state("");
	let categoryFilter = $state("");

	const categories = ["All", "Administrative", "Meeting Notice", "Finance", "Training"];

	let circulars = $state<Circular[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			circulars = await list<Circular>('circulars');
		} catch { /* keep empty */ } finally { loading = false; }
	});

	const filtered = $derived(circulars.filter((c) => {
		const matchesSearch =
			c.title.toLowerCase().includes(search.toLowerCase());

		const matchesCategory =
			categoryFilter === "" ||
			categoryFilter === "All" ||
			c.category === categoryFilter;

		return matchesSearch && matchesCategory;
	}));
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Circulars & Official Notices
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			Access archived circulars, official communications, and administrative updates issued by the association.
		</p>

		<div class="mt-12 flex flex-col md:flex-row gap-6">

			<input
				type="text"
				placeholder="Search circulars..."
				class="w-full md:w-1/2 border border-border rounded-md px-4 py-3 bg-surface"
				bind:value={search}
			/>

			<select
				class="w-full md:w-1/3 border border-border rounded-md px-4 py-3 bg-surface"
				bind:value={categoryFilter}
			>
				<option value="">All Categories</option>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>

		</div>

		<div class="mt-12 space-y-4">
			{#if filtered.length === 0}
				<div class="p-10 text-text-muted text-center">
					No circulars found.
				</div>
			{:else}
				{#each filtered as circular}
					<ContentCard
						title={circular.title}
						excerpt={circular.date}
						content={circular.content || ''}
						category={circular.category}
						ctaLabel="View PDF"
						ctaHref={circular.file}
					/>
				{/each}
			{/if}
		</div>

	</div>
</section>
