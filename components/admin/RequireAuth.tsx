'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface RequireAuthProps {
  children: (user: User) => React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setChecked(true);
      if (!firebaseUser && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  if (!checked || !user) {
    return (
      <div className="py-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children(user)}</>;
}
