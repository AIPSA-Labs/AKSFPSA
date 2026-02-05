<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.png";
	import TopBar from "$lib/components/shared/TopBar.svelte";
	import Footer from "$lib/components/shared/Footer.svelte";

	import { page } from "$app/stores";
	import { derived } from "svelte/store";
	import Breadcrumbs from "$lib/components/shared/Breadcrumbs.svelte";

	let { children } = $props();
	const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "All Kerala Self Financing Private Schools Association",
	url: "https://yourdomain.com",
	logo: "https://yourdomain.com/logo.png",
	description:
		"Statewide association representing private self-financing educational institutions across Kerala.",
	address: {
		"@type": "PostalAddress",
		streetAddress: "123 Institutional Road",
		addressLocality: "Ernakulam",
		addressRegion: "Kerala",
		postalCode: "682001",
		addressCountry: "IN"
	},
	contactPoint: {
		"@type": "ContactPoint",
		telephone: "+91-9876543210",
		contactType: "customer service",
		areaServed: "IN",
		availableLanguage: ["English", "Malayalam"]
	},
	sameAs: [
		"https://facebook.com/yourpage",
		"https://twitter.com/yourpage",
		"https://instagram.com/yourpage"
	]
};


	const siteName = "All Kerala Self Financing Private Schools Association";
	const baseUrl = "https://yourdomain.com";

	const meta = derived(page, ($page) => {
		const title =
			$page.data?.meta?.title ??
			siteName;

		const description =
			$page.data?.meta?.description ??
			"Statewide association representing private self-financing educational institutions across Kerala.";

		const url = baseUrl + $page.url.pathname;

		return { title, description, url };
	});


const breadcrumbSchema = derived(page, ($page) => {
	const segments = $page.url.pathname.split("/").filter(Boolean);

	const items = segments.map((seg, i) => ({
		"@type": "ListItem",
		position: i + 1,
		name: seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		item: baseUrl + "/" + segments.slice(0, i + 1).join("/")
	}));

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items
	};
});
</script>

<svelte:head>
	<title>{$meta.title}</title>
	<meta name="description" content={$meta.description} />
	<script type="application/ld+json">
	{JSON.stringify(organizationSchema)}
</script>

	<meta property="og:title" content={$meta.title} />
	<meta property="og:description" content={$meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$meta.url} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$meta.title} />
	<meta name="twitter:description" content={$meta.description} />

	<link rel="canonical" href={$meta.url} />
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#800020" />
{#if $page.url.pathname !== "/"}
	<script type="application/ld+json">
		{JSON.stringify($breadcrumbSchema)}
	</script>
{/if}


</svelte:head>

<TopBar />
<Breadcrumbs/>
<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
