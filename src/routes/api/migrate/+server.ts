import { migrate } from '$lib/server/migrate';

export async function GET() {
	try {
		await migrate();
		return new Response('Migration OK', { status: 200 });
	} catch (e) {
		return new Response(String(e), { status: 500 });
	}
}
