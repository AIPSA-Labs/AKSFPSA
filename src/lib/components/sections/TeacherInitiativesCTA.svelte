<script lang="ts">
	//- Centralized strings and constants
	import { STRINGS, EDUCATOR_CTA_CONSTANTS } from '$lib/constants/strings';
	//- Lucide icons for visual affordance
	import { GraduationCap, Users, ArrowUpRight, CircleCheck } from '@lucide/svelte';
	//- Smooth scroll reveal wrapper
	import Reveal from '../utils/shared/Reveal.svelte';
</script>

<Reveal>
	<section class="border-y border-border bg-surface py-20 text-text">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Header -->
			<div class="max-w-3xl">
				<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
					{STRINGS.EDUCATOR_CTA_TAG}
				</p>

				<h2 class="text-3xl leading-tight font-semibold text-primary lg:text-4xl">
					{STRINGS.EDUCATOR_CTA_TITLE}
				</h2>

				<p class="mt-6 leading-relaxed text-text-muted">
					{STRINGS.EDUCATOR_CTA_SUBTITLE}
				</p>
			</div>

			<!-- Unified 2-Card CTA Grid -->
			<div class="mt-14 grid gap-8 lg:grid-cols-2">
				<!-- Global Teachers Bank Card -->
				<div
					class="flex flex-col justify-between rounded-2xl border border-border bg-background p-8 shadow-xs transition hover:border-primary/50"
				>
					<div>
						<div class="flex items-center justify-between gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
							>
								<GraduationCap size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_LG} />
							</div>
							<span
								class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
							>
								{STRINGS.TEACHERS_BANK_BADGE}
							</span>
						</div>

						<p class="mt-5 text-xs font-medium tracking-wider text-text-muted uppercase">
							{STRINGS.TEACHERS_BANK_ORG}
						</p>

						<h3 class="mt-1 text-2xl font-semibold text-primary">
							{STRINGS.TEACHERS_BANK_TITLE}
						</h3>

						<p class="mt-4 text-sm leading-relaxed text-text-muted">
							{STRINGS.TEACHERS_BANK_DESCRIPTION}
						</p>

						<!-- Highlights -->
						<ul class="mt-6 space-y-3 text-sm text-text">
							<li class="flex items-start gap-2.5">
								<span class="mt-0.5 text-primary">
									<CircleCheck size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
								</span>
								<span>{STRINGS.TEACHERS_BANK_FEATURE_1}</span>
							</li>
							<li class="flex items-start gap-2.5">
								<span class="mt-0.5 text-primary">
									<CircleCheck size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
								</span>
								<span>{STRINGS.TEACHERS_BANK_FEATURE_2}</span>
							</li>
							<li class="flex items-start gap-2.5">
								<span class="mt-0.5 text-primary">
									<CircleCheck size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
								</span>
								<span>{STRINGS.TEACHERS_BANK_FEATURE_3}</span>
							</li>
						</ul>
					</div>

					<div class="mt-8 border-t border-border pt-6">
						<a
							href={STRINGS.TEACHERS_BANK_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-center text-sm font-medium tracking-wide whitespace-nowrap text-white transition hover:bg-primary-hover sm:w-auto"
						>
							<span>{STRINGS.TEACHERS_BANK_BUTTON}</span>
							<ArrowUpRight size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
						</a>
					</div>
				</div>

				<!-- All India Teachers Federation (AITF) Card -->
				<div
					class="flex flex-col justify-between rounded-2xl border border-border bg-background p-8 shadow-xs transition hover:border-primary/50"
				>
					<div>
						<div class="flex items-center justify-between gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
							>
								<Users size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_LG} />
							</div>
							<span
								class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
							>
								{STRINGS.AITF_BADGE}
							</span>
						</div>

						<p class="mt-5 text-xs font-medium tracking-wider text-text-muted uppercase">
							{STRINGS.AITF_ORG}
						</p>

						<h3 class="mt-1 text-2xl font-semibold text-primary">
							{STRINGS.AITF_TITLE}
						</h3>

						<p class="mt-4 text-sm leading-relaxed text-text-muted">
							{STRINGS.AITF_DESCRIPTION}
						</p>

						<!-- Highlights -->
						<ul class="mt-6 space-y-3 text-sm text-text">
							<li class="flex items-start gap-2.5">
								<span class="mt-0.5 text-primary">
									<CircleCheck size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
								</span>
								<span>{STRINGS.AITF_FEATURE_1}</span>
							</li>
							<li class="flex items-start gap-2.5">
								<span class="mt-0.5 text-primary">
									<CircleCheck size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
								</span>
								<span>{STRINGS.AITF_FEATURE_2}</span>
							</li>
							<li class="flex items-start gap-2.5">
								<span class="mt-0.5 text-primary">
									<CircleCheck size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
								</span>
								<span>{STRINGS.AITF_FEATURE_3}</span>
							</li>
						</ul>
					</div>

					<div class="mt-8 border-t border-border pt-6">
						<a
							href={STRINGS.AITF_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-transparent px-6 text-center text-sm font-medium tracking-wide whitespace-nowrap text-primary transition hover:bg-primary hover:text-white sm:w-auto"
						>
							<span>{STRINGS.AITF_BUTTON}</span>
							<ArrowUpRight size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
						</a>
					</div>
				</div>
			</div>

			<!-- Bottom summary bar -->
			<div
				class="mt-12 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-background p-6 text-center sm:flex-row sm:text-left"
			>
				<p class="text-sm text-text-muted">
					{STRINGS.EDUCATOR_CTA_NOTE}
				</p>
				<div class="flex shrink-0 items-center gap-4">
					<a
						href={STRINGS.TEACHERS_BANK_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs font-semibold text-primary transition hover:underline"
					>
						{STRINGS.TEACHERS_BANK_TITLE} &rarr;
					</a>
					<span class="text-border">|</span>
					<a
						href={STRINGS.AITF_URL}
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs font-semibold text-primary transition hover:underline"
					>
						{STRINGS.AITF_TITLE} &rarr;
					</a>
				</div>
			</div>
		</div>
	</section>
</Reveal>
