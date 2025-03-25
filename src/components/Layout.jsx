import { Outlet } from 'react-router'
import Header from '../components/Header'
import AdminStatus from '../components/admin/AdminStatus'
const Layout = () => {
    return (
        <div>
            <main className="xl:ml-100">
            <AdminStatus />
                <Outlet />
            </main>
            <Header />
        </div>
    );
};

export default Layout;