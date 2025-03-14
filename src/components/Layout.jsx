import { Outlet } from 'react-router'
import Header from '../components/Header'
const Layout = () => {
    return (
        <div>
            <main>
                <Outlet />
            </main>
            <Header />
        </div>
    );
};

export default Layout;