<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let error = $state('');

	onMount(() => {
		if (localStorage.getItem('aksfpsa_admin') === 'true') {
			goto('/admin');
		}
	});

	function handleLogin() {
		const u = import.meta.env.VITE_ADMIN_USER || 'admin';
		const p = import.meta.env.VITE_ADMIN_PASS || 'admin123';

		if (username === u && password === p) {
			localStorage.setItem('aksfpsa_admin', 'true');
			goto('/admin');
		} else {
			error = 'Invalid credentials';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
	<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
		<div class="mb-6 text-center">
			<h1 class="text-xl font-bold text-primary">AKSFPSA Admin</h1>
			<p class="mt-1 text-sm text-text-muted">Sign in to manage your site</p>
		</div>

		<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-5">
			<div>
				<label for="username" class="mb-1.5 block text-sm font-medium text-text">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
					placeholder="Enter username"
				/>
			</div>

			<div>
				<label for="password" class="mb-1.5 block text-sm font-medium text-text">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
					placeholder="Enter password"
				/>
			</div>

			{#if error}
				<p class="text-sm font-medium text-red-500">{error}</p>
			{/if}

			<button
				type="submit"
				class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
			>
				Sign In
			</button>
		</form>
	</div>
</div>
