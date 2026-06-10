<script lang="ts">
	import { snackbar } from '$lib/stores/snackbar';
	import { CheckCircle, AlertTriangle, XCircle, Info, X } from '@lucide/svelte';

	const iconMap = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertTriangle,
		info: Info,
	};

	const colorMap = {
		success: 'border-green-500 bg-green-50 text-green-800',
		error: 'border-red-500 bg-red-50 text-red-800',
		warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
		info: 'border-blue-500 bg-blue-50 text-blue-800',
	};

	function dismiss(id: number) {
		snackbar.update((msgs) => msgs.filter((m) => m.id !== id));
	}
</script>

<div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
	{#each $snackbar as msg (msg.id)}
		<div class="flex items-start gap-2.5 rounded-lg border-l-4 px-4 py-3 shadow-lg {colorMap[msg.type]} animate-slide-up" role="alert">
			<svelte:component this={iconMap[msg.type]} size={18} class="mt-0.5 shrink-0" />
			<p class="text-sm font-medium">{msg.text}</p>
			<button onclick={() => dismiss(msg.id)} class="ml-auto shrink-0 rounded p-0.5 opacity-60 hover:opacity-100">
				<X size={14} />
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes slide-up {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-slide-up { animation: slide-up 0.2s ease-out; }
</style>