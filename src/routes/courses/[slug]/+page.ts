import type { PageLoad } from "./$types";

type Course = {
	slug: string;
	title: string;
	category: string;
	duration: string;
	durationISO: string;
	mode: string;
	fee: number;
	description: string;
	eligibility: string;
	startDate: string;
	outcomes: string[];
	level: string;
};

const courses: Course[] = [
	{
		slug: "school-governance",
		title: "School Administration & Governance",
		category: "Administrative",
		duration: "6 Weeks",
		durationISO: "P6W",
		mode: "Hybrid",
		fee: 8000,
		description:
			"Structured program focusing on institutional governance, compliance frameworks, and leadership systems.",
		eligibility:
			"School principals, administrators, and institutional management representatives.",
		startDate: "2026-04-10",
		level: "Professional",
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
		durationISO: "P8W",
		mode: "Offline",
		fee: 6000,
		description:
			"Certification initiative designed to enhance pedagogical skills and academic excellence.",
		eligibility:
			"Teachers employed in private self-financing institutions.",
		startDate: "2026-05-01",
		level: "Intermediate",
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

	const baseUrl = "https://yourdomain.com";

	const schema = {
		"@context": "https://schema.org",
		"@type": "Course",
		name: course.title,
		description: course.description,
		educationalLevel: course.level,
		timeRequired: course.durationISO,
		teaches: course.outcomes,
		provider: {
			"@type": "Organization",
			name: "All Kerala Self Financing Private Schools Association",
			url: baseUrl
		},
		audience: {
			"@type": "EducationalAudience",
			educationalRole: "administrator",
			description: course.eligibility
		},
		hasCourseInstance: {
			"@type": "CourseInstance",
			courseMode:
				course.mode === "Online"
					? "https://schema.org/OnlineOnly"
					: course.mode === "Offline"
					? "https://schema.org/OfflineEventAttendanceMode"
					: "https://schema.org/MixedEventAttendanceMode",
			startDate: course.startDate,
			location: {
				"@type": "Place",
				name: "Kerala",
				address: {
					"@type": "PostalAddress",
					addressRegion: "Kerala",
					addressCountry: "IN"
				}
			},
			offers: {
				"@type": "Offer",
				price: course.fee,
				priceCurrency: "INR",
				availability: "https://schema.org/InStock",
				url: `${baseUrl}/courses/${course.slug}`
			}
		}
	};

	return {
		course,
		meta: {
			title: `${course.title} | AKSFPSA Courses`,
			description: course.description
		},
		schema
	};
};
