<script lang="ts">
	import Reveal from '../utils/shared/Reveal.svelte';
	type Course = {
		title: string;
		category: string;
		duration: string;
		description: string;
		link: string;
	};

	const courses: Course[] = [
		{
			title: 'School Administration & Governance',
			category: 'Administrative Program',
			duration: '6 Weeks',
			description:
				'Structured program focusing on institutional management, compliance frameworks, and operational leadership.',
			link: '/courses/school-governance'
		},
		{
			title: 'Teacher Certification Program',
			category: 'Professional Development',
			duration: '8 Weeks',
			description:
				'Certification initiative designed to enhance pedagogical skills and academic excellence.',
			link: '/courses/teacher-certification'
		},
		{
			title: 'Financial Planning for Institutions',
			category: 'Finance & Strategy',
			duration: '4 Weeks',
			description:
				'Comprehensive guidance on budgeting, financial compliance, and sustainable growth models.',
			link: '/courses/financial-planning'
		},
		{
			title: 'Digital Infrastructure for Schools',
			category: 'Technology',
			duration: '5 Weeks',
			description:
				'Program covering digital transformation, school management systems, and administrative automation.',
			link: '/courses/digital-infrastructure'
		}
	];
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
								href={course.link}
								class="inline-block rounded-md border border-primary px-6 py-2 text-sm font-medium tracking-wide text-primary transition hover:bg-background"
							>
								Learn More
							</a>
						</div>
					</div>
				{/each}
			</div>

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
