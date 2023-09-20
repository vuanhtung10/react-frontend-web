import React, { useEffect, useState } from 'react';
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import TableUser from './components/Admin/User/UserTable';
import BookManage from './components/Admin/Book/BookTable';
import BookPage from './pages/book';
import HistoryPage from './pages/history';
import RegisterPage from './pages/register';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Footer from './components/Footer';
import { callFetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import OrderPage from './pages/order/';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import './styles/reset.scss';
import './styles/global.scss';

const Layout = () => {
    const [searchTerm, setSerchTerm] = useState('');
    return (
        <div className="layout-app">
            <Header searchTerm={searchTerm} setSerchTerm={setSerchTerm} />
            <Outlet context={[searchTerm, setSerchTerm]} />
            <Footer />
        </div>
    );
};
// const LayoutAdmin = () => {
//     const isAdminRoute = window.location.pathname.startsWith('/admin');
//     const user = useSelector((state) => state.account.user);
//     const userRole = user.role;
//     return (
//         <div className="layout-app">
//             {isAdminRoute && userRole === 'Admin' && <Header />}

//             <Outlet />

//             {isAdminRoute && userRole === 'Admin' && <Footer />}
//         </div>
//     );
// };
export default function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.account.isLoading);

    const getAccount = async () => {
        if (window.location.pathname === '/login' || window.location.pathname === '/register') return;

        const res = await callFetchAccount();
        console.log('check res: ', res);
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data));
        }
    };
    useEffect(() => {
        getAccount();
    }, []);
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <Home /> },
                {
                    path: 'contact',
                    element: <ContactPage />,
                },
                {
                    path: 'book/:slug',
                    element: <BookPage />,
                },
                {
                    path: 'order',
                    element: (
                        <ProtectedRoute>
                            <OrderPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'history',
                    element: (
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        {
            path: '/admin',
            element: <LayoutAdmin />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'user',
                    element: <TableUser />,
                },
                {
                    path: 'book',
                    element: <BookManage />,
                },
            ],
        },
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            path: '/register',
            element: <RegisterPage />,
        },
    ]);
    return (
        <>
            {isLoading === false ||
            window.location.pathname === '/login' ||
            window.location.pathname === '/register' ||
            window.location.pathname === '/' ? (
                <RouterProvider router={router} />
            ) : (
                <Loading />
            )}
        </>
    );
}
