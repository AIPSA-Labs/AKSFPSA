<script lang="ts">
	type Circular = {
		id: number;
		title: string;
		date: string;
		category: string;
		file: string;
	};

	let search = "";
	let categoryFilter = "";

	const categories = ["All", "Administrative", "Meeting Notice", "Finance", "Training"];

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

	$: filtered = circulars.filter((c) => {
		const matchesSearch =
			c.title.toLowerCase().includes(search.toLowerCase());

		const matchesCategory =
			categoryFilter === "" ||
			categoryFilter === "All" ||
			c.category === categoryFilter;

		return matchesSearch && matchesCategory;
	});
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

		<div class="mt-12 border border-border rounded-lg overflow-hidden">

			{#if filtered.length === 0}
				<div class="p-10 text-text-muted text-center">
					No circulars found.
				</div>
			{:else}
				{#each filtered as circular, index}
					<a
						href={circular.file}
						target="_blank"
						rel="noopener noreferrer"
						class={`flex flex-col md:flex-row md:items-center justify-between p-6 transition hover:bg-surface ${
							index !== filtered.length - 1 ? "border-b border-border" : ""
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
			{/if}

		</div>

	</div>
</section>
