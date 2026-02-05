<script lang="ts">
	type ContactForm = {
		name: string;
		institution: string;
		email: string;
		phone: string;
		message: string;
	};

	let form: ContactForm = {
		name: '',
		institution: '',
		email: '',
		phone: '',
		message: ''
	};

	function submit() {
		console.log(form);
	}
</script>

<section class="min-h-screen bg-background">
	<div class="mx-auto max-w-6xl px-6 py-20 lg:px-8">
		<h1 class="text-4xl font-semibold text-primary">Contact the Association</h1>

		<p class="mt-6 max-w-3xl text-text-muted">
			For membership inquiries, program details, or official communications, please contact the
			association office through the details below or submit the contact form.
		</p>

		<div class="mt-16 grid gap-16 lg:grid-cols-2">
			<div class="space-y-8">
				<div>
					<h2 class="text-xl font-semibold text-primary">Registered Office</h2>
					<p class="mt-4 text-text-muted">
						All Kerala Self Financing Private Schools Association<br />
						123 Institutional Road<br />
						Ernakulam, Kerala – 682001
					</p>
				</div>

				<div>
					<h2 class="text-xl font-semibold text-primary">Contact Details</h2>
					<p class="mt-4 text-text-muted">
						Email: info@association.org<br />
						Phone: +91 98765 43210
					</p>
				</div>

				<div>
					<h2 class="text-xl font-semibold text-primary">Office Hours</h2>
					<p class="mt-4 text-text-muted">
						Monday – Friday<br />
						10:00 AM – 5:00 PM
					</p>
				</div>
			</div>

			<div class="rounded-lg border border-border bg-surface p-10">
				<h2 class="text-xl font-semibold text-primary">Send a Message</h2>

				<div class="mt-8 space-y-6">
					<input
						type="text"
						placeholder="Full Name"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.name}
					/>

					<input
						type="text"
						placeholder="Institution Name"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.institution}
					/>

					<input
						type="email"
						placeholder="Email Address"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.email}
					/>

					<input
						type="tel"
						placeholder="Phone Number"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.phone}
					/>

					<textarea
						rows="4"
						placeholder="Your Message"
						class="w-full rounded-md border border-border bg-background px-4 py-3"
						bind:value={form.message}
					></textarea>

					<button
						type="button"
						on:click={submit}
						class="w-full rounded-md bg-primary px-6 py-3 font-medium tracking-wide text-white transition hover:bg-primary-hover"
					>
						Submit Inquiry
					</button>
				</div>
			</div>
		</div>

		<div class="mt-20 overflow-hidden rounded-lg border border-border">
			<iframe
				title=""
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1507.5822501474177!2d76.30302627427605!3d9.993683185252308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d3d1e2fdecb%3A0x61f8c1a773efbc14!2sAll%20Kerala%20Self%20Financing%20Private%20Schools%20Association!5e0!3m2!1sen!2sin!4v1770287268917!5m2!1sen!2sin"
				width="100%"
				height="300"
				style="border:0;"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</div>
</section>
