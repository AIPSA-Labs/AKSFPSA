<script lang="ts">
	type Member = {
		name: string;
		role: string;
		district?: string;
		image: string;
	};

	const officeBearers: Member[] = [
		{
			name: "Mr. John Mathew",
			role: "President",
			district: "Kozhikode",
			image: "/images/president.jpg"
		},
		{
			name: "Mrs. Anjali Nair",
			role: "General Secretary",
			district: "Malappuram",
			image: "/images/secretary.jpg"
		},
		{
			name: "Mr. Rahim Khan",
			role: "Treasurer",
			district: "Ernakulam",
			image: "/images/treasurer.jpg"
		}
	];

	const committeeMembers: Member[] = [
		{
			name: "Mr. Suresh Kumar",
			role: "Joint Secretary",
			district: "Thrissur",
			image: "/images/member1.jpg"
		},
		{
			name: "Mrs. Deepa Menon",
			role: "Executive Member",
			district: "Kannur",
			image: "/images/member2.jpg"
		},
		{
			name: "Mr. Faisal Ahmed",
			role: "Executive Member",
			district: "Palakkad",
			image: "/images/member3.jpg"
		},
		{
			name: "Mrs. Lakshmi Pillai",
			role: "Executive Member",
			district: "Kollam",
			image: "/images/member4.jpg"
		}
	];
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<h1 class="text-4xl font-semibold text-primary">
			Executive Committee
		</h1>

		<p class="mt-6 text-text-muted max-w-3xl leading-relaxed">
			The association is governed by a structured executive committee representing
			institutions across districts in Kerala. The leadership ensures coordinated
			policy alignment and statewide representation.
		</p>

		<div class="mt-20">

			<h2 class="text-2xl font-semibold text-primary">
				Office Bearers
			</h2>

			<div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">

				{#each officeBearers as member}
					<div class="text-center">

						<div class="w-40 h-40 mx-auto rounded-full overflow-hidden border border-border bg-surface">
							<img
								src={member.image}
								alt={member.name}
								class="w-full h-full object-cover"
							/>
						</div>

						<h3 class="mt-6 text-lg font-semibold text-primary">
							{member.name}
						</h3>

						<p class="mt-2 text-sm uppercase tracking-wide text-text-muted">
							{member.role}
						</p>

						{#if member.district}
							<p class="mt-1 text-xs text-text-muted">
								{member.district}
							</p>
						{/if}

					</div>
				{/each}

			</div>

		</div>

		<div class="mt-24">

			<h2 class="text-2xl font-semibold text-primary">
				Executive Members
			</h2>

			<div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">

				{#each committeeMembers as member}
					<div class="text-center">

						<div class="w-32 h-32 mx-auto rounded-full overflow-hidden border border-border bg-surface">
							<img
								src={member.image}
								alt={member.name}
								class="w-full h-full object-cover"
							/>
						</div>

						<h3 class="mt-5 text-base font-semibold text-primary">
							{member.name}
						</h3>

						<p class="mt-2 text-xs uppercase tracking-wide text-text-muted">
							{member.role}
						</p>

						{#if member.district}
							<p class="mt-1 text-xs text-text-muted">
								{member.district}
							</p>
						{/if}

					</div>
				{/each}

			</div>

		</div>

	</div>
</section>
