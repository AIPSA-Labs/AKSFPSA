<script>
	import { fly } from 'svelte/transition';
	import NavLinks from './Navlink.svelte';

	export let open = false;
	export let close;
</script>

{#if open}
	<!-- Overlay -->
	<div
		class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
		on:click={close}>
	</div>

	<!-- Side Panel -->
	<aside
		in:fly={{ x: -300 }}
		out:fly={{ x: -300 }}
		class="fixed top-0 left-0 h-full w-72 bg-background shadow-xl z-50 p-6">

		<div class="flex justify-between items-center border-b border-border pb-4">
			<h2 class="font-semibold text-primary">Menu</h2>
			<button on:click={close} class="text-xl text-primary">×</button>
		</div>

		<div class="mt-6">
			<NavLinks onNavigate={close} />
		</div>
	</aside>
{/if}
