<script lang="ts">
	type Circular = {
		id: number;
		title: string;
		date: string;
		category: string;
		file: string;
	};

	const circulars: Circular[] = [
		{
			id: 1,
			title: "Guidelines for Academic Year 2026–27",
			date: "12 January 2026",
			category: "Administrative",
			file: "/documents/circular1.pdf"
		},
		{
			id: 2,
			title: "District-Level Coordination Meeting Notice",
			date: "28 December 2025",
			category: "Meeting Notice",
			file: "/documents/circular2.pdf"
		},
		{
			id: 3,
			title: "Financial Partnership Update – Institutional Funding",
			date: "10 December 2025",
			category: "Finance",
			file: "/documents/circular3.pdf"
		},
		{
			id: 4,
			title: "Teacher Certification Program Announcement",
			date: "25 November 2025",
			category: "Training",
			file: "/documents/circular4.pdf"
		}
	];
</script>

<section class="bg-background">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="max-w-3xl">
			<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
				Official Communications
			</p>

			<h2 class="text-3xl lg:text-4xl font-semibold text-primary">
				Latest Circulars & Notices
			</h2>

			<p class="mt-6 text-text-muted leading-relaxed">
				Access official announcements, administrative guidelines, and policy communications issued by the association.
			</p>
		</div>

		<div class="mt-16 border border-border rounded-lg overflow-hidden">

			{#each circulars as circular, index}
				<a
					href={circular.file}
					target="_blank"
					rel="noopener noreferrer"
					class={`flex flex-col md:flex-row md:items-center justify-between p-6 transition hover:bg-surface ${
						index !== circulars.length - 1 ? "border-b border-border" : ""
					}`}
				>
					<div class="space-y-2">
						<span class="text-xs uppercase tracking-wide text-text-muted">
							{circular.category}
						</span>

						<h3 class="text-lg font-semibold text-primary">
							{circular.title}
						</h3>

						<p class="text-sm text-text-muted">
							{circular.date}
						</p>
					</div>

					<span class="mt-4 md:mt-0 text-sm font-medium text-primary uppercase tracking-wide">
						View PDF
					</span>
				</a>
			{/each}

		</div>

		<div class="mt-16">
			<a
				href="/circulars"
				class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
			>
				View All Circulars
			</a>
		</div>

	</div>
</section>
