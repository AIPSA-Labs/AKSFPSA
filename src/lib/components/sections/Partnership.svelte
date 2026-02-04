<script lang="ts">
	import { onMount, onDestroy, tick } from "svelte";
	import { browser } from "$app/environment";

	type Partner = {
		name: string;
		logo: string;
		description: string;
		url: string;
	};

	let selected: Partner | null = null;
	let track: HTMLDivElement | null = null;

	const partners: Partner[] = [
		{
			name: "Varthana Finance",
			logo: "/images/varthana-logo.png",
			description: "Providing structured financial solutions supporting infrastructure and institutional growth.",
			url: "https://www.varthana.com"
		},
		{
			name: "EduCert India",
			logo: "/images/partner2.png",
			description: "Certification and teacher development programs.",
			url: "https://example.com"
		},
		{
			name: "SchoolTech Solutions",
			logo: "/images/partner3.png",
			description: "Digital infrastructure for schools.",
			url: "https://example.com"
		},
		{
			name: "Kerala Edu Network",
			logo: "/images/partner4.png",
			description: "Collaborative educational initiatives.",
			url: "https://example.com"
		}
	];

	let animationId: number;
	let position = 0;
	let contentWidth = 0;
	const speed = 0.6;

	let isDragging = false;
	let startX = 0;
	let lastX = 0;

	async function setup() {
		if (!browser || !track) return;
		await tick();
		contentWidth = track.scrollWidth / 2;
	}

	function animate() {
		if (!browser || !track || isDragging) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		position -= speed;

		if (Math.abs(position) >= contentWidth) {
			position += contentWidth;
		}

		track.style.transform = `translateX(${position}px)`;
		animationId = requestAnimationFrame(animate);
	}

	function onPointerDown(e: PointerEvent) {
		isDragging = true;
		startX = e.clientX;
		lastX = e.clientX;
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging || !track) return;

		const delta = e.clientX - lastX;
		lastX = e.clientX;
		position += delta;

		if (position > 0) position -= contentWidth;
		if (Math.abs(position) >= contentWidth) position += contentWidth;

		track.style.transform = `translateX(${position}px)`;
	}

	function onPointerUp() {
		isDragging = false;
	}

	function openPartner(partner: Partner) {
		selected = partner;
		if (browser) document.body.style.overflow = "hidden";
	}

	function closePartner() {
		selected = null;
		if (browser) document.body.style.overflow = "";
	}

	onMount(async () => {
		if (!browser) return;
		await setup();
		animationId = requestAnimationFrame(animate);
		window.addEventListener("resize", setup);
	});

	onDestroy(() => {
		if (!browser) return;
		cancelAnimationFrame(animationId);
		window.removeEventListener("resize", setup);
		document.body.style.overflow = "";
	});
</script>

<section class="bg-surface border-y border-border relative overflow-hidden">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="text-center max-w-3xl mx-auto">
			<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
				Strategic Partnerships
			</p>

			<h2 class="text-3xl lg:text-4xl font-semibold text-primary">
				Trusted Institutional Collaborations
			</h2>

			<p class="mt-6 text-text-muted leading-relaxed">
				We collaborate with established organizations to strengthen institutional
				capacity, financial access, and professional development across Kerala.
			</p>
		</div>

		<div
			class="relative mt-16 overflow-hidden cursor-grab active:cursor-grabbing select-none"
			on:pointerdown={onPointerDown}
			on:pointermove={onPointerMove}
			on:pointerup={onPointerUp}
			on:pointerleave={onPointerUp}
		>
			<div bind:this={track} class="flex gap-20 items-center w-max">
				{#each partners as partner}
					<button
						type="button"
						class="opacity-80 hover:opacity-100 transition flex items-center"
						on:click={() => openPartner(partner)}
					>
						<img
							src={partner.logo}
							alt={partner.name}
							class="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
							draggable="false"
						/>
					</button>
				{/each}

				{#each partners as partner}
					<button
						type="button"
						class="opacity-80 hover:opacity-100 transition flex items-center"
						on:click={() => openPartner(partner)}
					>
						<img
							src={partner.logo}
							alt={partner.name}
							class="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
							draggable="false"
						/>
					</button>
				{/each}
			</div>

			<div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent"></div>
			<div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent"></div>
		</div>

	</div>
</section>

{#if selected}
	<div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
		<div class="bg-background border border-border rounded-xl p-10 max-w-2xl w-full relative">

			<button
				type="button"
				class="absolute top-4 right-6 text-primary text-2xl"
				on:click={closePartner}
			>
				×
			</button>

			<img
				src={selected.logo}
				alt={selected.name}
				class="h-16 mx-auto object-contain"
			/>

			<h3 class="mt-8 text-2xl font-semibold text-primary text-center">
				{selected.name}
			</h3>

			<p class="mt-6 text-text-muted text-sm leading-relaxed text-center">
				{selected.description}
			</p>

			<div class="mt-10 text-center">
				<a
					href={selected.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
				>
					Visit Website
				</a>
			</div>

		</div>
	</div>
{/if}
