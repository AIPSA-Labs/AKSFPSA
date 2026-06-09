const PREFIX = 'aksfpsa_';

export function getStore<T>(key: string, defaults: T): T {
	if (typeof localStorage === 'undefined') return defaults;
	try {
		const raw = localStorage.getItem(PREFIX + key);
		if (raw) return JSON.parse(raw) as T;
	} catch { /* ignore */ }
	return defaults;
}

export function setStore<T>(key: string, data: T): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(PREFIX + key, JSON.stringify(data));
}

export function removeStore(key: string): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(PREFIX + key);
}

export type Circular = {
	id: number;
	title: string;
	date: string;
	category: string;
	file: string;
	content?: string;
};

export type Course = {
	id: number;
	title: string;
	category: string;
	duration: string;
	mode: string;
	description: string;
	link: string;
	content?: string;
};

export type Event = {
	slug: string;
	title: string;
	date: string;
	location: string;
	type: string;
	description: string;
	content?: string;
};

export type GalleryImage = {
	id: number;
	src: string;
	alt: string;
};

export type GalleryAlbum = {
	id: number;
	slug: string;
	title: string;
	date: string;
	category: string;
	cover: string;
	description: string;
	images: GalleryImage[];
};

export type Leader = {
	name: string;
	role: string;
	district?: string;
	image: string;
	group: 'office-bearers' | 'executive-members';
};

export type MemberInstitution = {
	id: number;
	name: string;
	district: string;
	category: string;
	since: string;
};

export type MembershipPlan = {
	title: string;
	fee: string;
	description: string;
	features: string[];
};

export type Service = {
	id: number;
	title: string;
	description: string;
	icon: string;
	order: number;
	content?: string;
};

export const DEFAULT_SERVICES: Service[] = [
	{ id: 1, title: 'Coaching', description: 'AKSFPSA is your gateway to a successful future in Teaching Career. Start today to learn more.', icon: 'GraduationCap', order: 1 },
	{ id: 2, title: 'Smart School', description: 'The smart school is a project provided to improve quality of education through QIP (Quality Improvement Programme) for sustainable development.', icon: 'Monitor', order: 2 },
	{ id: 3, title: 'Courses', description: 'There are many courses for teachers and students. Teachers can join Cambridge Certified English Course, PG Certificate Program in digital education and more.', icon: 'BookOpen', order: 3 },
	{ id: 4, title: 'Digital Schooling', description: 'Digital India schooling program for beginners and schools. Free service of our Digital India schooling program.', icon: 'Globe', order: 4 },
	{ id: 5, title: 'Madrasa CBSE Rural Education Scheme', description: 'Special scheme integrating Madrasa education with CBSE curriculum for rural areas.', icon: 'School', order: 5 },
	{ id: 6, title: 'Scholarship Examination', description: 'Annual scholarship examination for school students to identify and nurture talent.', icon: 'Award', order: 6 }
];

export type UploadedFile = {
	id: number;
	name: string;
	type: string;
	size: number;
	data: string;
	date: string;
};

export const DEFAULT_FILES: UploadedFile[] = [];

export type FAQ = {
	question: string;
	answer: string;
};

export type ContactInfo = {
	address: string;
	email: string;
	phones: string[];
	hours: string;
};

export type ContactSubmission = {
	id: number;
	name: string;
	institution: string;
	email: string;
	phone: string;
	message: string;
	date: string;
	status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
	notes: string;
	source: string;
};

export type BlogPost = {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	author: string;
	date: string;
	status: 'draft' | 'published';
	cover: string;
	tags: string[];
	type: 'post' | 'event';
};

export const DEFAULT_CIRCULARS: Circular[] = [
	{ id: 1, title: 'Guidelines for Academic Year 2026–27', date: '12 January 2026', category: 'Administrative', file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
	{ id: 2, title: 'District-Level Coordination Meeting Notice', date: '28 December 2025', category: 'Meeting Notice', file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
	{ id: 3, title: 'Financial Partnership Update – Institutional Funding', date: '10 December 2025', category: 'Finance', file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
	{ id: 4, title: 'Teacher Certification Program Announcement', date: '25 November 2025', category: 'Training', file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

export const DEFAULT_COURSES: Course[] = [
	{ id: 1, title: 'School Administration & Governance', category: 'Administrative', duration: '6 Weeks', mode: 'Hybrid', description: 'Structured program focusing on institutional governance, compliance frameworks, and leadership systems.', link: '/courses/school-governance' },
	{ id: 2, title: 'Teacher Certification Program', category: 'Professional Development', duration: '8 Weeks', mode: 'Offline', description: 'Certification initiative designed to enhance pedagogical skills and academic excellence.', link: '/courses/teacher-certification' },
	{ id: 3, title: 'Financial Planning for Institutions', category: 'Finance', duration: '4 Weeks', mode: 'Online', description: 'Guidance on budgeting, regulatory compliance, and sustainable institutional growth models.', link: '/courses/financial-planning' },
	{ id: 4, title: 'Digital Infrastructure for Schools', category: 'Technology', duration: '5 Weeks', mode: 'Hybrid', description: 'Program covering digital transformation, administrative automation, and technology adoption.', link: '/courses/digital-infrastructure' }
];

export const DEFAULT_EVENTS: Event[] = [
	{ slug: 'annual-leadership-meet-2026', title: 'Annual Educational Leadership Meet 2026', date: '15 March 2026', location: 'Ernakulam', type: 'Conference', description: 'Statewide conference focusing on governance alignment and institutional development.' },
	{ slug: 'district-coordinators-meet', title: 'District Coordinators Meeting', date: '10 February 2026', location: 'Kozhikode', type: 'Meeting', description: 'District-level review meeting for member institutions.' },
	{ slug: 'teacher-certification-workshop', title: 'Teacher Certification Workshop', date: '20 January 2026', location: 'Thrissur', type: 'Workshop', description: 'Professional development workshop for faculty members.' }
];

export const DEFAULT_GALLERY_CATEGORIES: string[] = ['Conference', 'Meeting', 'Workshop'];

export const DEFAULT_ALBUMS: GalleryAlbum[] = [
	{ id: 1, slug: 'conference-2026', title: 'State-Level Educational Leadership Conference 2026', date: 'January 2026', category: 'Conference', cover: 'https://picsum.photos/seed/conference-cover/800/600', description: 'Statewide leadership conference focusing on institutional governance and policy alignment.', images: [
		{ id: 1, src: 'https://picsum.photos/seed/conference1/800/600', alt: 'Conference keynote session' },
		{ id: 2, src: 'https://picsum.photos/seed/conference2/800/600', alt: 'Panel discussion' },
		{ id: 3, src: 'https://picsum.photos/seed/conference3/800/600', alt: 'Group photo' },
		{ id: 4, src: 'https://picsum.photos/seed/conference4/800/600', alt: 'Networking session' }
	]},
	{ id: 2, slug: 'district-meet-malappuram', title: 'District Coordinators Meeting – Malappuram', date: 'December 2025', category: 'Meeting', cover: 'https://picsum.photos/seed/malappuram-cover/800/600', description: 'District-level administrative coordination and membership engagement session.', images: [
		{ id: 1, src: 'https://picsum.photos/seed/malappuram1/800/600', alt: 'Meeting opening' },
		{ id: 2, src: 'https://picsum.photos/seed/malappuram2/800/600', alt: 'District representatives' },
		{ id: 3, src: 'https://picsum.photos/seed/malappuram3/800/600', alt: 'Closing remarks' }
	]},
	{ id: 3, slug: 'teacher-certification-2025', title: 'Teacher Certification Program 2025', date: 'November 2025', category: 'Workshop', cover: 'https://picsum.photos/seed/certification-cover/800/600', description: 'Professional development initiative conducted for faculty members across member institutions.', images: [
		{ id: 1, src: 'https://picsum.photos/seed/certification1/800/600', alt: 'Workshop session' },
		{ id: 2, src: 'https://picsum.photos/seed/certification2/800/600', alt: 'Participants' }
	]}
];

export const DEFAULT_LEADERS: Leader[] = [
	{ name: 'Mr. John Mathew', role: 'President', district: 'Kozhikode', image: '', group: 'office-bearers' },
	{ name: 'Mrs. Anjali Nair', role: 'General Secretary', district: 'Malappuram', image: '', group: 'office-bearers' },
	{ name: 'Mr. Rahim Khan', role: 'Treasurer', district: 'Ernakulam', image: '', group: 'office-bearers' },
	{ name: 'Mr. Suresh Kumar', role: 'Joint Secretary', district: 'Thrissur', image: '', group: 'executive-members' },
	{ name: 'Mrs. Deepa Menon', role: 'Executive Member', district: 'Kannur', image: '', group: 'executive-members' },
	{ name: 'Mr. Faisal Ahmed', role: 'Executive Member', district: 'Palakkad', image: '', group: 'executive-members' },
	{ name: 'Mrs. Lakshmi Pillai', role: 'Executive Member', district: 'Kollam', image: '', group: 'executive-members' }
];

export const DEFAULT_MEMBERS: MemberInstitution[] = [
	{ id: 1, name: 'Green Valley Higher Secondary School', district: 'Kozhikode', category: 'Recognized', since: '2022' },
	{ id: 2, name: 'Al Noor Public School', district: 'Malappuram', category: 'Associate', since: '2023' },
	{ id: 3, name: 'St. Thomas Academy', district: 'Ernakulam', category: 'Recognized', since: '2021' },
	{ id: 4, name: 'Modern Scholars School', district: 'Thrissur', category: 'Recognized', since: '2024' }
];

export const DEFAULT_PLANS: MembershipPlan[] = [
	{ title: 'Recognized Member Institution', fee: '₹5,000 (Annual)', description: 'For institutions aligned with the association framework and actively participating in its initiatives.', features: ['Full representation privileges', 'Access to all circulars and meetings', 'Eligibility for training & certification programs', 'Participation in financial partnership programs'] },
	{ title: 'Associate Member Institution', fee: '₹5,000 (Annual Renewal)', description: 'For institutions seeking structured support and engagement with the association network.', features: ['Access to selected programs', 'Participation in district-level events', 'Upgrade option to recognized membership'] }
];

export const DEFAULT_FAQS: FAQ[] = [
	{ question: 'Who is eligible for membership?', answer: 'Private self-financing educational institutions operating within Kerala are eligible to apply for membership under the association framework.' },
	{ question: 'Is the membership fee refundable?', answer: 'Membership contributions are non-refundable once the application has been reviewed and approved by the executive committee.' },
	{ question: 'How long does the approval process take?', answer: 'Applications are typically reviewed within 7–14 working days, subject to verification of submitted information.' },
	{ question: 'Can membership be upgraded?', answer: 'Yes. Associate member institutions may upgrade to recognized membership status upon fulfilling eligibility criteria.' },
	{ question: 'Will members receive official certification?', answer: 'Recognized member institutions receive formal association recognition documentation upon approval.' }
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
	{
		id: 1,
		title: 'Teacher Certification Program – Applications Now Open',
		slug: 'teacher-certification-program-open',
		excerpt: 'Applications are now being accepted for the 2026 batch of the Teacher Certification Program.',
		content: '<h2>Empowering Educators</h2><p>We are pleased to announce that applications for the 2026 Teacher Certification Program are now open. This program is designed to enhance pedagogical skills, classroom management, and leadership capabilities for faculty members across member institutions.</p><h3>Program Details</h3><ul><li>Duration: 8 Weeks</li><li>Mode: Hybrid (online sessions + in-person workshops)</li><li>Certification: Recognized by the association</li></ul><p>Interested candidates should submit their applications through their respective institution coordinators.</p>',
		author: 'Training Committee',
		date: '5 February 2026',
		status: 'published',
		cover: '',
		tags: ['Training', 'Certification', 'Teachers'],
		type: 'post'
	},
	{
		id: 2,
		title: 'Annual Educational Leadership Meet 2026',
		slug: 'annual-leadership-meet-2026',
		excerpt: 'Statewide conference focusing on governance alignment and institutional development.',
		content: '<h2>A Successful Gathering</h2><p>The Annual Educational Leadership Meet 2026 brought together over 200 representatives from member institutions across all 14 districts of Kerala.</p><p>Key discussions focused on governance reform, digital transformation in school administration, and collaborative frameworks for institutional growth.</p><h3>Major Announcements</h3><ul><li>Launch of the Teacher Certification Program 2.0</li><li>New financial partnership models for member schools</li><li>District-level working groups for policy advocacy</li></ul><p>The annual leadership meet brings together school administrators and institutional representatives to discuss regulatory alignment, growth strategy, and collaborative initiatives for the upcoming academic year.</p>',
		author: 'AKSFPSA Office',
		date: '15 March 2026',
		status: 'published',
		cover: '',
		tags: ['Conference', 'Leadership', 'Governance'],
		type: 'event'
	},
	{
		id: 3,
		title: 'District Coordinators Meeting',
		slug: 'district-coordinators-meet',
		excerpt: 'District-level review meeting for member institutions.',
		content: '<p>This coordination meeting ensures alignment of district representatives with statewide policies and membership development strategies. All district coordinators are requested to attend.</p><h3>Agenda</h3><ul><li>Review of membership targets</li><li>Upcoming training programs</li><li>Feedback from member institutions</li><li>Planning for the next quarter</li></ul>',
		author: 'AKSFPSA Office',
		date: '10 February 2026',
		status: 'published',
		cover: '',
		tags: ['Meeting', 'Coordination'],
		type: 'event'
	}
];

export const DEFAULT_CONTACT_INFO: ContactInfo = {
	address: 'All Kerala Self Financing Private Schools Association\n123 Institutional Road\nErnakulam, Kerala – 682001',
	email: 'info@association.org',
	phones: ['+91 98765 43210'],
	hours: 'Monday – Friday\n10:00 AM – 5:00 PM'
};
