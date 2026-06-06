<script lang="ts">
	import { getStore, DEFAULT_CIRCULARS, DEFAULT_COURSES, DEFAULT_EVENTS, DEFAULT_ALBUMS, DEFAULT_LEADERS, DEFAULT_MEMBERS, DEFAULT_PLANS, DEFAULT_FAQS } from '$lib/stores/data';
	import {
		FileText, BookOpen, Calendar, Images,
		Users, Building2, CreditCard, HelpCircle
	} from '@lucide/svelte';
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
		{ label: 'Events', value: getStore('events', DEFAULT_EVENTS).length, icon: Calendar, href: '/admin/events', color: 'border-l-emerald-500' },
		{ label: 'Gallery Albums', value: getStore('albums', DEFAULT_ALBUMS).length, icon: Images, href: '/admin/gallery', color: 'border-l-amber-500' },
		{ label: 'Leadership', value: getStore('leaders', DEFAULT_LEADERS).length, icon: Users, href: '/admin/leadership', color: 'border-l-violet-500' },
		{ label: 'Members', value: getStore('members', DEFAULT_MEMBERS).length, icon: Building2, href: '/admin/members', color: 'border-l-cyan-500' },
		{ label: 'Membership Plans', value: getStore('plans', DEFAULT_PLANS).length, icon: CreditCard, href: '/admin/membership', color: 'border-l-rose-500' },
		{ label: 'FAQs', value: getStore('faqs', DEFAULT_FAQS).length, icon: HelpCircle, href: '/admin/membership', color: 'border-l-orange-500' }
	];
</script>

<h1 class="text-2xl font-bold text-primary">Dashboard</h1>
<p class="mt-1 text-sm text-text-muted">Welcome to the AKSFPSA admin panel. Manage all site content from here.</p>

<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each stats as stat}
		<a
			href={stat.href}
			class="rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md {stat.color} border-l-4"
		>
			<div class="flex items-center justify-between">
				<stat.icon size={28} strokeWidth={1.5} />
				<span class="text-3xl font-bold text-primary">{stat.value}</span>
			</div>
			<p class="mt-2 text-sm font-medium text-text-muted">{stat.label}</p>
		</a>
	{/each}
</div>

<div class="mt-10 rounded-xl border border-border bg-surface p-6">
	<h2 class="text-lg font-semibold text-primary">Quick Actions</h2>
	<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		<a href="/admin/circulars" class="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
			Manage Circulars
		</a>
		<a href="/admin/courses" class="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
			Manage Courses
		</a>
		<a href="/admin/events" class="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
			Manage Events
		</a>
		<a href="/admin/gallery" class="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
			Manage Gallery
		</a>
		<a href="/admin/leadership" class="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
			Manage Leadership
		</a>
		<a href="/admin/members" class="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary hover:text-primary">
			Manage Members
		</a>
	</div>
</div>
