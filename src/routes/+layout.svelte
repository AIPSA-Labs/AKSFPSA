<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import TopBar from '$lib/components/shared/TopBar.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';

	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Breadcrumbs from '$lib/components/shared/Breadcrumbs.svelte';
	import { fade } from 'svelte/transition';
	import { getStoredTheme } from '$lib/stores/theme';
	import { trackView } from '$lib/stores/analytics';

	let { children } = $props();

	let currentTheme = $state(getStoredTheme());

	$effect(() => {
		const observer = new MutationObserver(() => {
			currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	});

	const isAdmin = $derived.by(() => $page.url.pathname.startsWith('/admin'));

	const siteName = 'All Kerala Self Financing Private Schools Association';
	const baseUrl = 'https://yourdomain.com';

	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteName,
		url: baseUrl,
		logo: `${baseUrl}${favicon}`,
		description:
			'Statewide association representing private self-financing educational institutions across Kerala.',
		address: {
			'@type': 'PostalAddress',
			streetAddress: '123 Institutional Road',
			addressLocality: 'Ernakulam',
			addressRegion: 'Kerala',
			postalCode: '682001',
			addressCountry: 'IN'
		},
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+91-9876543210',
			contactType: 'customer service',
			areaServed: 'IN',
			availableLanguage: ['English', 'Malayalam']
		},
		sameAs: [
			'https://facebook.com/yourpage',
			'https://twitter.com/yourpage',
			'https://instagram.com/yourpage'
		]
	};

	const meta = derived(page, ($page) => {
		const title = $page.data?.meta?.title ?? siteName;

		const description =
			$page.data?.meta?.description ??
			'Statewide association representing private self-financing educational institutions across Kerala.';

		const url = baseUrl + $page.url.pathname;

		return { title, description, url };
	});

	const breadcrumbSchema = derived(page, ($page) => {
		const segments = $page.url.pathname.split('/').filter(Boolean);

		const items = segments.map((seg, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
			item: baseUrl + '/' + segments.slice(0, i + 1).join('/')
		}));

		return {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: items
		};
	});

	let prevPath = '';

	$effect(() => {
		const path = $page.url.pathname;
		if (path !== prevPath) {
			prevPath = path;
			trackView(path);
		}
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
	<meta property="og:image" content={`${baseUrl}${favicon}`} />
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$meta.title} />
	<meta name="twitter:description" content={$meta.description} />

	<link rel="canonical" href={$meta.url} />
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content={currentTheme === 'dark' ? '#1a1a2e' : '#800020'} />
	{#if $page.url.pathname !== '/'}
		<script type="application/ld+json">
		{JSON.stringify($breadcrumbSchema)}
		</script>
	{/if}
</svelte:head>

{#if isAdmin}
	{@render children()}
{:else}
	<TopBar />
	<Breadcrumbs />
	<main class="min-h-screen">
		{#key $page.url.pathname}
			<div in:fade={{ duration: 500 }} >
				{@render children()}
			</div>
		{/key}
	</main>
	<Footer />
{/if}
