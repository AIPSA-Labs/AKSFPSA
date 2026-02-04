<script lang="ts">
	type Leader = {
		name: string;
		role: string;
		image: string;
		district?: string;
	};

	const leaders: Leader[] = [
		{
			name: "Mr. John Mathew",
			role: "President",
			image: "/images/president.jpg",
			district: "Kozhikode"
		},
		{
			name: "Mrs. Anjali Nair",
			role: "General Secretary",
			image: "/images/secretary.jpg",
			district: "Malappuram"
		},
		{
			name: "Mr. Rahim Khan",
			role: "Treasurer",
			image: "/images/treasurer.jpg",
			district: "Ernakulam"
		},
		{
			name: "Mr. Suresh Kumar",
			role: "Joint Secretary",
			image: "/images/joint-secretary.jpg",
			district: "Thrissur"
		}
	];
</script>

<section class="bg-background">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="max-w-3xl">
			<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
				Leadership
			</p>

			<h2 class="text-3xl lg:text-4xl font-semibold text-primary">
				Executive Committee
			</h2>

			<p class="mt-6 text-text-muted leading-relaxed">
				The association is guided by experienced educational leaders
				representing institutions across Kerala.
			</p>
		</div>

		<div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">

			{#each leaders as leader}
				<div class="text-center">

					<div class="w-36 h-36 mx-auto rounded-full overflow-hidden border border-border bg-surface">
						<img
							src={leader.image}
							alt={leader.name}
							class="w-full h-full object-cover"
						/>
					</div>

					<h3 class="mt-6 text-lg font-semibold text-primary">
						{leader.name}
					</h3>

					<p class="mt-2 text-sm uppercase tracking-wide text-text-muted">
						{leader.role}
					</p>

					{#if leader.district}
						<p class="mt-1 text-xs text-text-muted">
							{leader.district}
						</p>
					{/if}

				</div>
			{/each}

		</div>

		<div class="mt-16">
			<a
				href="/leadership"
				class="inline-block border border-primary text-primary px-8 py-3 rounded-md font-medium tracking-wide hover:bg-surface transition"
			>
				View Full Committee
			</a>
		</div>

	</div>
</section>
