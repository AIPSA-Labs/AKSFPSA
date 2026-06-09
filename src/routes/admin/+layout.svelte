<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		LayoutDashboard, FileText, BookOpen, Feather,
		Images, Users, Building2, HelpCircle, Phone,
		Menu, User, Sun, Moon, FolderOpen, Gem
	} from '@lucide/svelte';
	import { getStoredTheme, setTheme } from '$lib/stores/theme';

	let { children } = $props();

	let sidebarOpen = $state(false);
	let theme = $state(getStoredTheme());

	function toggleAppTheme() {
		const next = theme === 'dark' ? 'light' : 'dark';
		setTheme(next);
		theme = next;
	}

	function isAuthed() {
		return typeof localStorage !== 'undefined' && localStorage.getItem('aksfpsa_admin') === 'true';
	}

	onMount(() => {
		if (!isAuthed() && $page.url.pathname !== '/admin/login') {
			goto('/admin/login');
		}
	});

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/circulars', label: 'Circulars', icon: FileText },
		{ href: '/admin/courses', label: 'Courses', icon: BookOpen },
		{ href: '/admin/blog', label: 'Blog & Events', icon: Feather },
		{ href: '/admin/gallery', label: 'Gallery', icon: Images },
		{ href: '/admin/services', label: 'Services', icon: Gem },
		{ href: '/admin/files', label: 'Files', icon: FolderOpen },
		{ href: '/admin/leadership', label: 'Leadership', icon: Users },
		{ href: '/admin/members', label: 'Members', icon: Building2 },
		{ href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
		{ href: '/admin/contact', label: 'Contact', icon: Phone }
	];

	function closeSidebar() {
		sidebarOpen = false;
	}


</script>

{#if $page.url.pathname === '/admin/login'}
	{@render children()}
{:else if isAuthed()}
	<!-- Top Bar -->
	<div class="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-border bg-primary px-4 text-white">
		<div class="flex items-center gap-3">
			<button onclick={() => sidebarOpen = !sidebarOpen} class="lg:hidden"><Menu size={22} /></button>
			<span class="text-base font-semibold tracking-tight">AKSFPSA Admin</span>
		</div>
		<div class="flex items-center gap-2">
			<a href="/admin/profile" class="flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium transition hover:bg-white/25">
				<User size={14} /> Profile
			</a>
		</div>
	</div>

	<!-- Mobile overlay -->
	{#if sidebarOpen}
		<div class="fixed inset-0 z-40 bg-black/50 lg:hidden" onclick={closeSidebar}></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-surface transition-transform duration-200 lg:translate-x-0"
		class:max-lg:-translate-x-full={!sidebarOpen}
		class:max-lg:translate-x-0={sidebarOpen}
	>
		<nav class="flex flex-col gap-1 p-3">
			{#each navItems as item}
				<a
					href={item.href}
					onclick={closeSidebar}
					class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition {$page.url.pathname === item.href || (item.href !== '/admin' && $page.url.pathname.startsWith(item.href + '/')) ? 'bg-primary text-white' : 'text-text hover:bg-background'}"
				>
					<item.icon size={18} />
					{item.label}
				</a>
			{/each}
			<div class="mt-auto border-t border-border pt-3">
				<button onclick={() => { toggleAppTheme(); closeSidebar(); }} class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-text transition hover:bg-background">
					{#if theme === 'dark'}
						<Sun size={18} />
					{:else}
						<Moon size={18} />
					{/if}
					{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
				</button>
			</div>
		</nav>
	</aside>

	<!-- Main -->
	<div class="min-h-screen bg-background pt-14 lg:ml-64">
		<div class="p-4 md:p-6 lg:p-8">
			{@render children()}
		</div>
	</div>
{/if}
