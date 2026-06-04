import { respData, respErr } from '@/shared/lib/resp';
import { getStyles } from '@/shared/models/style';

export async function POST() {
  try {
    const styles = await getStyles({ limit: 100 });
    return respData({ data: styles });
  } catch (e: any) {
    console.log('get styles failed:', e);
    return respErr(`get styles failed: ${e.message}`);
  }
}
