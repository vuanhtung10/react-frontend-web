import { Col, Divider, InputNumber, Row, Empty } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { doUpdateCartAction, doDeleteItemCartAction } from '../../redux/order/orderSlice';
import { useDispatch, useSelector } from 'react-redux';

const ViewOrder = (props) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const { currentStep, setCurrentStep } = props;
    const carts = useSelector((state) => state.order.carts);
    const dispatch = useDispatch();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);
    const handleOnchangeInput = (value, book) => {
        if (!value || value < 1) {
            return;
        }
        if (!isNaN(value)) {
            dispatch(
                doUpdateCartAction({
                    quantity: value,
                    detail: book,
                    _id: book._id,
                }),
            );
        }
    };
    const handleDeleteItemCart = (id) => {
        console.log(id);
        dispatch(
            doDeleteItemCartAction({
                _id: id,
            }),
        );
    };
    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    {carts.length > 0 ? (
                        <Col md={18} xs={24} style={{ minHeight: 'calc(100vh - 150px)' }}>
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
                                            <div className="quantity">
                                                <InputNumber
                                                    value={book.quantity}
                                                    onChange={(value) => handleOnchangeInput(value, book)}
                                                />
                                            </div>
                                            <div className="sum">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(currentBookPrice * +book.quantity)}
                                            </div>
                                            <DeleteOutlined
                                                style={{ color: 'red' }}
                                                onClick={() => handleDeleteItemCart(book._id)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </Col>
                    ) : (
                        <Col md={18} xs={24} style={{ minHeight: 'calc(100vh - 150px)', background: '#fff' }}>
                            <Empty />
                        </Col>
                    )}

                    <Col md={6} xs={24}>
                        <div className="order-sum">
                            <div className="calculate">
                                <span> Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: '10px 0' }} />
                            <div className="calculate">
                                <span> Tổng tiền</span>
                                <span className="sum-final">
                                    {' '}
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice || 0)}
                                </span>
                            </div>
                            <Divider style={{ margin: '10px 0' }} />
                            <button onClick={() => setCurrentStep(1)}>Mua Hàng ({carts?.length ?? 0})</button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ViewOrder;
