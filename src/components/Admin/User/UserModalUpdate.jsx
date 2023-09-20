import React, { useEffect, useState } from 'react';
import { Modal, notification, Form, Divider, message, Input } from 'antd';
import { callUpdateUser } from '../../../services/api';
const UserModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { fullName, _id, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success('Cập nhật user thành công');
            setOpenModalUpdate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: ' Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        console.log('dataUpdate', dataUpdate);
        if (dataUpdate) {
            form.setFieldsValue(dataUpdate);
        }
    }, [dataUpdate]);

    return (
        <>
            <Modal
                forceRender
                title="Thêm mới người dùng"
                open={openModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                confirmLoading={isSubmit}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText={'Cập nhật'}
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
                        hidden
                        labelCol={{ span: 24 }}
                        label="Id"
                        name="_id"
                        rules={[
                            {
                                required: true,
                                message: 'Vui long nhap Id',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
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
                        <Input disabled />
                    </Form.Item>

                    {/* <Form.Item
                        hidden
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
                    </Form.Item> */}
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

export default UserModalUpdate;
