import { Modal, Tabs } from 'antd';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';
const ManageAccount = (props) => {
    const { isModalOpen, setIsModalOpen } = props;
    const items = [
        {
            key: 'info',
            label: 'Cập nhật thông tin',
            children: <UserInfo />,
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />,
        },
    ];
    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                width={'60vw'}
                //do not close when click outside
                maskClosable={false}
            >
                <Tabs defaultActiveKey="info" items={items} />
            </Modal>
        </>
    );
};

export default ManageAccount;
