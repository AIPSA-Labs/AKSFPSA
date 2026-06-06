export function getStoredTheme(): 'light' | 'dark' {
	if (typeof localStorage === 'undefined') return 'light';
	return (localStorage.getItem('aksfpsa_theme') as 'light' | 'dark') || 'light';
}

export function setTheme(theme: 'light' | 'dark') {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem('aksfpsa_theme', theme);
	if (theme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}

export function toggleTheme(): 'light' | 'dark' {
	const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
	setTheme(next);
	return next;
}
