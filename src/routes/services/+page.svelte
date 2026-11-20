<script lang="ts">
	import { onMount } from 'svelte';
	import { list } from '$lib/stores/api';
	import ContentCard from '$lib/components/shared/ContentCard.svelte';
	import TeacherInitiativesCTA from '$lib/components/sections/TeacherInitiativesCTA.svelte';
	import MontvillePreSchoolCTA from '$lib/components/sections/MontvillePreSchoolCTA.svelte';
	import LegalServiceCTA from '$lib/components/sections/LegalServiceCTA.svelte';
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

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<h1 class="text-4xl font-semibold text-primary">Our Services</h1>
		<p class="mt-6 max-w-3xl text-text-muted">
			AKSFPSA offers a wide range of services for member schools, teachers, and students — from
			coaching and training to digital schooling and scholarship programs.
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

	<TeacherInitiativesCTA />
	<MontvillePreSchoolCTA />
	<LegalServiceCTA />
</section>
