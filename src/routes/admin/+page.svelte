<script lang="ts">
	import { getStore, DEFAULT_CIRCULARS, DEFAULT_COURSES, DEFAULT_ALBUMS, DEFAULT_LEADERS, DEFAULT_MEMBERS, DEFAULT_BLOG_POSTS, DEFAULT_FAQS, DEFAULT_FILES, DEFAULT_SERVICES } from '$lib/stores/data';
	import {
		FileText, BookOpen, Images,
		Users, Building2, Feather, HelpCircle, FolderOpen, Gem,
		Eye, TrendingUp, BarChart3
	} from '@lucide/svelte';
	import LineChart from '$lib/components/admin/LineChart.svelte';
	import { getDailyStats, getTotalViews, getTodayViews, getPageBreakdown } from '$lib/stores/analytics';
	import type { Component } from 'svelte';

	interface StatCard {
		label: string;
		value: number;
		icon: Component;
		href: string;
		color: string;
	}

	const stats: StatCard[] = [
		{ label: 'Circulars', value: getStore('circulars', DEFAULT_CIRCULARS).length, icon: FileText, href: '/admin/circulars', color: 'border-l-primary' },
		{ label: 'Courses', value: getStore('courses', DEFAULT_COURSES).length, icon: BookOpen, href: '/admin/courses', color: 'border-l-blue-500' },
		{ label: 'Blog & Events', value: getStore('blog_posts', DEFAULT_BLOG_POSTS).length, icon: Feather, href: '/admin/blog', color: 'border-l-emerald-500' },
		{ label: 'Services', value: getStore('services', DEFAULT_SERVICES).length, icon: Gem, href: '/admin/services', color: 'border-l-pink-500' },
		{ label: 'Gallery Albums', value: getStore('albums', DEFAULT_ALBUMS).length, icon: Images, href: '/admin/gallery', color: 'border-l-amber-500' },
		{ label: 'Leadership', value: getStore('leaders', DEFAULT_LEADERS).length, icon: Users, href: '/admin/leadership', color: 'border-l-violet-500' },
		{ label: 'Members', value: getStore('members', DEFAULT_MEMBERS).length, icon: Building2, href: '/admin/members', color: 'border-l-cyan-500' },
		{ label: 'FAQs', value: getStore('faqs', DEFAULT_FAQS).length, icon: HelpCircle, href: '/admin/faq', color: 'border-l-orange-500' },
		{ label: 'Files', value: getStore('uploaded_files', DEFAULT_FILES).length, icon: FolderOpen, href: '/admin/files', color: 'border-l-teal-500' }
	];

	let totalViews = $state(getTotalViews());
	let todayViews = $state(getTodayViews());
	let dailyStats = $state(getDailyStats(7));
	let pageBreakdown = $state(getPageBreakdown());

	$effect(() => {
		totalViews = getTotalViews();
		todayViews = getTodayViews();
		dailyStats = getDailyStats(7);
		pageBreakdown = getPageBreakdown();
	});
</script>

<style>
	.scrollbar-hide::-webkit-scrollbar { display: none; }
	.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<h1 class="text-2xl font-bold text-primary">Dashboard</h1>
<p class="mt-1 text-sm text-text-muted">Welcome to the AKSFPSA admin panel. Manage all site content from here.</p>

<div class="mt-8 grid grid-flow-col grid-rows-2 gap-5 overflow-x-auto lg:grid-flow-row lg:grid-cols-3 lg:grid-rows-none lg:overflow-visible xl:grid-cols-4 scrollbar-hide">
	{#each stats as stat}
		<a
			href={stat.href}
			class="w-56 rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md lg:w-auto {stat.color} border-l-4"
		>
			<div class="flex items-center justify-between">
				<stat.icon size={28} strokeWidth={1.5} />
				<span class="text-3xl font-bold text-primary">{stat.value}</span>
			</div>
			<p class="mt-2 text-sm font-medium text-text-muted">{stat.label}</p>
		</a>
	{/each}
</div>

<div class="mt-10 grid gap-6 lg:grid-cols-3">
	<div class="rounded-xl border border-border bg-surface p-6">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
				<Eye size={20} class="text-primary" />
			</div>
			<div>
				<p class="text-sm text-text-muted">Total Page Views</p>
				<p class="text-2xl font-bold text-primary">{totalViews}</p>
			</div>
		</div>
	</div>
	<div class="rounded-xl border border-border bg-surface p-6">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
				<TrendingUp size={20} class="text-primary" />
			</div>
			<div>
				<p class="text-sm text-text-muted">Today</p>
				<p class="text-2xl font-bold text-primary">{todayViews}</p>
			</div>
		</div>
	</div>
	<div class="rounded-xl border border-border bg-surface p-6">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
				<BarChart3 size={20} class="text-primary" />
			</div>
			<div>
				<p class="text-sm text-text-muted">Avg. Daily (7d)</p>
				<p class="text-2xl font-bold text-primary">{Math.round(dailyStats.reduce((a, b) => a + b.count, 0) / 7)}</p>
			</div>
		</div>
	</div>
</div>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<div class="rounded-xl border border-border bg-surface p-6">
		<h2 class="mb-4 text-lg font-semibold text-primary">Views (7 Days)</h2>
		<div class="h-48">
			<LineChart data={dailyStats} />
		</div>
	</div>
	<div class="rounded-xl border border-border bg-surface p-6">
		<h2 class="mb-4 text-lg font-semibold text-primary">Top Pages</h2>
		<div class="space-y-2">
			{#each pageBreakdown as item}
				<div class="flex items-center justify-between rounded-lg bg-background px-3 py-2">
					<span class="text-sm font-medium text-text">{item.label}</span>
					<span class="text-sm text-text-muted">{item.count}</span>
				</div>
			{/each}
			{#if pageBreakdown.length === 0}
				<p class="py-4 text-center text-sm text-text-muted">No page views yet. Browse the site to see analytics.</p>
			{/if}
		</div>
	</div>
</div>
