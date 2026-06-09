<script lang="ts">
	import TipTap from './TipTap.svelte';

	let {
		title = '',
		excerpt = '',
		content = '',
		ontitlechange,
		onexcerptchange,
		oncontentchange,
		children
	}: {
		title?: string;
		excerpt?: string;
		content?: string;
		ontitlechange?: (v: string) => void;
		onexcerptchange?: (v: string) => void;
		oncontentchange?: (v: string) => void;
		children?: import('svelte').Snippet;
	} = $props();

	function handleTitle(e: Event) {
		ontitlechange?.((e.target as HTMLInputElement).value);
	}

	function handleExcerpt(e: Event) {
		onexcerptchange?.((e.target as HTMLTextAreaElement).value);
	}
</script>

<div class="space-y-5">
	<div>
		<label for="cf-title" class="mb-1.5 block text-sm font-medium text-text">Title *</label>
		<input id="cf-title" type="text" value={title} oninput={handleTitle} placeholder="Enter title"
			class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
	</div>

	<div>
		<label for="cf-excerpt" class="mb-1.5 block text-sm font-medium text-text">Excerpt / Description</label>
		<textarea id="cf-excerpt" value={excerpt} oninput={handleExcerpt} rows="3" placeholder="Brief description shown on card..."
			class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"></textarea>
	</div>

	{@render children?.()}

	<div>
		<label class="mb-1.5 block text-sm font-medium text-text">Content</label>
		<TipTap {content} onUpdate={oncontentchange} />
	</div>
</div>
