<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import ContentCard from '$lib/components/shared/ContentCard.svelte';

	type Course = {
		id: number;
		title: string;
		category: string;
		duration: string;
		mode: string;
		description: string;
		link: string;
		content?: string;
	};

	let selectedCategory = $state("");

	const categories = ["All", "Administrative", "Professional Development", "Finance", "Technology"];

	let courses = $state<Course[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			courses = await list<Course>('courses');
		} catch { /* keep empty */ } finally { loading = false; }
	});

	const filtered = $derived(
		selectedCategory === "" || selectedCategory === "All"
			? courses
			: courses.filter((c) => c.category === selectedCategory)
	);
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Certification & Development Programs
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			The association offers structured academic and professional programs designed
			to strengthen institutional leadership, financial planning, and faculty development.
		</p>

		<div class="mt-12">
			<select
				class="border border-border rounded-md px-4 py-3 bg-surface"
				bind:value={selectedCategory}
			>
				<option value="">All Categories</option>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>

		<div class="mt-12 grid md:grid-cols-2 gap-10">
			{#each filtered as course}
				<ContentCard
					title={course.title}
					excerpt="{course.description}\nDuration: {course.duration} • Mode: {course.mode}"
					content={course.content || ''}
					ctaLabel="View Details"
					ctaHref={course.link}
					category={course.category}
				/>
			{/each}
		</div>

	</div>
</section>
