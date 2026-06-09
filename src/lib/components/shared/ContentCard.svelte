<script lang="ts">
	let { title = '', excerpt = '', content = '', ctaLabel = '', ctaHref = '', category = '' }: {
		title?: string;
		excerpt?: string;
		content?: string;
		ctaLabel?: string;
		ctaHref?: string;
		category?: string;
	} = $props();

	let expanded = $state(false);
</script>

<div class="border border-border rounded-lg p-6 bg-surface flex flex-col transition hover:shadow-md">
	{#if category}
		<span class="text-xs uppercase tracking-wide text-text-muted">{category}</span>
	{/if}

	<button onclick={() => expanded = !expanded} class="text-left w-full">
		<h2 class="mt-1 text-xl font-semibold text-primary leading-tight">{title}</h2>

		{#if excerpt}
			<p class="mt-3 text-sm text-text-muted leading-relaxed">{excerpt}</p>
		{/if}
	</button>

	{#if content && expanded}
		<div class="mt-4 pt-4 border-t border-border prose-content">
			{@html content}
		</div>
	{/if}

	{#if ctaLabel && ctaHref}
		<div class="mt-6">
			<a href={ctaHref}
				class="inline-block border border-primary text-primary px-6 py-2 rounded-md text-sm font-medium tracking-wide hover:bg-background transition">
				{ctaLabel}
			</a>
		</div>
	{/if}
</div>

<style>
	:global(.prose-content h2) {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}
	:global(.prose-content h3) {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-text);
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose-content p) {
		color: var(--color-text-muted);
		line-height: 1.75;
		margin-bottom: 0.75rem;
		font-size: 0.9375rem;
	}
	:global(.prose-content ul),
	:global(.prose-content ol) {
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-muted);
	}
	:global(.prose-content li) {
		margin-bottom: 0.375rem;
		font-size: 0.9375rem;
	}
	:global(.prose-content blockquote) {
		border-left: 3px solid var(--color-primary);
		padding-left: 1rem;
		margin: 0.75rem 0;
		font-style: italic;
		color: var(--color-text-muted);
	}
	:global(.prose-content a) {
		color: var(--color-primary);
		text-decoration: underline;
	}
</style>
