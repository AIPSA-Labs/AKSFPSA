<script lang="ts">
	import { onMount } from 'svelte';
	import Reveal from '../utils/shared/Reveal.svelte';
	import { list } from '$lib/stores/api';
	import type { Course } from '$lib/stores/data';
	import { STRINGS } from '$lib/constants/strings';

	// - Maximum number of courses displayed on the home page
	const HOME_COURSES_LIMIT = 4;

	let courses = $state<Course[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const items = await list<Course>('courses');
			courses = items.slice(0, HOME_COURSES_LIMIT);
		} catch {
			courses = [];
		} finally {
			loading = false;
		}
	});
</script>

<Reveal>
	<section class="bg-background">
		<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
			<div class="max-w-3xl">
				<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
					Academic & Professional Programs
				</p>

				<h2 class="text-3xl font-semibold text-primary lg:text-4xl">
					Certification & Development Courses
				</h2>

				<p class="mt-6 leading-relaxed text-text-muted">
					The association offers structured certification and institutional development programs
					designed to strengthen educational leadership and faculty excellence.
				</p>
			</div>

			{#if loading}
				<div class="mt-16 text-center text-sm text-text-muted">Loading courses...</div>
			{:else if courses.length === 0}
				<div class="mt-16 text-center text-sm text-text-muted">{STRINGS.COURSES_EMPTY}</div>
			{:else}
				<div class="mt-16 grid gap-10 md:grid-cols-2">
					{#each courses as course}
						<div class="rounded-lg border border-border bg-surface p-8">
							<span class="text-xs tracking-wide text-text-muted uppercase">
								{course.category}
							</span>

							<h3 class="mt-3 text-xl leading-tight font-semibold text-primary">
								{course.title}
							</h3>

							<p class="mt-3 text-sm text-text-muted">
								Duration: {course.duration}
							</p>

							<p class="mt-5 text-sm leading-relaxed text-text-muted">
								{course.description}
							</p>

							<div class="mt-8">
								<a
									href={course.link || `/courses/${course.id}`}
									class="inline-block rounded-md border border-primary px-6 py-2 text-sm font-medium tracking-wide text-primary transition hover:bg-background"
								>
									Learn More
								</a>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="mt-16">
				<a
					href="/courses"
					class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
				>
					View All Courses
				</a>
			</div>
		</div>
	</section>
</Reveal>
