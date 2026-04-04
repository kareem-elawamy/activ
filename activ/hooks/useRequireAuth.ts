'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Redirects unauthenticated users to /{locale}/auth.
 * Returns { isAuthenticated, isChecking } so pages can
 * show a loading state while the check runs.
 */
export function useRequireAuth() {
  const pathname = usePathname();
  const router   = useRouter();
  const [isChecking,      setIsChecking]      = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Derive locale from pathname (/ar/... or /en/...)
      const locale = pathname?.startsWith('/ar') ? 'ar' : 'en';
      router.replace(`/${locale}/auth`);
    } else {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, [pathname, router]);

  return { isAuthenticated, isChecking };
}
