<script lang="ts">
	//- Centralized user strings and layout constants
	import { STRINGS, MONTVILLE_CTA_CONSTANTS } from '$lib/constants/strings';
	//- Lucide icons for early childhood education
	import { Baby, Shapes, ArrowUpRight, Sparkles, CircleCheck } from '@lucide/svelte';
	//- Smooth scroll reveal wrapper
	import Reveal from '../utils/shared/Reveal.svelte';
</script>

<Reveal>
	<section class="border-y border-border bg-surface py-20 text-text">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Header -->
			<div class="max-w-3xl">
				<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
					{STRINGS.MONTVILLE_CTA_TAG}
				</p>

				<h2 class="text-3xl leading-tight font-semibold text-primary lg:text-4xl">
					{STRINGS.MONTVILLE_CTA_TITLE}
				</h2>

				<p class="mt-6 leading-relaxed text-text-muted">
					{STRINGS.MONTVILLE_CTA_SUBTITLE}
				</p>
			</div>

			<!-- Main Montville Preschool Project Card -->
			<div
				class="mt-14 rounded-2xl border border-border bg-background p-8 shadow-xs transition hover:border-primary/50 sm:p-10 lg:p-12"
			>
				<div class="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
					<!-- Left: Brand Identity and Action Links (7 cols) -->
					<div class="flex flex-col justify-between lg:col-span-7">
						<div>
							<div class="flex flex-wrap items-center gap-3">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
								>
									<Baby size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_LG} />
								</div>
								<span
									class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
								>
									{STRINGS.MONTVILLE_BADGE_CURRICULUM}
								</span>
								<span
									class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
								>
									{STRINGS.MONTVILLE_BADGE_AGES}
								</span>
							</div>

							<h3 class="mt-6 text-2xl font-semibold text-primary sm:text-3xl">
								{STRINGS.MONTVILLE_BRAND_NAME}
							</h3>

							<p class="mt-1 text-xs font-medium tracking-wider text-text-muted uppercase">
								{STRINGS.MONTVILLE_BRAND_TAGLINE}
							</p>

							<p class="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
								{STRINGS.MONTVILLE_DESCRIPTION}
							</p>
						</div>

						<div class="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
							<a
								href={STRINGS.MONTVILLE_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-center text-sm font-medium tracking-wide whitespace-nowrap text-white transition hover:bg-primary-hover sm:w-auto"
							>
								<span>{STRINGS.MONTVILLE_PRIMARY_BUTTON}</span>
								<ArrowUpRight size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
							</a>

							<a
								href={STRINGS.MONTVILLE_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-background px-6 text-center text-sm font-medium tracking-wide whitespace-nowrap text-primary transition hover:bg-primary hover:text-white sm:w-auto"
							>
								<Sparkles size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
								<span>{STRINGS.MONTVILLE_SECONDARY_BUTTON}</span>
							</a>
						</div>
					</div>

					<!-- Right: Early Years Framework & Scope (5 cols) -->
					<div
						class="flex flex-col justify-between rounded-xl border border-border bg-surface/50 p-6 sm:p-8 lg:col-span-5"
					>
						<div>
							<div class="flex items-center gap-2.5 text-primary">
								<Shapes size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_MD} class="shrink-0" />
								<h4 class="text-sm font-semibold tracking-wide text-primary uppercase">
									{STRINGS.MONTVILLE_SCOPE_HEADING}
								</h4>
							</div>

							<ul class="mt-6 space-y-4 text-sm text-text">
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.MONTVILLE_FEATURE_1}</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.MONTVILLE_FEATURE_2}</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.MONTVILLE_FEATURE_3}</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={MONTVILLE_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.MONTVILLE_FEATURE_4}</span>
								</li>
							</ul>
						</div>

						<div class="mt-6 border-t border-border pt-4 text-xs text-text-muted">
							<span>{STRINGS.MONTVILLE_FOOTER_NOTE}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</Reveal>
