import { Avatar, Button, Col, Form, Input, Row, message, Upload, notification } from 'antd';
import { AntDesignOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import './userInfo.scss';
import { callUpdateAvatar, callUpdateUserInfo } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doUploadAvatarAction, doUpdateUserInfoAction } from '../../redux/account/accountSlice';

const UserInfo = () => {
    const user = useSelector((state) => state.account.user);
    const [isSubmit, setIsSubmit] = useState(false);
    const urlAvatar = user?.avatar;
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [userAvatar, setUserAvatar] = useState(urlAvatar);

    const onFinish = async (values) => {
        console.log(values);
        const { fullName, phone, _id } = values;
        setIsSubmit(true);
        const res = await callUpdateUserInfo(_id, phone, fullName, userAvatar);
        if (res && res.data) {
            //update redux
            dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
            form.resetFields();
            message.success(`Cập nhật thông tin user thành công`);

            //force renew token
            localStorage.removeItem('access_token');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };
    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        console.log('file', file);
        const res = await callUpdateAvatar(file);
        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            // dispatch(doUploadAvatarAction({ avatar: newAvatar }));

            setUserAvatar(newAvatar);
            onSuccess('ok');
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };
    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            console.log('info', info);
            if (info.file.status === 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`Upload file thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload file thất bại `);
            }
        },
    };

    return (
        <div className="userInfo-container">
            <div className="avatar">
                <Avatar
                    size={200}
                    icon={<AntDesignOutlined />}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`}
                    shape="circle"
                />
                <div className="btn-upload">
                    <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                    </Upload>
                </div>
            </div>
            <div className="userInfo">
                <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item initialValue={user.id} hidden labelCol={{ span: 24 }} label="Id" name="_id">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item initialValue={user.email} labelCol={{ span: 24 }} label="Email" name="email">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên hiển thị"
                                initialValue={user.fullName}
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                initialValue={user.phone}
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Button
                            loading={isSubmit}
                            onClick={() => form.submit()}
                            size={'large'}
                            style={{ marginLeft: 7.5 }}
                        >
                            Cập nhật
                        </Button>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default UserInfo;
