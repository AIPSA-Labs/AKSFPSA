<script lang="ts">
	type Leader = {
		name: string;
		role: string;
		image: string;
		district?: string;
	};

	const leaders: Leader[] = [
		{
			name: 'Mr. John Mathew',
			role: 'President',
			image: '/images/president.jpg',
			district: 'Kozhikode'
		},
		{
			name: 'Mrs. Anjali Nair',
			role: 'General Secretary',
			image: '/images/secretary.jpg',
			district: 'Malappuram'
		},
		{
			name: 'Mr. Rahim Khan',
			role: 'Treasurer',
			image: '/images/treasurer.jpg',
			district: 'Ernakulam'
		},
		{
			name: 'Mr. Suresh Kumar',
			role: 'Joint Secretary',
			image: '/images/joint-secretary.jpg',
			district: 'Thrissur'
		}
	];
</script>

<section class="bg-background">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<div class="max-w-3xl">
			<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">Leadership</p>

			<h2 class="text-3xl font-semibold text-primary lg:text-4xl">Executive Committee</h2>

			<p class="mt-6 leading-relaxed text-text-muted">
				The association is guided by experienced educational leaders representing institutions
				across Kerala.
			</p>
		</div>

		<div class="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
			{#each leaders as leader}
				<div class="text-center">
					<div
						class="mx-auto h-36 w-36 overflow-hidden rounded-full border border-border bg-surface"
					>
						<img src={leader.image} alt={leader.name} class="h-full w-full object-cover" />
					</div>

					<h3 class="mt-6 text-lg font-semibold text-primary">
						{leader.name}
					</h3>

					<p class="mt-2 text-sm tracking-wide text-text-muted uppercase">
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
				class="inline-block rounded-md border border-primary px-8 py-3 font-medium tracking-wide text-primary transition hover:bg-surface"
			>
				View Full Committee
			</a>
		</div>
	</div>
</section>
