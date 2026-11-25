// - Shared TypeScript domain types for AKSFPSA

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
	id?: number;
	name: string;
	role: string;
	district?: string;
	image: string;
	group: 'office-bearers' | 'executive-members';
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

export type UploadedFile = {
	id: number;
	name: string;
	type: string;
	size: number;
	data: string;
	date: string;
};

export type FAQ = {
	id?: number;
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
