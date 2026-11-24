<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import TopBar from '$lib/components/shared/TopBar.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';

	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Breadcrumbs from '$lib/components/shared/Breadcrumbs.svelte';
	import { fade } from 'svelte/transition';
	import { trackView } from '$lib/stores/analytics';
	import { SITE_CONFIG, ROUTE_SEO } from '$lib/constants/strings';

	let { children } = $props();

	const isAdmin = $derived.by(() => $page.url.pathname.startsWith('/admin'));

	//- Organization Schema (Schema.org / EducationalOrganization)
	const organizationSchema = {
		'@context': 'https://schema.org',
		'@type': 'EducationalOrganization',
		name: SITE_CONFIG.SITE_NAME,
		alternateName: [
			SITE_CONFIG.SHORT_NAME,
			'AIPSA Kerala',
			'All Kerala Private Schools Association'
		],
		url: SITE_CONFIG.BASE_URL,
		logo: `${SITE_CONFIG.BASE_URL}${SITE_CONFIG.OG_IMAGE_PATH}`,
		image: `${SITE_CONFIG.BASE_URL}${SITE_CONFIG.OG_IMAGE_PATH}`,
		description: SITE_CONFIG.DEFAULT_DESCRIPTION,
		address: {
			'@type': 'PostalAddress',
			streetAddress: SITE_CONFIG.OFFICE_ADDRESS.STREET,
			addressLocality: SITE_CONFIG.OFFICE_ADDRESS.LOCALITY,
			addressRegion: SITE_CONFIG.OFFICE_ADDRESS.REGION,
			postalCode: SITE_CONFIG.OFFICE_ADDRESS.POSTAL_CODE,
			addressCountry: SITE_CONFIG.OFFICE_ADDRESS.COUNTRY
		},
		areaServed: {
			'@type': 'AdministrativeArea',
			name: 'Kerala, India'
		},
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: SITE_CONFIG.CONTACT_PHONE,
			contactType: 'customer service',
			areaServed: 'IN',
			availableLanguage: ['English', 'Malayalam']
		},
		sameAs: [
			'https://allindiaprivateschools.org',
			'https://allindiateachersfederation.org',
			'https://www.unitedlawadvocates.com'
		]
	};

	//- WebSite Schema for Search Action and Brand Knowledge Graph
	const websiteSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_CONFIG.SHORT_NAME,
		alternateName: SITE_CONFIG.SITE_NAME,
		url: SITE_CONFIG.BASE_URL,
		inLanguage: ['en', 'ml']
	};

	//- Reactive meta generator matching clean path against ROUTE_SEO with fallbacks
	const meta = derived(page, ($page) => {
		const pathname = $page.url.pathname.replace(/\/+$/, '') || '/';
		const routeData = ROUTE_SEO[pathname];

		const pageTitle = $page.data?.meta?.title;
		const pageDesc = $page.data?.meta?.description;
		const pageKeywords = $page.data?.meta?.keywords;
		const pageImage = $page.data?.meta?.image;

		let title = pageTitle || routeData?.title;
		let description = pageDesc || routeData?.description;
		let keywords = pageKeywords || routeData?.keywords || SITE_CONFIG.KEYWORDS;

		if (!title) {
			const segments = pathname.split('/').filter(Boolean);
			if (segments.length > 0) {
				const last = segments[segments.length - 1]
					.replace(/-/g, ' ')
					.replace(/\b\w/g, (l) => l.toUpperCase());
				title = `${last} | ${SITE_CONFIG.SHORT_NAME}`;
			} else {
				title = SITE_CONFIG.SITE_NAME;
			}
		}

		if (!description) {
			description = SITE_CONFIG.DEFAULT_DESCRIPTION;
		}

		const cleanPath = pathname === '/' ? '' : pathname;
		const url = `${SITE_CONFIG.BASE_URL}${cleanPath}`;
		const image = pageImage || `${SITE_CONFIG.BASE_URL}${SITE_CONFIG.OG_IMAGE_PATH}`;

		return { title, description, keywords, url, image };
	});

	//- Breadcrumb Schema generator for inner pages
	const breadcrumbSchema = derived(page, ($page) => {
		const segments = $page.url.pathname.split('/').filter(Boolean);

		const items = [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: SITE_CONFIG.BASE_URL
			},
			...segments.map((seg, i) => ({
				'@type': 'ListItem',
				position: i + 2,
				name: seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
				item: `${SITE_CONFIG.BASE_URL}/${segments.slice(0, i + 1).join('/')}`
			}))
		];

		return {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: items
		};
	});

	const orgSchemaScript =
		`<script type="application/ld+json">${JSON.stringify(organizationSchema)}</` + `script>`;
	const websiteSchemaScript =
		`<script type="application/ld+json">${JSON.stringify(websiteSchema)}</` + `script>`;
	const breadcrumbSchemaScript = derived(
		breadcrumbSchema,
		($bc) => `<script type="application/ld+json">${JSON.stringify($bc)}</` + `script>`
	);

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
	{#if isAdmin}
		<title>Admin Dashboard | {SITE_CONFIG.SHORT_NAME}</title>
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<title>{$meta.title}</title>
		<meta name="description" content={$meta.description} />
		<meta name="keywords" content={$meta.keywords} />
		<meta name="author" content={SITE_CONFIG.SITE_NAME} />
		<meta
			name="robots"
			content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
		/>

		<!-- Canonical URL -->
		<link rel="canonical" href={$meta.url} />

		<!-- Geo Tags for Local SEO in Kerala -->
		<meta name="geo.region" content="IN-KL" />
		<meta name="geo.placename" content="Kerala, India" />
		<meta name="geo.position" content="9.9816;76.2999" />
		<meta name="ICBM" content="9.9816, 76.2999" />

		<!-- OpenGraph Meta Tags -->
		<meta property="og:site_name" content={SITE_CONFIG.SITE_NAME} />
		<meta property="og:title" content={$meta.title} />
		<meta property="og:description" content={$meta.description} />
		<meta
			property="og:type"
			content={$page.url.pathname.includes('/blog/') ? 'article' : 'website'}
		/>
		<meta property="og:url" content={$meta.url} />
		<meta property="og:locale" content={SITE_CONFIG.LOCALE} />
		<meta property="og:image" content={$meta.image} />
		<meta property="og:image:alt" content={SITE_CONFIG.SITE_NAME} />
		<meta property="og:image:width" content="512" />
		<meta property="og:image:height" content="512" />

		<!-- Twitter Card Meta Tags -->
		<meta name="twitter:card" content={SITE_CONFIG.TWITTER_CARD} />
		<meta name="twitter:title" content={$meta.title} />
		<meta name="twitter:description" content={$meta.description} />
		<meta name="twitter:image" content={$meta.image} />
		<meta name="twitter:image:alt" content={SITE_CONFIG.SITE_NAME} />

		<!-- PWA & Theme -->
		<link rel="icon" type="image/png" href={favicon} />
		<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
		<link rel="manifest" href="/site.webmanifest" />
		<meta name="theme-color" content={SITE_CONFIG.THEME_COLOR} />

		<!-- Structured Data: Organization & WebSite Schemas -->
		{@html orgSchemaScript}
		{@html websiteSchemaScript}

		<!-- Structured Data: Breadcrumbs on non-home pages -->
		{#if $page.url.pathname !== '/'}
			{@html $breadcrumbSchemaScript}
		{/if}
	{/if}
</svelte:head>

{#if isAdmin}
	{@render children()}
{:else}
	<TopBar />
	<Breadcrumbs />
	<main class="min-h-screen">
		{#key $page.url.pathname}
			<div in:fade={{ duration: 500 }}>
				{@render children()}
			</div>
		{/key}
	</main>
	<Footer />
{/if}
