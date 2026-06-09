<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import ContentCard from '$lib/components/shared/ContentCard.svelte';
	import type { Service } from '$lib/stores/data';

	let services = $state<Service[]>([]);

	onMount(async () => {
		services = await list<Service>('services');
	});

	const iconMap: Record<string, string> = {
		GraduationCap: '🎓',
		Monitor: '💻',
		BookOpen: '📖',
		Globe: '🌐',
		School: '🏫',
		Award: '🏆'
	};
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">
		<h1 class="text-4xl font-semibold text-primary">Our Services</h1>
		<p class="mt-6 text-text-muted max-w-3xl">
			AKSFPSA offers a wide range of services for member schools, teachers, and students —
			from coaching and training to digital schooling and scholarship programs.
		</p>

		<div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service}
				<ContentCard
					title={`${iconMap[service.icon] || '📋'} ${service.title}`}
					excerpt={service.description}
					content={service.content || ''}
				/>
			{/each}
		</div>
	</div>
</section>
