<script lang="ts">
	import Reveal from "../utils/shared/Reveal.svelte";
    	type Course = {
		title: string;
		category: string;
		duration: string;
		description: string;
		link: string;
	};

	const courses: Course[] = [
		{
			title: "School Administration & Governance",
			category: "Administrative Program",
			duration: "6 Weeks",
			description:
				"Structured program focusing on institutional management, compliance frameworks, and operational leadership.",
			link: "/courses/school-governance"
		},
		{
			title: "Teacher Certification Program",
			category: "Professional Development",
			duration: "8 Weeks",
			description:
				"Certification initiative designed to enhance pedagogical skills and academic excellence.",
			link: "/courses/teacher-certification"
		},
		{
			title: "Financial Planning for Institutions",
			category: "Finance & Strategy",
			duration: "4 Weeks",
			description:
				"Comprehensive guidance on budgeting, financial compliance, and sustainable growth models.",
			link: "/courses/financial-planning"
		},
		{
			title: "Digital Infrastructure for Schools",
			category: "Technology",
			duration: "5 Weeks",
			description:
				"Program covering digital transformation, school management systems, and administrative automation.",
			link: "/courses/digital-infrastructure"
		}
	];

</script>
<Reveal>


<section class="bg-background">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="max-w-3xl">
			<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
				Academic & Professional Programs
			</p>

			<h2 class="text-3xl lg:text-4xl font-semibold text-primary">
				Certification & Development Courses
			</h2>

			<p class="mt-6 text-text-muted leading-relaxed">
				The association offers structured certification and institutional
				development programs designed to strengthen educational leadership and faculty excellence.
			</p>
		</div>

		<div class="mt-16 grid md:grid-cols-2 gap-10">

			{#each courses as course}
				<div class="border border-border rounded-lg p-8 bg-surface">

					<span class="text-xs uppercase tracking-wide text-text-muted">
						{course.category}
					</span>

					<h3 class="mt-3 text-xl font-semibold text-primary leading-tight">
						{course.title}
					</h3>

					<p class="mt-3 text-sm text-text-muted">
						Duration: {course.duration}
					</p>

					<p class="mt-5 text-text-muted text-sm leading-relaxed">
						{course.description}
					</p>

					<div class="mt-8">
						<a
							href={course.link}
							class="inline-block border border-primary text-primary px-6 py-2 rounded-md text-sm font-medium tracking-wide hover:bg-background transition"
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
				class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
			>
				View All Courses
			</a>
		</div>

	</div>
</section>

</Reveal>