<script lang="ts">
	import { page } from '$app/stores';

	function format(segment: string) {
		return segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}

	$: segments = $page.url.pathname.split('/').filter(Boolean);

	$: crumbs = segments.map((seg, i) => ({
		name: format(seg),
		path: '/' + segments.slice(0, i + 1).join('/')
	}));
</script>

{#if crumbs.length > 0}
	<nav class="p-2 text-sm text-text-muted">
		<a href="/" class="hover:text-primary">Home</a>

		{#each crumbs as crumb}
			<span class="mx-2">/</span>
			<a href={crumb.path} class="hover:text-primary">
				{crumb.name}
			</a>
		{/each}
	</nav>
{/if}
