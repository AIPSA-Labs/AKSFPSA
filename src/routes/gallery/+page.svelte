<script lang="ts">
	type Album = {
		slug: string;
		title: string;
		date: string;
		cover: string;
		description: string;
	};

	const albums: Album[] = [
		{
			slug: "conference-2026",
			title: "State-Level Educational Leadership Conference 2026",
			date: "January 2026",
			cover: "/images/gallery/conference-cover.jpg",
			description:
				"Statewide leadership conference focusing on institutional governance and policy alignment."
		},
		{
			slug: "district-meet-malappuram",
			title: "District Coordinators Meeting – Malappuram",
			date: "December 2025",
			cover: "/images/gallery/malappuram-cover.jpg",
			description:
				"District-level administrative coordination and membership engagement session."
		},
		{
			slug: "teacher-certification-2025",
			title: "Teacher Certification Program 2025",
			date: "November 2025",
			cover: "/images/gallery/certification-cover.jpg",
			description:
				"Professional development initiative conducted for faculty members across member institutions."
		}
	];
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Gallery
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			A visual archive of official meetings, training programs, conferences,
			and statewide initiatives conducted by the association.
		</p>

		<div class="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-10">

			{#each albums as album}
				<div class="border border-border rounded-lg overflow-hidden bg-surface flex flex-col">

					<div class="h-56 overflow-hidden">
						<img
							src={album.cover}
							alt={album.title}
							class="w-full h-full object-cover"
						/>
					</div>

					<div class="p-6 flex flex-col justify-between flex-1">

						<div>
							<h2 class="text-lg font-semibold text-primary leading-tight">
								{album.title}
							</h2>

							<p class="mt-2 text-sm text-text-muted">
								{album.date}
							</p>

							<p class="mt-4 text-sm text-text-muted leading-relaxed">
								{album.description}
							</p>
						</div>

						<div class="mt-6">
							<a
								href={`/gallery/${album.slug}`}
								class="inline-block border border-primary text-primary px-6 py-2 rounded-md text-sm font-medium tracking-wide hover:bg-background transition"
							>
								View Album
							</a>
						</div>

					</div>

				</div>
			{/each}

		</div>

	</div>
</section>
