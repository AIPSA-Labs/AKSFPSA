<script lang="ts">
	//- Centralized user strings and layout constants
	import { STRINGS, VISION_2047_CONSTANTS } from '$lib/constants/strings';
	//- Lucide icons for vision goals
	import { School, Briefcase, Users, ArrowRight } from '@lucide/svelte';
	//- Smooth scroll reveal wrapper
	import Reveal from '../utils/shared/Reveal.svelte';

	//- Three foundational goals of Vision 2047
	const visionGoals = [
		{
			category: STRINGS.VISION_2047_CARD1_CATEGORY,
			stat: STRINGS.VISION_2047_CARD1_STAT,
			title: STRINGS.VISION_2047_CARD1_TITLE,
			desc: STRINGS.VISION_2047_CARD1_DESC,
			icon: School
		},
		{
			category: STRINGS.VISION_2047_CARD2_CATEGORY,
			stat: STRINGS.VISION_2047_CARD2_STAT,
			title: STRINGS.VISION_2047_CARD2_TITLE,
			desc: STRINGS.VISION_2047_CARD2_DESC,
			icon: Briefcase
		},
		{
			category: STRINGS.VISION_2047_CARD3_CATEGORY,
			stat: STRINGS.VISION_2047_CARD3_STAT,
			title: STRINGS.VISION_2047_CARD3_TITLE,
			desc: STRINGS.VISION_2047_CARD3_DESC,
			icon: Users
		}
	];
</script>

<Reveal>
	<section id="vision-2047" class="border-y border-border bg-surface py-20 text-text lg:py-28">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Header with Vikasit Bharat 2047 Logo -->
			<div class="mx-auto max-w-3xl text-center">
				<div class="mb-6 flex justify-center">
					<div
						class="flex h-32 w-32 items-center justify-center rounded-full border border-border bg-white p-3 shadow-xs sm:h-40 sm:w-40 md:h-44 md:w-44"
					>
						<img
							src={STRINGS.VISION_2047_LOGO_URL}
							alt={STRINGS.VISION_2047_LOGO_ALT}
							width="176"
							height="176"
							loading="lazy"
							decoding="async"
							class="h-full w-full rounded-full object-contain"
						/>
					</div>
				</div>

				<p class="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
					{STRINGS.VISION_2047_TAG}
				</p>

				<h2 class="text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl">
					{STRINGS.VISION_2047_TITLE}
				</h2>

				<p class="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
					{STRINGS.VISION_2047_SUBTITLE}
				</p>
			</div>

			<!-- 3 Vision Targets Grid -->
			<div class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each visionGoals as goal}
					{@const Icon = goal.icon}
					<div
						class="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-xs transition duration-300 hover:border-primary hover:shadow-md sm:p-7"
					>
						<div>
							<div class="flex items-center justify-between">
								<span class="text-xs font-semibold tracking-wider text-text-muted uppercase">
									{goal.category}
								</span>
								<div
									class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
								>
									<Icon size={VISION_2047_CONSTANTS.ICON_SIZE_MD} class="shrink-0" />
								</div>
							</div>

							<div class="mt-4">
								<div class="text-3xl font-bold text-primary sm:text-4xl">
									{goal.stat}
								</div>
								<h3 class="mt-1 text-lg font-bold text-text">
									{goal.title}
								</h3>
							</div>

							<p class="mt-3 text-sm leading-relaxed text-text-muted">
								{goal.desc}
							</p>
						</div>

						<div class="mt-6 border-t border-border pt-4">
							<span class="inline-flex items-center text-xs font-semibold text-primary">
								{STRINGS.VISION_2047_CARD_BADGE}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<!-- Bottom Strategic Alignment Banner -->
			<div
				class="mt-12 rounded-2xl border border-border bg-background p-8 shadow-xs sm:p-10 lg:flex lg:items-center lg:justify-between lg:p-12"
			>
				<div class="max-w-3xl">
					<h3 class="text-xl font-bold text-primary sm:text-2xl">
						{STRINGS.VISION_2047_BANNER_TITLE}
					</h3>
					<p class="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
						{STRINGS.VISION_2047_BANNER_DESC}
					</p>
				</div>

				<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-0 lg:shrink-0">
					<a
						href={STRINGS.VISION_2047_BANNER_PRIMARY_URL}
						class="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium tracking-wide whitespace-nowrap text-white transition hover:bg-primary-hover"
					>
						<span>{STRINGS.VISION_2047_BANNER_PRIMARY_BTN}</span>
						<ArrowRight size={VISION_2047_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
					</a>

					<a
						href={STRINGS.VISION_2047_BANNER_SECONDARY_URL}
						class="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-primary bg-transparent px-8 text-sm font-medium tracking-wide whitespace-nowrap text-primary transition hover:bg-primary hover:text-white"
					>
						<span>{STRINGS.VISION_2047_BANNER_SECONDARY_BTN}</span>
					</a>
				</div>
			</div>
		</div>
	</section>
</Reveal>
