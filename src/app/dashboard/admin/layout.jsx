import { RequireRole } from '@/lib/cors/session';

const AdminLayout = async ({children}) => {
    await RequireRole("admin");
    return children
};

export default AdminLayout;