<script lang="ts">
	export let data;
	const { event } = data;
</script>

<section class="bg-background min-h-screen">
	<div class="max-w-4xl mx-auto px-6 lg:px-8 py-20">

		<a
			href="/events"
			class="text-sm text-primary font-medium hover:underline"
		>
			← Back to Events
		</a>

		<p class="mt-6 text-xs uppercase tracking-wide text-text-muted">
			{event.type}
		</p>

		<h1 class="mt-4 text-4xl font-semibold text-primary">
			{event.title}
		</h1>

		<p class="mt-4 text-text-muted">
			{event.date} • {event.location}
		</p>

		<p class="mt-8 text-text-muted leading-relaxed">
			{event.details}
		</p>

		<div class="mt-12">
			<a
				href="/contact"
				class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
			>
				Register / Enquire
			</a>
		</div>

	</div>
</section>
