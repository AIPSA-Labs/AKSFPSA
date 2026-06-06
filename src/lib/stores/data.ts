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
};

export type Course = {
	id: number;
	title: string;
	category: string;
	duration: string;
	mode: string;
	description: string;
	link: string;
};

export type Event = {
	slug: string;
	title: string;
	date: string;
	location: string;
	type: string;
	description: string;
};

export type Album = {
	slug: string;
	title: string;
	date: string;
	cover: string;
	description: string;
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

export type FAQ = {
	question: string;
	answer: string;
};

export type ContactInfo = {
	address: string;
	email: string;
	phone: string;
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
};

export const DEFAULT_CIRCULARS: Circular[] = [
	{ id: 1, title: 'Guidelines for Academic Year 2026–27', date: '12 January 2026', category: 'Administrative', file: '/documents/circular1.pdf' },
	{ id: 2, title: 'District-Level Coordination Meeting Notice', date: '28 December 2025', category: 'Meeting Notice', file: '/documents/circular2.pdf' },
	{ id: 3, title: 'Financial Partnership Update – Institutional Funding', date: '10 December 2025', category: 'Finance', file: '/documents/circular3.pdf' },
	{ id: 4, title: 'Teacher Certification Program Announcement', date: '25 November 2025', category: 'Training', file: '/documents/circular4.pdf' }
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

export const DEFAULT_ALBUMS: Album[] = [
	{ slug: 'conference-2026', title: 'State-Level Educational Leadership Conference 2026', date: 'January 2026', cover: '/images/gallery/conference-cover.jpg', description: 'Statewide leadership conference focusing on institutional governance and policy alignment.' },
	{ slug: 'district-meet-malappuram', title: 'District Coordinators Meeting – Malappuram', date: 'December 2025', cover: '/images/gallery/malappuram-cover.jpg', description: 'District-level administrative coordination and membership engagement session.' },
	{ slug: 'teacher-certification-2025', title: 'Teacher Certification Program 2025', date: 'November 2025', cover: '/images/gallery/certification-cover.jpg', description: 'Professional development initiative conducted for faculty members across member institutions.' }
];

export const DEFAULT_LEADERS: Leader[] = [
	{ name: 'Mr. John Mathew', role: 'President', district: 'Kozhikode', image: '/images/president.jpg', group: 'office-bearers' },
	{ name: 'Mrs. Anjali Nair', role: 'General Secretary', district: 'Malappuram', image: '/images/secretary.jpg', group: 'office-bearers' },
	{ name: 'Mr. Rahim Khan', role: 'Treasurer', district: 'Ernakulam', image: '/images/treasurer.jpg', group: 'office-bearers' },
	{ name: 'Mr. Suresh Kumar', role: 'Joint Secretary', district: 'Thrissur', image: '/images/member1.jpg', group: 'executive-members' },
	{ name: 'Mrs. Deepa Menon', role: 'Executive Member', district: 'Kannur', image: '/images/member2.jpg', group: 'executive-members' },
	{ name: 'Mr. Faisal Ahmed', role: 'Executive Member', district: 'Palakkad', image: '/images/member3.jpg', group: 'executive-members' },
	{ name: 'Mrs. Lakshmi Pillai', role: 'Executive Member', district: 'Kollam', image: '/images/member4.jpg', group: 'executive-members' }
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
		title: 'Annual Leadership Conference 2026 – Key Takeaways',
		slug: 'annual-leadership-conference-2026',
		excerpt: 'Highlights and outcomes from the statewide educational leadership conference held in Ernakulam.',
		content: '<h2>A Successful Gathering</h2><p>The Annual Educational Leadership Meet 2026 brought together over 200 representatives from member institutions across all 14 districts of Kerala.</p><p>Key discussions focused on governance reform, digital transformation in school administration, and collaborative frameworks for institutional growth.</p><h3>Major Announcements</h3><ul><li>Launch of the Teacher Certification Program 2.0</li><li>New financial partnership models for member schools</li><li>District-level working groups for policy advocacy</li></ul><p>We look forward to building on this momentum throughout the year.</p>',
		author: 'AKSFPSA Office',
		date: '20 March 2026',
		status: 'published',
		cover: '',
		tags: ['Conference', 'Leadership', 'Governance']
	},
	{
		id: 2,
		title: 'Teacher Certification Program – Applications Now Open',
		slug: 'teacher-certification-program-open',
		excerpt: 'Applications are now being accepted for the 2026 batch of the Teacher Certification Program.',
		content: '<h2>Empowering Educators</h2><p>We are pleased to announce that applications for the 2026 Teacher Certification Program are now open. This program is designed to enhance pedagogical skills, classroom management, and leadership capabilities for faculty members across member institutions.</p><h3>Program Details</h3><ul><li>Duration: 8 Weeks</li><li>Mode: Hybrid (online sessions + in-person workshops)</li><li>Certification: Recognized by the association</li></ul><p>Interested candidates should submit their applications through their respective institution coordinators.</p>',
		author: 'Training Committee',
		date: '5 February 2026',
		status: 'published',
		cover: '',
		tags: ['Training', 'Certification', 'Teachers']
	}
];

export const DEFAULT_CONTACT_INFO: ContactInfo = {
	address: 'All Kerala Self Financing Private Schools Association\n123 Institutional Road\nErnakulam, Kerala – 682001',
	email: 'info@association.org',
	phone: '+91 98765 43210',
	hours: 'Monday – Friday\n10:00 AM – 5:00 PM'
};
