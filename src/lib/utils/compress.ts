export function compressImage(file: File, maxDim = 1920, quality = 0.82): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.src = url;
		img.onload = () => {
			URL.revokeObjectURL(url);
			let { width, height } = img;
			if (width > maxDim || height > maxDim) {
				const ratio = Math.min(maxDim / width, maxDim / height);
				width = Math.round(width * ratio);
				height = Math.round(height * ratio);
			}
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d')!;
			ctx.drawImage(img, 0, 0, width, height);
			const targetMime = file.type === 'image/png' ? 'image/webp' : file.type;
			canvas.toBlob((blob) => {
				if (blob) return resolve(blob);
				// Fallback: try original format
				canvas.toBlob((blob2) => {
					if (blob2) resolve(blob2);
					else reject(new Error('Compression failed'));
				}, file.type, quality);
			}, targetMime, quality);
		};
		img.onerror = () => reject(new Error('Failed to load image'));
	});
}
