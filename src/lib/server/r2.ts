import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } from '$env/static/private';

export const r2 = new S3Client({
	region: 'auto',
	endpoint: R2_ENDPOINT,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

export const BUCKET = R2_BUCKET_NAME;
export const PUBLIC_URL = R2_PUBLIC_URL;

export async function uploadFile(key: string, body: Buffer | Uint8Array | ReadableStream, contentType: string) {
	await r2.send(
		new PutObjectCommand({
			Bucket: BUCKET,
			Key: key,
			Body: body,
			ContentType: contentType
		})
	);
	return getPublicUrl(key);
}

export async function getFile(key: string) {
	const response = await r2.send(
		new GetObjectCommand({
			Bucket: BUCKET,
			Key: key
		})
	);
	return response;
}

export async function copyFile(sourceKey: string, destKey: string) {
	await r2.send(
		new CopyObjectCommand({
			Bucket: BUCKET,
			CopySource: `${BUCKET}/${sourceKey}`,
			Key: destKey
		})
	);
}

export async function deleteFile(key: string) {
	await r2.send(
		new DeleteObjectCommand({
			Bucket: BUCKET,
			Key: key
		})
	);
}

export async function listFiles(prefix?: string) {
	const response = await r2.send(
		new ListObjectsV2Command({
			Bucket: BUCKET,
			Prefix: prefix
		})
	);
	return response.Contents ?? [];
}

export function getPublicUrl(key: string) {
	if (PUBLIC_URL) {
		let base = PUBLIC_URL.replace(/\/+$/, '');
		if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
		return `${base}/${key}`;
	}
	return `${R2_ENDPOINT.replace(/\/+$/, '')}/${BUCKET}/${key}`;
}
