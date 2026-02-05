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
			title: 'Guidelines for Academic Year 2026–27',
			date: '12 January 2026',
			category: 'Administrative',
			file: '/documents/circular1.pdf'
		},
		{
			id: 2,
			title: 'District-Level Coordination Meeting Notice',
			date: '28 December 2025',
			category: 'Meeting Notice',
			file: '/documents/circular2.pdf'
		},
		{
			id: 3,
			title: 'Financial Partnership Update – Institutional Funding',
			date: '10 December 2025',
			category: 'Finance',
			file: '/documents/circular3.pdf'
		},
		{
			id: 4,
			title: 'Teacher Certification Program Announcement',
			date: '25 November 2025',
			category: 'Training',
			file: '/documents/circular4.pdf'
		}
	];
</script>

<section class="bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<div class="max-w-3xl">
			<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
				Official Communications
			</p>

			<h2 class="text-3xl font-semibold text-primary lg:text-4xl">Latest Circulars & Notices</h2>

			<p class="mt-6 leading-relaxed text-text-muted">
				Access official announcements, administrative guidelines, and policy communications issued
				by the association.
			</p>
		</div>

		<div class="mt-16 overflow-hidden rounded-lg border border-border">
			{#each circulars as circular, index}
				<a
					href={circular.file}
					target="_blank"
					rel="noopener noreferrer"
					class={`flex flex-col justify-between p-6 transition hover:bg-surface md:flex-row md:items-center ${
						index !== circulars.length - 1 ? 'border-b border-border' : ''
					}`}
				>
					<div class="space-y-2">
						<span class="text-xs tracking-wide text-text-muted uppercase">
							{circular.category}
						</span>

						<h3 class="text-lg font-semibold text-primary">
							{circular.title}
						</h3>

						<p class="text-sm text-text-muted">
							{circular.date}
						</p>
					</div>

					<span class="mt-4 text-sm font-medium tracking-wide text-primary uppercase md:mt-0">
						View PDF
					</span>
				</a>
			{/each}
		</div>

		<div class="mt-16">
			<a
				href="/circulars"
				class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
			>
				View All Circulars
			</a>
		</div>
	</div>
</section>
