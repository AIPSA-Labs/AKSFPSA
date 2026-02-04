<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import TopBar from '$lib/components/shared/TopBar.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<TopBar/>
<main class="min-h-screen">
{@render children()}
</main>
<Footer/>