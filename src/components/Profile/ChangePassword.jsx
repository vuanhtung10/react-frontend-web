import { Button, Col, Form, Input, Row, notification, message } from 'antd';
import React, { useState } from 'react';
import { callUpdatePassword } from '../../services/api';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useSelector((state) => state.account.user);
    const onFinish = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);
        const res = await callUpdatePassword(email, oldpass, newpass);
        if (res && res.data) {
            message.success(`Cập nhật mật khẩu thành công`);
            form.setFieldValue('oldpass', '');
            form.setFieldValue('newpass', '');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };
    return (
        <>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                style={{ marginLeft: 50, paddingBottom: 30 }}
            >
                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: '' }]}
                        initialValue={user.email}
                    >
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật khẩu hiện tại"
                        name="oldpass"
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật khẩu mới"
                        name="newpass"
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu mới!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Button loading={isSubmit} onClick={() => form.submit()} size={'large'}>
                    Xác nhận
                </Button>
            </Form>
        </>
    );
};

export default ChangePassword;
