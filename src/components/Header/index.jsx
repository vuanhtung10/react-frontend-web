import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import { callLogout } from '../../services/api';
import './header.scss';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';
import ManageAccount from '../Profile/ManageAccount';

const Header = (props) => {
    const { searchTerm, setSerchTerm } = props;

    const [openDrawer, setOpenDrawer] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const user = useSelector((state) => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const carts = useSelector((state) => state.order.carts);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };
    const handleOpenManageAccount = async () => {
        setIsModalOpen(true);
    };

    const items = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleOpenManageAccount()}>
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Trang quản trị </Link>,
            key: 'admin',
        });
    }
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className="pop-cart-body">
                <div className="pop-cart-content">
                    {carts?.map((book, index) => {
                        return (
                            <div className="book" key={`book-${index}`}>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`}
                                />
                                <div>{book?.detail?.mainText}</div>
                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                        book?.detail?.price || 0,
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="pop-cart-footer">
                    <div style={{ flex: 1 }}></div>
                    <Link className="btn-order-cart" to="/order">
                        Xem giỏ hàng
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div
                            className="page-header__toggle"
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>
                        <div className="page-header__logo">
                            <span className="logo">
                                <FaReact className="rotate icon-react" /> Hỏi Dân IT
                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input className="input-search" type={'text'} placeholder="Bạn tìm gì hôm nay" />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="bottom"
                                    rootClassName="popover-carts"
                                    title={'Sản phẩm mới thêm'}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge count={carts?.length ?? 0} size={'small'}>
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar} />
                                                {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>

            <ManageAccount isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <Drawer title="Menu chức năng" placement="left" onClose={() => setOpenDrawer(false)} open={openDrawer}>
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    );
};

export default Header;
