<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { X } from '@lucide/svelte';

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
			name: 'Varthana Finance',
			logo: 'https://olkuydfcpymlqegqeery.supabase.co/storage/v1/object/public/images/others/Varthana%20Higher%20Resolution%202022%20(1).jpg',
			description:
				'Providing specialized financial solutions supporting school infrastructure and institutional growth across India.',
			url: 'https://varthana.com/school/apply?utm_source=+AIPSA&utm_medium=Website'
		},
		{
			name: 'Axis Finance Limited',
			logo: 'https://olkuydfcpymlqegqeery.supabase.co/storage/v1/object/public/images/others/Axis-Finance-Limited-5-removebg-preview.png',
			description:
				'Extending institutional growth loans and institutional development funds for private educational institutions.',
			url: 'https://www.axisbank.com'
		},
		{
			name: 'Cambridge University Press & Assessment',
			logo: 'https://www.cambridge.org/sites/default/files/navigation_logos/cambridge-university-press-and-assessment%401x_2_0.png',
			description:
				'World-leading educational resources, curriculum frameworks, and globally recognized assessments.',
			url: 'https://www.cambridge.org/'
		},
		{
			name: 'Tata ClassEdge',
			logo: 'https://www.tataclassedgeonline.com/classedge-v4-theme/images/classedge/logo.png',
			description:
				'Innovative technology-based learning solutions, smart classroom platforms, and pedagogical planning tools.',
			url: 'https://www.tataclassedgeonline.com/'
		},
		{
			name: 'Britannica Education',
			logo: 'https://cdn.britannica.com/mendel/eb-logo/MendelNewThistleLogo.png',
			description:
				'Globally recognized knowledge repository and authoritative curriculum resources supporting educators and learners.',
			url: 'https://www.britannica.com'
		},
		{
			name: 'Matific',
			logo: 'https://www.matific.com/home/resources/media/images-2/Logo.svg',
			description:
				'Interactive, pedagogically designed mathematics learning platform empowering conceptual foundation.',
			url: 'https://www.matific.com/in/en-gb/home/'
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
		if (!browser || !track) {
			return;
		}
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
		if (!isDragging || !track) {
			return;
		}

		const delta = e.clientX - lastX;
		lastX = e.clientX;
		position += delta;

		if (position > 0) {
			position -= contentWidth;
		}
		if (Math.abs(position) >= contentWidth) {
			position += contentWidth;
		}

		track.style.transform = `translateX(${position}px)`;
	}

	function onPointerUp() {
		isDragging = false;
	}

	function openPartner(partner: Partner) {
		selected = partner;
		if (browser) {
			document.body.style.overflow = 'hidden';
		}
	}

	function closePartner() {
		selected = null;
		if (browser) {
			document.body.style.overflow = '';
		}
	}

	onMount(async () => {
		if (!browser) {
			return;
		}
		await setup();
		animationId = requestAnimationFrame(animate);
		window.addEventListener('resize', setup);
	});

	onDestroy(() => {
		if (!browser) {
			return;
		}
		cancelAnimationFrame(animationId);
		window.removeEventListener('resize', setup);
		document.body.style.overflow = '';
	});
</script>

<section class="relative overflow-hidden border-y border-border bg-surface">
	<div class="mx-auto max-w-7xl px-6 py-20 lg:px-8">
		<div class="mx-auto max-w-3xl text-center">
			<p class="mb-4 text-xs font-medium tracking-widest text-primary uppercase">
				Strategic Partnerships
			</p>

			<h2 class="text-3xl font-semibold text-primary lg:text-4xl">
				Trusted Institutional Collaborations
			</h2>

			<p class="mt-6 leading-relaxed text-text-muted">
				We collaborate with established organizations to strengthen institutional capacity,
				financial access, and professional development across Kerala.
			</p>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="relative mt-16 cursor-grab overflow-hidden select-none active:cursor-grabbing"
			on:pointerdown={onPointerDown}
			on:pointermove={onPointerMove}
			on:pointerup={onPointerUp}
			on:pointerleave={onPointerUp}
		>
			<div bind:this={track} class="flex w-max items-center gap-20">
				{#each partners as partner}
					<button
						type="button"
						class="flex items-center opacity-80 transition hover:opacity-100"
						on:click={() => openPartner(partner)}
					>
						<img
							src={partner.logo}
							alt={partner.name}
							class="h-12 w-auto object-contain grayscale transition hover:grayscale-0"
							draggable="false"
						/>
					</button>
				{/each}

				{#each partners as partner}
					<button
						type="button"
						class="flex items-center opacity-80 transition hover:opacity-100"
						on:click={() => openPartner(partner)}
					>
						<img
							src={partner.logo}
							alt={partner.name}
							class="h-12 w-auto object-contain grayscale transition hover:grayscale-0"
							draggable="false"
						/>
					</button>
				{/each}
			</div>

			<div
				class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-surface to-transparent"
			></div>
			<div
				class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-surface to-transparent"
			></div>
		</div>
	</div>
</section>

{#if selected}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
	>
		<div class="relative w-full max-w-2xl rounded-xl border border-border bg-background p-10">
			<button type="button" class="absolute top-4 right-6 text-primary" on:click={closePartner}>
				<X size={24} />
			</button>

			<img src={selected.logo} alt={selected.name} class="mx-auto h-16 object-contain" />

			<h3 class="mt-8 text-center text-2xl font-semibold text-primary">
				{selected.name}
			</h3>

			<p class="mt-6 text-center text-sm leading-relaxed text-text-muted">
				{selected.description}
			</p>

			<div class="mt-10 text-center">
				<a
					href={selected.url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block rounded-md bg-primary px-8 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
				>
					Visit Website
				</a>
			</div>
		</div>
	</div>
{/if}
