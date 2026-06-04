import { respData, respErr } from '@/shared/lib/resp';
import { findBuild, incrementBuildViews, BuildStatus } from '@/shared/models/build';
import { getBuildTags } from '@/shared/models/tag';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const build = await findBuild({ slug, status: BuildStatus.PUBLISHED });
    if (!build) {
      return respErr('build not found');
    }

    // Increment views
    await incrementBuildViews(build.id);

    // Get tags
    const tags = await getBuildTags(build.id);

    return respData({
      ...build,
      tags,
    });
  } catch (e: any) {
    console.log('get build detail failed:', e);
    return respErr(`get build detail failed: ${e.message}`);
  }
}
