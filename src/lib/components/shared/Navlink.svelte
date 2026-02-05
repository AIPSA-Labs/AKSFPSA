<script>
	export let onNavigate = null;
</script>

<nav
	class="flex flex-col gap-6 text-sm font-medium md:flex-row md:items-center md:justify-center md:gap-8"
>
	<a href="/about" on:click={onNavigate}>About</a>
	<a href="/members" on:click={onNavigate}>Members</a>
	<a href="/circulars" on:click={onNavigate}>Circulars</a>
	<a href="/events" on:click={onNavigate}>Events</a>
	<a href="/contact" on:click={onNavigate}>Contact</a>

	<a
		href="/membership"
		on:click={onNavigate}
		class="rounded-md bg-primary px-4 py-2 text-center text-white md:ml-4"
	>
		Become Member
	</a>
</nav>
