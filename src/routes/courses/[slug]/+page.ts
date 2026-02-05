import type { PageLoad } from './$types';

type Course = {
	slug: string;
	title: string;
	category: string;
	duration: string;
	mode: string;
	fee: string;
	description: string;
	eligibility: string;
	outcomes: string[];
};

const courses: Course[] = [
	{
		slug: "school-governance",
		title: "School Administration & Governance",
		category: "Administrative",
		duration: "6 Weeks",
		mode: "Hybrid",
		fee: "₹8,000",
		description:
			"Structured program focusing on institutional governance, compliance frameworks, and leadership systems.",
		eligibility:
			"School principals, administrators, and institutional management representatives.",
		outcomes: [
			"Understanding regulatory frameworks",
			"Developing governance structures",
			"Strategic planning and institutional growth",
			"Compliance and operational alignment"
		]
	},
	{
		slug: "teacher-certification",
		title: "Teacher Certification Program",
		category: "Professional Development",
		duration: "8 Weeks",
		mode: "Offline",
		fee: "₹6,000",
		description:
			"Certification initiative designed to enhance pedagogical skills and academic excellence.",
		eligibility:
			"Teachers employed in private self-financing institutions.",
		outcomes: [
			"Advanced classroom methodologies",
			"Student engagement techniques",
			"Curriculum planning strategies",
			"Assessment and evaluation systems"
		]
	}
];

export const load: PageLoad = ({ params }) => {
	const course = courses.find((c) => c.slug === params.slug);

	if (!course) {
		throw new Error("Course not found");
	}

	return { course };
};
