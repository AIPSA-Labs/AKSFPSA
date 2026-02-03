<script>
	import MobileMenu from './MobileMenu.svelte';
	import NavLinks from './Navlink.svelte';
  import Logo from '../../assets/logo.png'

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

<header class="bg-background border-b border-border sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 lg:px-8">
		<div class="flex items-center justify-between h-16">

			<!-- Logo -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full">
          <img src={Logo} alt="Logo">
        </div>
				<div>
					<h1 class="text-lg font-bold text-primary leading-tight">
						AKSFPSA
					</h1>
					<p class="text-xs text-text-muted hidden sm:block">
						All Kerala Self Financing Private Schools Association
					</p>
				</div>
			</div>

			<!-- Desktop Nav -->
			<div class="hidden md:block">
				<NavLinks />
			</div>

			<!-- Mobile Toggle -->
			<button
				on:click={openMenu}
				class="md:hidden text-primary text-2xl">
				☰
			</button>
		</div>
	</div>
</header>

<MobileMenu open={mobileOpen} close={closeMenu} />
