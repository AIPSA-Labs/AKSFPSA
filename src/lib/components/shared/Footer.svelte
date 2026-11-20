<script lang="ts">
	//- Centralized strings and dimension constants
	import { STRINGS, EDUCATOR_CTA_CONSTANTS } from '$lib/constants/strings';
	//- External link indicator
	import { ExternalLink } from '@lucide/svelte';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-border bg-surface">
	<div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
			<div>
				<h2 class="text-lg font-semibold text-primary">
					All Kerala Self Financing Private Schools Association
				</h2>

				<p class="mt-4 text-sm leading-relaxed text-text-muted">
					Statewide association representing private self-financing educational institutions across
					Kerala, promoting structured governance and institutional excellence.
				</p>
			</div>

			<div>
				<h3 class="text-sm font-semibold tracking-wide text-primary uppercase">Quick Links</h3>

				<ul class="mt-6 space-y-3 text-sm text-text-muted">
					<li><a href="/about" class="hover:text-primary">About</a></li>
					<li><a href="/membership" class="hover:text-primary">Membership</a></li>
					<li><a href="/courses" class="hover:text-primary">Courses</a></li>
					<li><a href="/events" class="hover:text-primary">Events</a></li>
					<li><a href="/blog" class="hover:text-primary">Blog</a></li>
					<li><a href="/circulars" class="hover:text-primary">Circulars</a></li>
				</ul>
			</div>

			<div>
				<h3 class="text-sm font-semibold tracking-wide text-primary uppercase">Association</h3>

				<ul class="mt-6 space-y-3 text-sm text-text-muted">
					<li><a href="/leadership" class="hover:text-primary">Executive Committee</a></li>
					<li><a href="/gallery" class="hover:text-primary">Gallery</a></li>
					<li><a href="/contact" class="hover:text-primary">Contact</a></li>
					<li>
						<a
							href={STRINGS.TEACHERS_BANK_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 hover:text-primary"
						>
							<span>{STRINGS.FOOTER_GLOBAL_TEACHERS_BANK}</span>
							<ExternalLink size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
						</a>
					</li>
					<li>
						<a
							href={STRINGS.AITF_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 hover:text-primary"
						>
							<span>{STRINGS.FOOTER_AITF}</span>
							<ExternalLink size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
						</a>
					</li>
					<li>
						<a
							href={STRINGS.LEGAL_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 hover:text-primary"
						>
							<span>{STRINGS.FOOTER_LEGAL_SERVICES}</span>
							<ExternalLink size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
						</a>
					</li>
					<li>
						<a
							href={STRINGS.MONTVILLE_URL}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 hover:text-primary"
						>
							<span>{STRINGS.FOOTER_MONTVILLE}</span>
							<ExternalLink size={EDUCATOR_CTA_CONSTANTS.ICON_SIZE_SM} />
						</a>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="text-sm font-semibold tracking-wide text-primary uppercase">Contact</h3>

				<div class="mt-6 space-y-4 text-sm text-text-muted">
					<p>Ernakulam, Kerala – 682001</p>

					<p>Email: info@association.org</p>

					<p>Phone: +91 98765 43210</p>

					<p>
						Office Hours:<br />
						Monday – Friday<br />
						10:00 AM – 5:00 PM
					</p>
				</div>
			</div>
		</div>

		<div
			class="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-text-muted md:flex-row"
		>
			<p>
				© {year} All Kerala Self Financing Private Schools Association. All rights reserved.
			</p>

			<div class="flex gap-6">
				<a href="/privacy" class="hover:text-primary">Privacy Policy</a>
				<a href="/terms" class="hover:text-primary">Terms of Service</a>
			</div>
		</div>
	</div>
</footer>
