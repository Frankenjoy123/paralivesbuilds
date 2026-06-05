import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path } = await params;
    const key = path?.join('/') || '';

    if (!key) {
      return new Response('Not Found', { status: 404 });
    }

    const { env } = getCloudflareContext();
    const bucket = (env as any).IMAGES_BUCKET as any;
    if (!bucket) {
      return new Response('R2 not configured', { status: 500 });
    }

    const object = await bucket.get(key);
    if (!object) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    // Cache images aggressively at Cloudflare edge
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new Response(object.body as ReadableStream, { headers });
  } catch (e) {
    console.error('get image failed:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
