import { getAuth } from '@/core/auth';

export async function getSessionUser(request: Request) {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) return null;
    return session.user;
  } catch {
    return null;
  }
}
