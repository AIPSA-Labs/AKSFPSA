<script>
	import { onMount } from 'svelte';

	export let value = 0;
	export let suffix = '';
	export let duration = 1500;

	let count = 0;
	/**
	 * @type {Element}
	 */
	let el;
	let started = false;

	function animate() {
		const start = 0;
		const startTime = performance.now();

		/**
		 * @param {number} currentTime
		 */
		function update(currentTime) {
			const progress = Math.min((currentTime - startTime) / duration, 1);
			count = Math.floor(progress * (value - start) + start);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !started) {
					started = true;
					animate();
					observer.disconnect();
				}
			},
			{ threshold: 0.5 }
		);

		observer.observe(el);
	});
</script>

<span bind:this={el}>
	{count}{suffix}
</span>
