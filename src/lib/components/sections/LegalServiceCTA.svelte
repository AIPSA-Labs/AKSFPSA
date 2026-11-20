<script lang="ts">
	//- Centralized user strings and layout constants
	import { STRINGS, LEGAL_CTA_CONSTANTS } from '$lib/constants/strings';
	//- Lucide icons for legal representation and contact
	import { Scale, ShieldCheck, ArrowUpRight, PhoneCall, CircleCheck } from '@lucide/svelte';
	//- Smooth scroll reveal wrapper
	import Reveal from '../utils/shared/Reveal.svelte';
</script>

<Reveal>
	<section class="border-y border-border bg-background py-20 text-text">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<!-- Header -->
			<div class="max-w-3xl">
				<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
					{STRINGS.LEGAL_CTA_TAG}
				</p>

				<h2 class="text-3xl leading-tight font-semibold text-primary lg:text-4xl">
					{STRINGS.LEGAL_CTA_TITLE}
				</h2>

				<p class="mt-6 leading-relaxed text-text-muted">
					{STRINGS.LEGAL_CTA_SUBTITLE}
				</p>
			</div>

			<!-- Main Legal Advisory Card -->
			<div
				class="mt-14 rounded-2xl border border-border bg-surface p-8 shadow-xs transition hover:border-primary/50 sm:p-10 lg:p-12"
			>
				<div class="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
					<!-- Left: Partner Identity and Call-To-Actions (7 cols) -->
					<div class="flex flex-col justify-between lg:col-span-7">
						<div>
							<div class="flex flex-wrap items-center gap-3">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
								>
									<Scale size={LEGAL_CTA_CONSTANTS.ICON_SIZE_LG} />
								</div>
								<span
									class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
								>
									{STRINGS.LEGAL_EXPERIENCE_BADGE}
								</span>
								<span
									class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
								>
									{STRINGS.LEGAL_COURTS_BADGE}
								</span>
							</div>

							<h3 class="mt-6 text-2xl font-semibold text-primary sm:text-3xl">
								{STRINGS.LEGAL_PARTNER_NAME}
							</h3>

							<p class="mt-1 text-xs font-medium tracking-wider text-text-muted uppercase">
								{STRINGS.LEGAL_PARTNER_ROLE}
							</p>

							<p class="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
								{STRINGS.LEGAL_PARTNER_DESCRIPTION}
							</p>
						</div>

						<div class="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
							<a
								href={STRINGS.LEGAL_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-center text-sm font-medium tracking-wide whitespace-nowrap text-white transition hover:bg-primary-hover sm:w-auto"
							>
								<span>{STRINGS.LEGAL_PRIMARY_BUTTON}</span>
								<ArrowUpRight size={LEGAL_CTA_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
							</a>

							<a
								href={STRINGS.LEGAL_PHONE_TEL}
								class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-background px-6 text-center text-sm font-medium tracking-wide whitespace-nowrap text-primary transition hover:bg-primary hover:text-white sm:w-auto"
							>
								<PhoneCall size={LEGAL_CTA_CONSTANTS.ICON_SIZE_SM} class="shrink-0" />
								<span>{STRINGS.LEGAL_CALL_BUTTON}</span>
							</a>
						</div>
					</div>

					<!-- Right: Practice Areas and Scope for Member Schools (5 cols) -->
					<div
						class="flex flex-col justify-between rounded-xl border border-border bg-background p-6 sm:p-8 lg:col-span-5"
					>
						<div>
							<div class="flex items-center gap-2.5 text-primary">
								<ShieldCheck size={LEGAL_CTA_CONSTANTS.ICON_SIZE_MD} class="shrink-0" />
								<h4 class="text-sm font-semibold tracking-wide text-primary uppercase">
									{STRINGS.LEGAL_SCOPE_HEADING}
								</h4>
							</div>

							<ul class="mt-6 space-y-4 text-sm text-text">
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={LEGAL_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.LEGAL_FEATURE_1}</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={LEGAL_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.LEGAL_FEATURE_2}</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={LEGAL_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.LEGAL_FEATURE_3}</span>
								</li>
								<li class="flex items-start gap-3">
									<span class="mt-0.5 shrink-0 text-primary">
										<CircleCheck size={LEGAL_CTA_CONSTANTS.ICON_SIZE_SM} />
									</span>
									<span class="leading-snug">{STRINGS.LEGAL_FEATURE_4}</span>
								</li>
							</ul>
						</div>

						<div class="mt-6 border-t border-border pt-4 text-xs text-text-muted">
							<span>{STRINGS.LEGAL_FOOTER_NOTE}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</Reveal>
