import { migrate } from './migrate';

async function main() {
	try {
		await migrate();
		console.log('Migration completed successfully');
	} catch (e) {
		console.error('Migration failed:', e);
	}
	process.exit(0);
}

main();
