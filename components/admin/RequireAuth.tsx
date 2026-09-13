'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPathForTab } from '@/lib/routes';
import type { SessionUser } from '@/lib/auth/session';

interface RequireAuthProps {
  children: (user: SessionUser) => React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((current) => {
      if (!active) return;
      setUser(current);
      setChecked(true);
      if (!current) router.push(getPathForTab('login'));
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (!checked || !user) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children(user)}</>;
}
