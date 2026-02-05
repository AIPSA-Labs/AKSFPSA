<script>
	import { fly } from 'svelte/transition';
	import NavLinks from './Navlink.svelte';

	export let open = false;
	export let close;
</script>

{#if open}
	<!-- Overlay -->

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" on:click={close}></div>

	<!-- Side Panel -->
	<aside
		in:fly={{ x: -300 }}
		out:fly={{ x: -300 }}
		class="fixed top-0 left-0 z-50 h-full w-72 bg-background p-6 shadow-xl"
	>
		<div class="flex items-center justify-between border-b border-border pb-4">
			<h2 class="font-semibold text-primary">Menu</h2>
			<button on:click={close} class="text-xl text-primary">×</button>
		</div>

		<div class="mt-6">
			<NavLinks onNavigate={close} />
		</div>
	</aside>
{/if}
