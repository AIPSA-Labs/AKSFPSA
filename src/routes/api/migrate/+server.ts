import { migrate } from '$lib/server/migrate';
import { listFiles, copyFile, deleteFile } from '$lib/server/r2';

export async function GET({ url }) {
	const fixR2 = url.searchParams.has('r2');

	if (fixR2) {
		try {
			const OLD_PREFIX = 'aksfpsa/';
			const objects = await listFiles(OLD_PREFIX);
			let moved = 0;
			let errors = 0;

			for (const obj of objects) {
				if (!obj.Key) continue;
				const newKey = obj.Key.slice(OLD_PREFIX.length);
				try {
					await copyFile(obj.Key, newKey);
					await deleteFile(obj.Key);
					moved++;
				} catch (e) {
					errors++;
					console.error(`Failed to move ${obj.Key}:`, e);
				}
			}

			return new Response(`R2 migration complete: ${moved} moved, ${errors} errors`, {
				status: errors > 0 && moved === 0 ? 500 : 200
			});
		} catch (e) {
			return new Response(String(e), { status: 500 });
		}
	}

	try {
		await migrate();
		return new Response('Migration OK', { status: 200 });
	} catch (e) {
		return new Response(String(e), { status: 500 });
	}
}
