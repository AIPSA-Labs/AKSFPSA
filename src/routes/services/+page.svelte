<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getStore, DEFAULT_SERVICES } from '$lib/stores/data';
	import type { Service } from '$lib/stores/data';

	let services = $state<Service[]>([]);

	onMount(() => {
		if (!browser) return;
		services = getStore('services', DEFAULT_SERVICES);
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
				<div class="rounded-xl border border-border bg-surface p-8 transition hover:shadow-md">
					<div class="text-4xl">{iconMap[service.icon] || '📋'}</div>
					<h2 class="mt-4 text-xl font-semibold text-primary">{service.title}</h2>
					<p class="mt-3 text-sm text-text-muted leading-relaxed">{service.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
