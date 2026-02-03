<script>
	export let onNavigate = null;
</script>

<nav class="flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-8 text-sm font-medium">
	<a href="/about" on:click={onNavigate}>About</a>
	<a href="/members" on:click={onNavigate}>Members</a>
	<a href="/circulars" on:click={onNavigate}>Circulars</a>
	<a href="/events" on:click={onNavigate}>Events</a>
	<a href="/contact" on:click={onNavigate}>Contact</a>

	<a
		href="/membership"
		on:click={onNavigate}
		class="bg-primary text-white px-4 py-2 rounded-md text-center md:ml-4">
		Become Member
	</a>
</nav>
