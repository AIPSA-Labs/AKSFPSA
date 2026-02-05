import type { PageLoad } from './$types';

type Album = {
	slug: string;
	title: string;
	date: string;
	images: string[];
};

const albums: Album[] = [
	{
		slug: "conference-2026",
		title: "State-Level Educational Leadership Conference 2026",
		date: "January 2026",
		images: [
			"/images/gallery/conference/1.jpg",
			"/images/gallery/conference/2.jpg",
			"/images/gallery/conference/3.jpg",
			"/images/gallery/conference/4.jpg"
		]
	},
	{
		slug: "district-meet-malappuram",
		title: "District Coordinators Meeting – Malappuram",
		date: "December 2025",
		images: [
			"/images/gallery/malappuram/1.jpg",
			"/images/gallery/malappuram/2.jpg",
			"/images/gallery/malappuram/3.jpg"
		]
	}
];

export const load: PageLoad = ({ params }) => {
	const album = albums.find((a) => a.slug === params.slug);

	if (!album) {
		throw new Error("Album not found");
	}

	return { album };
};
