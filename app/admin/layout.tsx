import { redirect } from 'next/navigation';
import SiteChrome from '@/components/SiteChrome';
import AdminLayout from '@/components/admin/AdminLayout';
import { getSession } from '@/lib/auth/session';
import { getPathForTab } from '@/lib/routes';
import type { Role } from '@/lib/roles';

export default async function AdminRoutesLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect(getPathForTab('login'));

  return (
    <SiteChrome activeTab="admin">
      <AdminLayout user={{ email: session.email, role: session.role as Role }}>{children}</AdminLayout>
    </SiteChrome>
  );
}
