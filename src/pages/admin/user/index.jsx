import { Row, Col, Card, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { callFetchDashboard } from '../../../services/api';
const Dashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
    });
    const initDashboard = async () => {
        const res = await callFetchDashboard();
        if (res && res.data) {
            setDataDashboard(res.data);
        }
    };
    useEffect(() => {
        initDashboard();
    }, []);

    const formatter = (value) => <CountUp end={value} seperator="," />;

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={[40, 40]}>
                <Col span={10}>
                    <Card title="" bordered={false}>
                        <Statistic title="Tổng Users" value={dataDashboard.countUser} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="" bordered={false}>
                        <Statistic title="Tổng đơn hàng" value={dataDashboard.countOrder} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default Dashboard;
