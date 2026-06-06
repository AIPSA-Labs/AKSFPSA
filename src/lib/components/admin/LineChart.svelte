<script lang="ts">
	import type { DailyStats } from '$lib/stores/analytics';

	let { data = [] as DailyStats[] }: { data: DailyStats[] } = $props();

	const max = $derived(Math.max(...data.map((d) => d.count), 1));
	const w = 600;
	const h = 180;
	const pad = { t: 20, r: 20, b: 30, l: 40 };
	const cw = w - pad.l - pad.r;
	const ch = h - pad.t - pad.b;

	const points = $derived(
		data.map((d, i) => {
			const x = pad.l + (i / Math.max(data.length - 1, 1)) * cw;
			const y = pad.t + ch - (d.count / max) * ch;
			return `${x},${y}`;
		})
	);

	const pathD = $derived(points.length > 1 ? 'M' + points.join(' L') : '');

	const areaD = $derived(
		points.length > 1 ? pathD + ` L${pad.l + cw},${pad.t + ch} L${pad.l},${pad.t + ch} Z` : ''
	);

	const yLabels = $derived.by(() => {
		const labels: { y: number; label: string }[] = [];
		const steps = 4;
		for (let i = 0; i <= steps; i++) {
			const val = Math.round((max / steps) * (steps - i));
			const y = pad.t + (i / steps) * ch;
			labels.push({ y, label: String(val) });
		}
		return labels;
	});

	const xLabels = $derived.by(() => {
		const interval = Math.max(1, Math.floor(data.length / 6));
		return data.filter((_, i) => i % interval === 0 || i === data.length - 1);
	});
</script>

<svg viewBox="0 0 {w} {h}" class="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
	<defs>
		<linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
			<stop offset="0%" stop-color="currentColor" stop-opacity="0.25" />
			<stop offset="100%" stop-color="currentColor" stop-opacity="0.02" />
		</linearGradient>
	</defs>

	{#each yLabels as yl}
		<line x1={pad.l} y1={yl.y} x2={pad.l + cw} y2={yl.y} stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4" />
		<text x={pad.l - 6} y={yl.y + 4} text-anchor="end" class="fill-text-muted" font-size="10">{yl.label}</text>
	{/each}

	{#if areaD}
		<path d={areaD} fill="url(#line-fill)" />
	{/if}

	{#if pathD}
		<path d={pathD} fill="none" stroke="currentColor" stroke-width="2" class="text-primary" stroke-linejoin="round" stroke-linecap="round" />
	{/if}

	{#if points.length > 0}
		{#each points as pt, i}
			{@const [x, y] = pt.split(',').map(Number)}
			<circle cx={x} cy={y} r="3" fill="currentColor" class="text-primary" stroke="white" stroke-width="1.5" />
		{/each}
	{/if}

	{#each xLabels as xl, i}
		{@const idx = data.indexOf(xl)}
		{@const x = pad.l + (idx / Math.max(data.length - 1, 1)) * cw}
		<text x={x} y={h - 6} text-anchor="middle" class="fill-text-muted" font-size="9">{xl.date}</text>
	{/each}
</svg>
