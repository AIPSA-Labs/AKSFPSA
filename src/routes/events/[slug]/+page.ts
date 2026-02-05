import type { PageLoad } from './$types';

type Event = {
	slug: string;
	title: string;
	date: string;
	location: string;
	type: string;
	description: string;
	details: string;
};

const events: Event[] = [
	{
		slug: "annual-leadership-meet-2026",
		title: "Annual Educational Leadership Meet 2026",
		date: "15 March 2026",
		location: "Ernakulam",
		type: "Conference",
		description:
			"Statewide conference focusing on governance alignment and institutional development.",
		details:
			"The annual leadership meet brings together school administrators and institutional representatives to discuss regulatory alignment, growth strategy, and collaborative initiatives for the upcoming academic year."
	},
	{
		slug: "district-coordinators-meet",
		title: "District Coordinators Meeting",
		date: "10 February 2026",
		location: "Kozhikode",
		type: "Meeting",
		description:
			"District-level review meeting for member institutions.",
		details:
			"This coordination meeting ensures alignment of district representatives with statewide policies and membership development strategies."
	},
	{
		slug: "teacher-certification-workshop",
		title: "Teacher Certification Workshop",
		date: "20 January 2026",
		location: "Thrissur",
		type: "Workshop",
		description:
			"Professional development workshop for faculty members.",
		details:
			"The workshop focuses on structured pedagogical enhancement, certification standards, and academic excellence frameworks."
	}
];

export const load: PageLoad = ({ params }) => {
	const event = events.find((e) => e.slug === params.slug);

	if (!event) {
		throw new Error("Event not found");
	}

	return { event };
};
