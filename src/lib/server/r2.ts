import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

//- Initialize R2 client lazily to support build-time and runtime environments
let r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
	if (!r2Client) {
		const endpoint = env.R2_ENDPOINT || (typeof process !== 'undefined' ? process.env?.R2_ENDPOINT : '') || '';
		const accessKeyId = env.R2_ACCESS_KEY_ID || (typeof process !== 'undefined' ? process.env?.R2_ACCESS_KEY_ID : '') || '';
		const secretAccessKey = env.R2_SECRET_ACCESS_KEY || (typeof process !== 'undefined' ? process.env?.R2_SECRET_ACCESS_KEY : '') || '';

		r2Client = new S3Client({
			region: 'auto',
			endpoint,
			credentials: {
				accessKeyId,
				secretAccessKey
			}
		});
	}
	return r2Client;
}

export const r2 = new Proxy({} as S3Client, {
	get(_target, prop, receiver) {
		const client = getR2Client();
		const value = Reflect.get(client, prop, receiver);
		if (typeof value === 'function') {
			return value.bind(client);
		}
		return value;
	}
});

export function getBucket(): string {
	return env.R2_BUCKET_NAME || (typeof process !== 'undefined' ? process.env?.R2_BUCKET_NAME : '') || '';
}

export function getPublicUrl(key: string): string {
	const publicUrl = env.R2_PUBLIC_URL || (typeof process !== 'undefined' ? process.env?.R2_PUBLIC_URL : '') || '';
	const endpoint = env.R2_ENDPOINT || (typeof process !== 'undefined' ? process.env?.R2_ENDPOINT : '') || '';
	const bucket = getBucket();

	if (publicUrl) {
		let base = publicUrl.replace(/\/+$/, '');
		if (!/^https?:\/\//i.test(base)) {
			base = `https://${base}`;
		}
		return `${base}/${key}`;
	}
	return `${endpoint.replace(/\/+$/, '')}/${bucket}/${key}`;
}

export const BUCKET = '';
export const PUBLIC_URL = '';

export async function uploadFile(key: string, body: Buffer | Uint8Array | ReadableStream, contentType: string) {
	await getR2Client().send(
		new PutObjectCommand({
			Bucket: getBucket(),
			Key: key,
			Body: body,
			ContentType: contentType
		})
	);
	return getPublicUrl(key);
}

export async function getFile(key: string) {
	const response = await getR2Client().send(
		new GetObjectCommand({
			Bucket: getBucket(),
			Key: key
		})
	);
	return response;
}

export async function copyFile(sourceKey: string, destKey: string) {
	const bucket = getBucket();
	await getR2Client().send(
		new CopyObjectCommand({
			Bucket: bucket,
			CopySource: `${bucket}/${sourceKey}`,
			Key: destKey
		})
	);
}

export async function deleteFile(key: string) {
	await getR2Client().send(
		new DeleteObjectCommand({
			Bucket: getBucket(),
			Key: key
		})
	);
}

export async function listFiles(prefix?: string) {
	const response = await getR2Client().send(
		new ListObjectsV2Command({
			Bucket: getBucket(),
			Prefix: prefix
		})
	);
	return response.Contents ?? [];
}
