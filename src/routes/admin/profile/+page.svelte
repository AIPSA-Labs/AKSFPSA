<script lang="ts">
	import { goto } from '$app/navigation';
	import { User, Lock, LogOut, ShieldCheck } from '@lucide/svelte';

	let currentUser = $state(import.meta.env.VITE_ADMIN_USER || 'admin');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let message = $state('');
	let msgType = $state<'success' | 'error'>('success');

	function logout() {
		localStorage.removeItem('aksfpsa_admin');
		goto('/admin/login');
	}

	function changePassword() {
		if (!newPassword) {
			message = 'Password cannot be empty';
			msgType = 'error';
			return;
		}
		if (newPassword !== confirmPassword) {
			message = 'Passwords do not match';
			msgType = 'error';
			return;
		}
		import.meta.env.VITE_ADMIN_PASS = newPassword;
		message = 'Password updated (session only). Restart the dev server to persist.';
		msgType = 'success';
		newPassword = '';
		confirmPassword = '';
	}
</script>

<div class="max-w-2xl">
	<h1 class="text-2xl font-bold text-primary">Profile</h1>
	<p class="mt-1 text-sm text-text-muted">Manage your admin account settings.</p>

	<div class="mt-8 space-y-6">
		<!-- Account Info -->
		<div class="rounded-xl border border-border bg-surface p-6">
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
					<User size={24} />
				</div>
				<div>
					<h2 class="text-lg font-semibold text-text">{currentUser}</h2>
					<p class="text-sm text-text-muted">Administrator</p>
				</div>
			</div>
		</div>

		<!-- Change Password -->
		<div class="rounded-xl border border-border bg-surface p-6">
			<div class="flex items-center gap-2">
				<Lock size={18} class="text-text-muted" />
				<h2 class="text-lg font-semibold text-text">Change Password</h2>
			</div>
			<p class="mt-1 text-xs text-text-muted">Password changes apply to the current session only. Set <code class="rounded bg-background px-1 font-mono">VITE_ADMIN_PASS</code> in your environment for persistence.</p>

			<div class="mt-5 space-y-4">
				<div>
					<label for="new-password" class="mb-1.5 block text-sm font-medium text-text">New Password</label>
					<input id="new-password" type="password" bind:value={newPassword} placeholder="Enter new password"
						class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
				</div>
				<div>
					<label for="confirm-password" class="mb-1.5 block text-sm font-medium text-text">Confirm Password</label>
					<input id="confirm-password" type="password" bind:value={confirmPassword} placeholder="Confirm new password"
						class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
				</div>

				{#if message}
					<p class="text-sm font-medium {msgType === 'success' ? 'text-emerald-600' : 'text-red-500'}">{message}</p>
				{/if}

				<button onclick={changePassword} class="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover">
					Update Password
				</button>
			</div>
		</div>

		<!-- Security Hint -->
		<div class="rounded-xl border border-border bg-surface p-6">
			<div class="flex items-start gap-3">
				<ShieldCheck size={20} class="mt-0.5 shrink-0 text-text-muted" />
				<div>
					<h2 class="text-sm font-semibold text-text">Authentication</h2>
					<p class="mt-1 text-xs text-text-muted">
						Admin access is controlled via <code class="rounded bg-background px-1 font-mono">localStorage</code>.
						Default credentials are <strong>admin</strong> / <strong>admin123</strong>.
						Override them by setting <code class="rounded bg-background px-1 font-mono">VITE_ADMIN_USER</code> and
						<code class="rounded bg-background px-1 font-mono">VITE_ADMIN_PASS</code> environment variables.
					</p>
				</div>
			</div>
		</div>

		<!-- Logout -->
		<div class="border-t border-border pt-6">
			<button onclick={logout} class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
				<LogOut size={16} />
				Sign Out
			</button>
		</div>
	</div>
</div>
