<script lang="ts">
	import { SITE_CONFIG } from '$lib/constants/strings';

	let { data } = $props();
	const course = $derived(data.course);
	const canonicalPath = $derived(data.canonicalPath);
	const meta = $derived(data.meta);
	const courseScript = $derived(
		`<script type="application/ld+json">${JSON.stringify(data.schema)}</` + `script>`
	);
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<link rel="canonical" href="{SITE_CONFIG.BASE_URL}{canonicalPath}" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="{SITE_CONFIG.BASE_URL}{canonicalPath}" />
	{@html courseScript}
</svelte:head>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-5xl px-6 py-20 lg:px-8">
		{#if course.category}
			<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
				{course.category}
			</p>
		{/if}

		<h1 class="text-4xl leading-tight font-semibold text-primary">
			{course.title}
		</h1>

		{#if course.description}
			<p class="mt-6 leading-relaxed text-text-muted">
				{course.description}
			</p>
		{/if}

		<div class="mt-10 grid gap-6 rounded-lg border border-border bg-surface p-6 sm:grid-cols-3">
			<div>
				<p class="text-xs text-text-muted uppercase">Category</p>
				<p class="mt-2 font-medium text-primary">{course.category || 'General'}</p>
			</div>

			<div>
				<p class="text-xs text-text-muted uppercase">Duration</p>
				<p class="mt-2 font-medium text-primary">{course.duration || '—'}</p>
			</div>

			<div>
				<p class="text-xs text-text-muted uppercase">Mode</p>
				<p class="mt-2 font-medium text-primary">{course.mode || '—'}</p>
			</div>
		</div>

		{#if course.content}
			<div class="prose-content mt-16 leading-relaxed text-text-muted">
				{@html course.content}
			</div>
		{/if}

		<div class="mt-20">
			<a
				href="/contact"
				class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
			>
				Enquire About This Program
			</a>
		</div>
	</div>
</section>
