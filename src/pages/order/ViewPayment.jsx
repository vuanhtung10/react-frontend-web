import { useState, useEffect } from 'react';
import { Button, Form, Input, message, Radio, Col, Row, notification } from 'antd';
import { CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { callPlaceOrder } from '../../services/api';
import { doPlaceOrderAction } from '../../redux/order/orderSlice';

const ViewPayment = (props) => {
    const dispatch = useDispatch();
    const carts = useSelector((state) => state.order.carts);
    const user = useSelector((state) => state.account.user);
    const [totalPrice, setTotalPrice] = useState(0);
    const name = user.fullName;
    const phone = user.phone;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        console.log(values);
        setIsSubmit(true);
        const detailOrder = carts.map((item) => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id,
            };
        });
        const data = {
            name: values.name,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder,
        };
        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success('Đặt hàng thành công !');
            dispatch(doPlaceOrderAction());
            props.setCurrentStep(2);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        }
    }, [carts]);
    const { TextArea } = Input;

    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={16} xs={24} style={{ minHeight: 'calc(100vh - 250px)' }}>
                        {carts?.map((book, index) => {
                            const currentBookPrice = book?.detail?.price ?? 0;
                            return (
                                <div className="order-book" key={`book-order${index}`}>
                                    <div className="book-content">
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                                                book?.detail?.thumbnail
                                            }`}
                                        />
                                        <div className="title">{book.detail.mainText}</div>
                                        <div className="price">{currentBookPrice} ₫</div>
                                    </div>
                                    <div className="action">
                                        <div className="quantity">Số lượng: {book.quantity}</div>
                                        <div className="sum">
                                            Tổng tiền:
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(currentBookPrice * +book.quantity)}
                                        </div>
                                        <CheckCircleTwoTone />
                                    </div>
                                </div>
                            );
                        })}
                    </Col>

                    <Col md={8} xs={24} style={{ display: 'flex', background: '#fff', borderRadius: 5 }}>
                        <Form
                            form={form}
                            name="basic"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <div>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Họ tên"
                                    name="name"
                                    initialValue={name}
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
                                    label="Số điện thoại"
                                    name="phone"
                                    initialValue={phone}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Địa chỉ không được để trống',
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <p className="text text-normal" style={{ marginBottom: 15 }}>
                                    Hình thức thanh toán
                                </p>
                                <p className="text text-normal">
                                    <Radio checked={true} />
                                    Thanh toán khi nhận hàng
                                </p>
                                <p
                                    className="text text-normal"
                                    style={{
                                        marginTop: 100,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        Tổng tiền
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 30,
                                            marginRight: 20,
                                        }}
                                    >
                                        {totalPrice}
                                    </span>
                                </p>
                            </div>

                            <Button
                                type="primay"
                                htmlType="submit"
                                loading={isSubmit}
                                style={{ background: '#ee4d2d', color: '#fff', margin: '15px 0px' }}
                            >
                                Mua hàng ({carts.length ?? 0})
                            </Button>
                            {/* <button onClick={() => form.submit()} disabled={isSubmit}>
                                {isSubmit && (
                                    <span>
                                        <LoadingOutlined /> &nbsp;
                                    </span>
                                )}
                                Mua hàng ({carts.length ?? 0})
                            </button> */}
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ViewPayment;
