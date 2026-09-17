import { redirect } from 'next/navigation';
import SiteChrome from '@/components/SiteChrome';
import AdminLayout from '@/components/admin/AdminLayout';
import ForcePasswordChangeGate from '@/components/admin/ForcePasswordChangeGate';
import { getSession } from '@/lib/auth/session';
import { getMustChangePassword } from '@/lib/data/auth';
import { getPathForTab } from '@/lib/routes';
import { getChromeData } from '@/lib/chromeData';
import type { Role } from '@/lib/roles';

// Always render per-request — every admin page needs a live session (via
// cookies) anyway, so there's nothing to gain from build-time prerendering,
// and letting Next.js attempt it anyway caused build-time DB statement
// timeouts (too many parallel build workers hitting the DB at once).
export const dynamic = 'force-dynamic';

export default async function AdminRoutesLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect(getPathForTab('login'));
  const [chromeData, mustChangePassword] = await Promise.all([getChromeData(), getMustChangePassword(session.email)]);

  return (
    <SiteChrome activeTab="admin" {...chromeData}>
      {mustChangePassword ? (
        <ForcePasswordChangeGate />
      ) : (
        <AdminLayout user={{ email: session.email, role: session.role as Role }}>{children}</AdminLayout>
      )}
    </SiteChrome>
  );
}
