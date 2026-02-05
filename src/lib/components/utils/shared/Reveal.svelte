<script>
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let delay = 0;
	export let y = 24;
	export let duration = 600;

	let visible = false;
	/**
	 * @type {Element}
	 */
	let el;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visible = true;
						observer.unobserve(el);
					}
				});
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -80px 0px'
			}
		);

		observer.observe(el);
	});
</script>

<div bind:this={el}>
	{#if visible}
		<div in:fly={{ y, duration, delay }}>
			<slot />
		</div>
	{:else}
		<div style="opacity: 0; transform: translateY({y}px);">
			<slot />
		</div>
	{/if}
</div>
