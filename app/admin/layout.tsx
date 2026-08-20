import AdminSiteChrome from '@/components/admin/AdminSiteChrome';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSiteChrome>
      <AdminLayout>{children}</AdminLayout>
    </AdminSiteChrome>
  );
}
