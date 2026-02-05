<script lang="ts">
	type Event = {
		slug: string;
		title: string;
		date: string;
		location: string;
		type: string;
		description: string;
	};

	const events: Event[] = [
		{
			slug: "annual-leadership-meet-2026",
			title: "Annual Educational Leadership Meet 2026",
			date: "15 March 2026",
			location: "Ernakulam",
			type: "Conference",
			description:
				"Statewide conference focusing on governance alignment and institutional development."
		},
		{
			slug: "district-coordinators-meet",
			title: "District Coordinators Meeting",
			date: "10 February 2026",
			location: "Kozhikode",
			type: "Meeting",
			description:
				"District-level review meeting for member institutions."
		},
		{
			slug: "teacher-certification-workshop",
			title: "Teacher Certification Workshop",
			date: "20 January 2026",
			location: "Thrissur",
			type: "Workshop",
			description:
				"Professional development workshop for faculty members."
		}
	];
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Events & Programs
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			Official events, conferences, workshops, and statewide meetings conducted by the association.
		</p>

		<div class="mt-16 border border-border rounded-lg overflow-hidden">

			{#each events as event, index}
				<a
					href={`/events/${event.slug}`}
					class={`flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-surface transition ${
						index !== events.length - 1 ? "border-b border-border" : ""
					}`}
				>
					<div>
						<span class="text-xs uppercase tracking-wide text-text-muted">
							{event.type}
						</span>

						<h2 class="mt-2 text-xl font-semibold text-primary">
							{event.title}
						</h2>

						<p class="mt-2 text-sm text-text-muted">
							{event.date} • {event.location}
						</p>

						<p class="mt-4 text-sm text-text-muted leading-relaxed">
							{event.description}
						</p>
					</div>

					<span class="mt-6 md:mt-0 text-sm font-medium text-primary uppercase tracking-wide">
						View Details →
					</span>
				</a>
			{/each}

		</div>

	</div>
</section>
