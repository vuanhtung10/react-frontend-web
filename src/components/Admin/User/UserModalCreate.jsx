import React, { useState } from 'react';
import { Modal, notification, Form, Divider, message, Input } from 'antd';
import { callCreateAUser } from '../../../services/api';
const UserModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, password, email, phone } = values;
        setIsSubmit(true);
        const res = await callCreateAUser(fullName, password, email, phone);
        if (res && res.data) {
            message.success('Tạo mới user thành công');
            form.resetFields();

            setOpenModalCreate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: ' Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };
    // const showModal = () => {
    //   setOpen(true);
    // };
    // const handleOk = () => {
    //   setModalText('The modal will be closed after two seconds');
    //   setConfirmLoading(true);
    //   setTimeout(() => {
    //     setOpen(false);
    //     setConfirmLoading(false);
    //   }, 2000);
    // };
    // const handleCancel = () => {
    //   console.log('Clicked cancel button');
    //   setOpen(false);
    // };
    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => {
                    form.submit();
                }}
                confirmLoading={isSubmit}
                onCancel={() => {
                    setOpenModalCreate(false);
                }}
                okText={'Tạo mới'}
                cancelText={'Huỷ'}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Họ tên không được để trống',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Email không được để trống',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Password không được để trống',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Số điện thoại không được để trống',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserModalCreate;
