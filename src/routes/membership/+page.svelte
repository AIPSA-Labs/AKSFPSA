<script lang="ts">
	type Category = {
		title: string;
		fee: string;
		description: string;
		features: string[];
	};

	const categories: Category[] = [
		{
			title: "Recognized Member Institution",
			fee: "₹5,000 (Annual)",
			description:
				"For institutions aligned with the association framework and actively participating in its initiatives.",
			features: [
				"Full representation privileges",
				"Access to all circulars and meetings",
				"Eligibility for training & certification programs",
				"Participation in financial partnership programs"
			]
		},
		{
			title: "Associate Member Institution",
			fee: "₹5,000 (Annual Renewal)",
			description:
				"For institutions seeking structured support and engagement with the association network.",
			features: [
				"Access to selected programs",
				"Participation in district-level events",
				"Upgrade option to recognized membership"
			]
		}
	];

    type FAQ = {
	question: string;
	answer: string;
};

const faqs: FAQ[] = [
	{
		question: "Who is eligible for membership?",
		answer:
			"Private self-financing educational institutions operating within Kerala are eligible to apply for membership under the association framework."
	},
	{
		question: "Is the membership fee refundable?",
		answer:
			"Membership contributions are non-refundable once the application has been reviewed and approved by the executive committee."
	},
	{
		question: "How long does the approval process take?",
		answer:
			"Applications are typically reviewed within 7–14 working days, subject to verification of submitted information."
	},
	{
		question: "Can membership be upgraded?",
		answer:
			"Yes. Associate member institutions may upgrade to recognized membership status upon fulfilling eligibility criteria."
	},
	{
		question: "Will members receive official certification?",
		answer:
			"Recognized member institutions receive formal association recognition documentation upon approval."
	}
];

let openIndex: number | null = null;

function toggle(index: number) {
	openIndex = openIndex === index ? null : index;
}

</script>

<section class="bg-background">
	<div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

		<div class="max-w-3xl">
			<p class="text-primary uppercase tracking-widest text-xs font-medium mb-4">
				Membership
			</p>

			<h1 class="text-4xl font-semibold text-primary">
				Join the Association
			</h1>

			<p class="mt-6 text-text-muted leading-relaxed">
				The association welcomes private educational institutions across Kerala
				to become part of a structured statewide network committed to institutional
				excellence and collaborative growth.
			</p>
		</div>

		<div class="mt-16 grid lg:grid-cols-2 gap-12">

			{#each categories as category}
				<div class="border border-border rounded-lg p-10 bg-surface">

					<h2 class="text-2xl font-semibold text-primary">
						{category.title}
					</h2>

					<p class="mt-4 text-lg font-medium text-primary">
						{category.fee}
					</p>

					<p class="mt-6 text-text-muted leading-relaxed">
						{category.description}
					</p>

					<ul class="mt-8 space-y-3 text-sm text-text-muted">
						{#each category.features as feature}
							<li>• {feature}</li>
						{/each}
					</ul>

				</div>
			{/each}

		</div>

		<div class="mt-20 border-t border-border pt-16">

			<h2 class="text-2xl font-semibold text-primary">
				Application Process
			</h2>

			<ol class="mt-8 space-y-6 text-text-muted">
				<li>
					<span class="font-medium text-primary">1.</span>
					Submit the online application form with institutional details.
				</li>
				<li>
					<span class="font-medium text-primary">2.</span>
					Application review by the executive committee.
				</li>
				<li>
					<span class="font-medium text-primary">3.</span>
					Approval confirmation and membership registration.
				</li>
			</ol>

			<div class="mt-12">
				<a
					href="/membership/apply"
					class="inline-block bg-primary text-white px-8 py-3 rounded-md font-medium tracking-wide hover:bg-primary-hover transition"
				>
					Apply for Membership
				</a>
			</div>

		</div>

	</div>
</section>

<section>
    <div class=" max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-border ">

	<h2 class="text-2xl font-semibold text-primary">
		Frequently Asked Questions
	</h2>

	<div class="mt-10 space-y-4">

		{#each faqs as faq, index}
			<div class="border border-border rounded-lg overflow-hidden">

				<button
					type="button"
					on:click={() => toggle(index)}
					class="w-full text-left p-6 flex justify-between items-center bg-surface hover:bg-background transition"
				>
					<span class="font-medium text-primary">
						{faq.question}
					</span>

					<span class="text-primary">
						{openIndex === index ? "−" : "+"}
					</span>
				</button>

				{#if openIndex === index}
					<div class="px-6 pb-6 text-text-muted leading-relaxed text-sm">
						{faq.answer}
					</div>
				{/if}

			</div>
		{/each}

	</div>

</div>

</section>