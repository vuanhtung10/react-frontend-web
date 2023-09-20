import { useState } from 'react';
import ViewOrder from './ViewOrder';
import ViewPayment from './ViewPayment';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Steps, Result } from 'antd';
// import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();

const OrderPage = (props) => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div className="order-container" style={{ maxWidth: 1440 }}>
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentStep}
                        status={'finish'}
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />}
                {currentStep === 1 && <ViewPayment setCurrentStep={setCurrentStep} />}
                {currentStep === 2 && (
                    <Result
                        icon={<SmileOutlined />}
                        title="Đơn hàng đã được đặt thành công!"
                        extra={<Button type="primary">Xem lịch sử</Button>}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderPage;
