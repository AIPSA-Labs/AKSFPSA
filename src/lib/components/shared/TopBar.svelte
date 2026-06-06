<script>
	import MobileMenu from './MobileMenu.svelte';
	import NavLinks from './Navlink.svelte';
	import Logo from '../../assets/logo.png';
	import { Menu } from '@lucide/svelte';

	let mobileOpen = false;

	function openMenu() {
		mobileOpen = true;
		document.body.style.overflow = 'hidden';
	}

	function closeMenu() {
		mobileOpen = false;
		document.body.style.overflow = '';
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-background">
	<div class="mx-auto max-w-7xl px-4 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full">
					<img src={Logo} alt="Logo" />
				</div>
				<div>
					<h1 class="text-lg leading-tight font-bold text-primary">AKSFPSA</h1>
					<p class="hidden text-xs text-text-muted sm:block">
						All Kerala Self Financing Private Schools Association
					</p>
				</div>
			</div>

			<!-- Desktop Nav -->
			<div class="hidden items-center gap-4 md:flex">
				<NavLinks />
			</div>

			<!-- Mobile Toggle -->
			<div class="flex items-center gap-2 md:hidden">
				<button on:click={openMenu} class="text-primary"><Menu size={24} /></button>
			</div>
		</div>
	</div>
</header>

<MobileMenu open={mobileOpen} close={closeMenu} />
