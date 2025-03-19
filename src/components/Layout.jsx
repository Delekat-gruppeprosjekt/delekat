import { Outlet } from 'react-router'
import Header from '../components/Header'
const Layout = () => {
    return (
        <div>
            <main className="xl:ml-100">
                <Outlet />
            </main>
            <Header />
        </div>
    );
};

export default Layout;