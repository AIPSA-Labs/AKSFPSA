<script lang="ts">
	import { onMount } from 'svelte';

	let {
		value = $bindable(''),
		placeholder = 'Select date'
	}: { value?: string; placeholder?: string } = $props();

	let show = $state(false);
	let calMonth = $state(new Date().getMonth());
	let calYear = $state(new Date().getFullYear());
	let openUp = $state(false);
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const daysInMonth = $derived(new Date(calYear, calMonth + 1, 0).getDate());
	const firstDayOfMonth = $derived(new Date(calYear, calMonth, 1).getDay());

	function prevMonth() {
		if (calMonth === 0) { calMonth = 11; calYear--; }
		else calMonth--;
	}

	function nextMonth() {
		if (calMonth === 11) { calMonth = 0; calYear++; }
		else calMonth++;
	}

	function selectDate(day: number) {
		value = `${months[calMonth]} ${day}, ${calYear}`;
		show = false;
	}

	function toggleShow(e: Event) {
		const input = e.currentTarget as HTMLElement;
		const rect = input.getBoundingClientRect();
		const bottomSpace = window.innerHeight - rect.bottom;
		openUp = bottomSpace < 350;
		show = !show;
	}

	onMount(() => {
		function onDocClick() { show = false; }
		document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	});
</script>

<div class="relative" onclick={(e) => e.stopPropagation()}>
	<input type="text" readonly bind:value={value} {placeholder}
		class="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
		onclick={toggleShow} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { toggleShow(e); } }} />
	{#if show}
		<div
			class="absolute left-0 z-50 w-72 rounded-xl border border-border bg-surface p-3 shadow-lg"
			class:top-full={!openUp} class:mt-1={!openUp}
			class:bottom-full={openUp} class:mb-1={openUp}
		>
			<div class="mb-2 flex items-center justify-between">
				<button onclick={prevMonth} class="rounded-lg p-1 text-text-muted hover:bg-background" type="button">&lt;</button>
				<span class="text-sm font-medium text-text">{months[calMonth]} {calYear}</span>
				<button onclick={nextMonth} class="rounded-lg p-1 text-text-muted hover:bg-background" type="button">&gt;</button>
			</div>
			<div class="grid grid-cols-7 gap-0.5 text-center text-xs">
				{#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as d}
					<div class="py-1 font-medium text-text-muted">{d}</div>
				{/each}
				{#each Array(firstDayOfMonth) as _}
					<div></div>
				{/each}
				{#each Array(daysInMonth) as _, i}
					{@const day = i + 1}
					<button onclick={() => selectDate(day)}
						class="rounded-lg py-1 text-text transition hover:bg-primary hover:text-white {value === `${months[calMonth]} ${day}, ${calYear}` ? 'bg-primary text-white' : ''}"
						type="button">{day}</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
