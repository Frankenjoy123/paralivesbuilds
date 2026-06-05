'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { defaultLocale } from '@/config/locale';

export default function AuthPopupPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const provider = searchParams.get('provider') || '';
  const triggered = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (!provider || triggered.current) return;
    triggered.current = true;

    const startOAuth = async () => {
      try {
        const callbackURL =
          locale !== defaultLocale
            ? `/${locale}/auth-callback`
            : '/auth-callback';
        const body = JSON.stringify({
          provider,
          callbackURL,
          disableRedirect: true,
        });

        console.log('[AuthPopup] POST /api/auth/sign-in/social', body);
        setDebugInfo('Sending request...');

        const res = await fetch('/api/auth/sign-in/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        console.log('[AuthPopup] Response status:', res.status);
        setDebugInfo(`Status: ${res.status}`);

        const data = await res.json();
        console.log('[AuthPopup] Response data:', data);
        setDebugInfo(`Status: ${res.status}, URL: ${data.url || 'none'}`);

        if (data.url) {
          window.location.href = data.url;
        } else if (data.error) {
          setError(data.error?.message || JSON.stringify(data.error));
        } else {
          setError('No redirect URL returned: ' + JSON.stringify(data));
        }
      } catch (err: any) {
        console.error('[AuthPopup] Fetch error:', err);
        setError(err?.message || 'Network error');
      }
    };

    startOAuth();
  }, [provider, locale]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 max-w-sm">
        <p className="text-destructive text-sm font-medium">{error}</p>
        <p className="text-muted-foreground text-xs">
          Provider: {provider || 'none'}
        </p>
        <p className="text-muted-foreground text-xs break-all">
          Debug: {debugInfo}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">
        Redirecting to {provider}...
      </p>
      <p className="text-muted-foreground text-xs">{debugInfo}</p>
    </div>
  );
}
