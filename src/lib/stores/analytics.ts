const PREFIX = 'aksfpsa_analytics_';

export type PageView = {
	path: string;
	label: string;
	timestamp: number;
};

export type DailyStats = {
	date: string;
	count: number;
};

const LABEL_MAP: Record<string, string> = {
	'/': 'Home',
	'/about': 'About',
	'/blog': 'Blog',
	'/events': 'Events',
	'/gallery': 'Gallery',
	'/circulars': 'Circulars',
	'/courses': 'Courses',
	'/leadership': 'Leadership',
	'/members': 'Members',
	'/membership': 'Membership',
	'/contact': 'Contact',
	'/admin': 'Dashboard',
	'/admin/circulars': 'Circulars',
	'/admin/courses': 'Courses',
	'/admin/blog': 'Blog & Events',
	'/admin/gallery': 'Gallery',
	'/admin/files': 'Files',
	'/admin/leadership': 'Leadership',
	'/admin/members': 'Members',
	'/admin/faq': 'FAQ',
	'/admin/contact': 'Contact',
	'/admin/profile': 'Profile'
};

export function getViews(): PageView[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(PREFIX + 'page_views');
		return raw ? JSON.parse(raw) : [];
	} catch { return []; }
}

export function trackView(path: string) {
	if (typeof localStorage === 'undefined') return;
	if (path.startsWith('/admin/login')) return;
	const views = getViews();
	const label = Object.entries(LABEL_MAP).find(([k]) => path.startsWith(k))?.[1] || path;
	views.push({ path, label, timestamp: Date.now() });
	if (views.length > 5000) views.splice(0, views.length - 5000);
	localStorage.setItem(PREFIX + 'page_views', JSON.stringify(views));
}

export function getDailyStats(days: number = 30): DailyStats[] {
	const views = getViews();
	const cutoff = Date.now() - days * 86400000;
	const recent = views.filter((v) => v.timestamp >= cutoff);
	const map = new Map<string, number>();
	for (const v of recent) {
		const date = new Date(v.timestamp).toLocaleDateString('en-CA');
		map.set(date, (map.get(date) || 0) + 1);
	}
	const result: DailyStats[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(Date.now() - i * 86400000);
		const key = d.toLocaleDateString('en-CA');
		result.push({ date: key.slice(5), count: map.get(key) || 0 });
	}
	return result;
}

export function getPageBreakdown(): { label: string; count: number }[] {
	const views = getViews();
	const map = new Map<string, number>();
	for (const v of views) {
		const top = '/' + v.path.split('/').filter(Boolean)[0];
		const label = LABEL_MAP[top] || top || 'Home';
		map.set(label, (map.get(label) || 0) + 1);
	}
	return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

export function getTotalViews(): number {
	return getViews().length;
}

export function getTodayViews(): number {
	const today = new Date().toLocaleDateString('en-CA');
	return getViews().filter((v) => new Date(v.timestamp).toLocaleDateString('en-CA') === today).length;
}
