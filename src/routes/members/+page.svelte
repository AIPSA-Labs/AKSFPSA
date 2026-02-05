<script lang="ts">
	type MemberInstitution = {
		id: number;
		name: string;
		district: string;
		category: string;
		since: string;
	};

	let search = "";
	let districtFilter = "";

	const districts = [
		"All",
		"Kozhikode",
		"Malappuram",
		"Ernakulam",
		"Thrissur",
		"Kannur",
		"Palakkad",
		"Kollam"
	];

	const members: MemberInstitution[] = [
		{
			id: 1,
			name: "Green Valley Higher Secondary School",
			district: "Kozhikode",
			category: "Recognized",
			since: "2022"
		},
		{
			id: 2,
			name: "Al Noor Public School",
			district: "Malappuram",
			category: "Associate",
			since: "2023"
		},
		{
			id: 3,
			name: "St. Thomas Academy",
			district: "Ernakulam",
			category: "Recognized",
			since: "2021"
		},
		{
			id: 4,
			name: "Modern Scholars School",
			district: "Thrissur",
			category: "Recognized",
			since: "2024"
		}
	];

	$: filtered = members.filter((m) => {
		const matchesSearch =
			m.name.toLowerCase().includes(search.toLowerCase());

		const matchesDistrict =
			districtFilter === "" ||
			districtFilter === "All" ||
			m.district === districtFilter;

		return matchesSearch && matchesDistrict;
	});
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Member Institutions
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl">
			The association maintains a structured directory of recognized and associate member institutions across Kerala.
		</p>

		<div class="mt-12 flex flex-col md:flex-row gap-6">

			<input
				type="text"
				placeholder="Search institution..."
				class="w-full md:w-1/2 border border-border rounded-md px-4 py-3 bg-surface"
				bind:value={search}
			/>

			<select
				class="w-full md:w-1/3 border border-border rounded-md px-4 py-3 bg-surface"
				bind:value={districtFilter}
			>
				<option value="">All Districts</option>
				{#each districts as district}
					<option value={district}>{district}</option>
				{/each}
			</select>

		</div>

		<div class="mt-12 border border-border rounded-lg overflow-hidden">

			{#if filtered.length === 0}
				<div class="p-10 text-text-muted text-center">
					No institutions found.
				</div>
			{:else}
				{#each filtered as member, index}
					<div
						class={`flex flex-col md:flex-row md:items-center justify-between p-6 ${
							index !== filtered.length - 1 ? "border-b border-border" : ""
						}`}
					>
						<div>
							<h3 class="text-lg font-semibold text-primary">
								{member.name}
							</h3>

							<p class="mt-2 text-sm text-text-muted">
								{member.district} • Member Since {member.since}
							</p>
						</div>

						<span
							class={`mt-4 md:mt-0 text-xs uppercase tracking-wide px-3 py-1 rounded-md ${
								member.category === "Recognized"
									? "bg-primary/10 text-primary"
									: "bg-surface text-text-muted border border-border"
							}`}
						>
							{member.category}
						</span>
					</div>
				{/each}
			{/if}

		</div>

	</div>
</section>
