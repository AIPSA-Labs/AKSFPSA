<script lang="ts">
	type Course = {
		id: number;
		title: string;
		category: string;
		duration: string;
		mode: string;
		description: string;
		link: string;
	};

	let selectedCategory = "";

	const categories = ["All", "Administrative", "Professional Development", "Finance", "Technology"];

	const courses: Course[] = [
		{
			id: 1,
			title: "School Administration & Governance",
			category: "Administrative",
			duration: "6 Weeks",
			mode: "Hybrid",
			description:
				"Structured program focusing on institutional governance, compliance frameworks, and leadership systems.",
			link: "/courses/school-governance"
		},
		{
			id: 2,
			title: "Teacher Certification Program",
			category: "Professional Development",
			duration: "8 Weeks",
			mode: "Offline",
			description:
				"Certification initiative designed to enhance pedagogical skills and academic excellence.",
			link: "/courses/teacher-certification"
		},
		{
			id: 3,
			title: "Financial Planning for Institutions",
			category: "Finance",
			duration: "4 Weeks",
			mode: "Online",
			description:
				"Guidance on budgeting, regulatory compliance, and sustainable institutional growth models.",
			link: "/courses/financial-planning"
		},
		{
			id: 4,
			title: "Digital Infrastructure for Schools",
			category: "Technology",
			duration: "5 Weeks",
			mode: "Hybrid",
			description:
				"Program covering digital transformation, administrative automation, and technology adoption.",
			link: "/courses/digital-infrastructure"
		}
	];

	$: filtered =
		selectedCategory === "" || selectedCategory === "All"
			? courses
			: courses.filter((c) => c.category === selectedCategory);
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
				<div class="border border-border rounded-lg p-8 bg-surface flex flex-col justify-between">

					<div>
						<span class="text-xs uppercase tracking-wide text-text-muted">
							{course.category}
						</span>

						<h2 class="mt-3 text-xl font-semibold text-primary leading-tight">
							{course.title}
						</h2>

						<p class="mt-3 text-sm text-text-muted">
							Duration: {course.duration} • Mode: {course.mode}
						</p>

						<p class="mt-6 text-text-muted text-sm leading-relaxed">
							{course.description}
						</p>
					</div>

					<div class="mt-8">
						<a
							href={course.link}
							class="inline-block border border-primary text-primary px-6 py-2 rounded-md text-sm font-medium tracking-wide hover:bg-background transition"
						>
							View Details
						</a>
					</div>

				</div>
			{/each}

		</div>

	</div>
</section>
