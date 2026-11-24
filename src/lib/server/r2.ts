//- Cloudflare R2 Storage Client
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
	CopyObjectCommand,
	ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

//- Default R2 configurations
const DEFAULT_ACCOUNT_ENDPOINT =
	'https://a92a0ada469655910cf527f8772111ae.r2.cloudflarestorage.com';
const DEFAULT_PUBLIC_URL = 'https://store.allkeralaprivateschools.org';
const DEFAULT_BUCKET = 'aksfpsa';

function getEndpoint(): string {
	const raw =
		env.R2_ENDPOINT ||
		(typeof process !== 'undefined' ? process.env?.R2_ENDPOINT : '') ||
		DEFAULT_ACCOUNT_ENDPOINT;
	if (!raw || raw.includes('store.allkeralaprivateschools.org')) {
		return DEFAULT_ACCOUNT_ENDPOINT;
	}
	let ep = raw.trim();
	if (!/^https?:\/\//i.test(ep)) {
		ep = `https://${ep}`;
	}
	return ep;
}

function getAccessKeyId(): string {
	return (
		env.R2_ACCESS_KEY_ID ||
		(typeof process !== 'undefined' ? process.env?.R2_ACCESS_KEY_ID : '') ||
		'9a9fb068193677dcd9b789bb074f83f2'
	);
}

function getSecretAccessKey(): string {
	return (
		env.R2_SECRET_ACCESS_KEY ||
		(typeof process !== 'undefined' ? process.env?.R2_SECRET_ACCESS_KEY : '') ||
		'93c75a1270e72a5381390d809279299c435960f58231e37ec847dfaae9ed5dd0'
	);
}

export function getBucket(): string {
	return (
		env.R2_BUCKET_NAME ||
		(typeof process !== 'undefined' ? process.env?.R2_BUCKET_NAME : '') ||
		DEFAULT_BUCKET
	);
}

export function getPublicUrl(key: string): string {
	const rawPublic =
		env.R2_PUBLIC_URL ||
		(typeof process !== 'undefined' ? process.env?.R2_PUBLIC_URL : '') ||
		DEFAULT_PUBLIC_URL;
	let base = rawPublic.trim().replace(/\/+$/, '');
	if (!/^https?:\/\//i.test(base)) {
		base = `https://${base}`;
	}
	return `${base}/${key}`;
}

let s3ClientInstance: S3Client | null = null;

function getClient(): S3Client {
	if (!s3ClientInstance) {
		s3ClientInstance = new S3Client({
			region: 'auto',
			endpoint: getEndpoint(),
			credentials: {
				accessKeyId: getAccessKeyId(),
				secretAccessKey: getSecretAccessKey()
			}
		});
	}
	return s3ClientInstance;
}

export const r2 = new Proxy({} as S3Client, {
	get(_target, prop, receiver) {
		const client = getClient();
		const value = Reflect.get(client, prop, receiver);
		if (typeof value === 'function') {
			return value.bind(client);
		}
		return value;
	}
});

export const BUCKET = DEFAULT_BUCKET;
export const PUBLIC_URL = DEFAULT_PUBLIC_URL;

export async function uploadFile(
	key: string,
	body: Buffer | Uint8Array | ReadableStream,
	contentType: string
) {
	await r2.send(
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
	const response = await r2.send(
		new GetObjectCommand({
			Bucket: getBucket(),
			Key: key
		})
	);
	return response;
}

export async function copyFile(sourceKey: string, destKey: string) {
	const bucket = getBucket();
	await r2.send(
		new CopyObjectCommand({
			Bucket: bucket,
			CopySource: `${bucket}/${sourceKey}`,
			Key: destKey
		})
	);
}

export async function deleteFile(key: string) {
	await r2.send(
		new DeleteObjectCommand({
			Bucket: getBucket(),
			Key: key
		})
	);
}

export async function listFiles(prefix?: string) {
	const response = await r2.send(
		new ListObjectsV2Command({
			Bucket: getBucket(),
			Prefix: prefix
		})
	);
	return response.Contents ?? [];
}
