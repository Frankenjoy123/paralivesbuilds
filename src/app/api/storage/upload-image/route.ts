import { md5 } from '@/shared/lib/hash';
import { respData, respErr } from '@/shared/lib/resp';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const extFromMime = (mimeType: string) => {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
  };
  return map[mimeType] || '';
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    console.log('[API] Received files:', files.length);
    files.forEach((file, i) => {
      console.log(`[API] File ${i}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    });

    if (!files || files.length === 0) {
      return respErr('No files provided');
    }

    const { env } = getCloudflareContext();
    const bucket = (env as any).IMAGES_BUCKET as any;
    const uploadResults = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return respErr(`File ${file.name} is not an image`);
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const body = new Uint8Array(arrayBuffer);

      const digest = md5(body);
      const ext = extFromMime(file.type) || file.name.split('.').pop() || 'bin';
      const key = `uploads/${digest}.${ext}`;

      const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
      let url: string;

      if (bucket) {
        // Check if exists
        const existing = await bucket.head(key);
        if (existing) {
          url = imageDomain ? `${imageDomain}/${key}` : `/api/images/${key}`;
          uploadResults.push({
            url,
            key,
            filename: file.name,
            deduped: true,
          });
          continue;
        }

        // Upload to R2
        await bucket.put(key, body, {
          httpMetadata: {
            contentType: file.type,
            contentDisposition: 'inline',
          },
        });

        url = imageDomain ? `${imageDomain}/${key}` : `/api/images/${key}`;
        console.log('[API] R2 upload success:', key);
      } else {
        return respErr('Storage not configured');
      }

      uploadResults.push({
        url,
        key,
        filename: file.name,
        deduped: false,
      });
    }

    console.log(
      '[API] All uploads complete. Returning URLs:',
      uploadResults.map((r) => r.url)
    );

    return respData({
      urls: uploadResults.map((r) => r.url),
      results: uploadResults,
    });
  } catch (e) {
    console.error('upload image failed:', e);
    return respErr('upload image failed');
  }
}
