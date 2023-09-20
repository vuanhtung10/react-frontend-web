import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchHistory } from '../../services/api';
import ReactJson from 'react-json-view';
import moment from 'moment';
const historyPage = () => {
    const [listHistory, setListHistory] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const res = await callFetchHistory();
        console.log('res', res);
        if (res?.data.length > 0) {
            const data = res?.data.map((item, index) => {
                return {
                    key: `history-${index}`,
                    stt: index + 1,
                    createdAt: item.createdAt,
                    totalPrice: item.totalPrice,
                    tag: 'success',
                    detail: item.detail,
                };
            });
            setListHistory(data);
        }
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (text, record, index) => {
                console.log(text, record, index);
                return <span>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</span>;
            },
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
        },
        {
            title: 'Trạng thái',
            key: 'tag',
            dataIndex: 'tag',
            render: (_, { tag }) => (
                <>
                    <Tag color={'green'} key={tag}>
                        {tag}
                    </Tag>
                </>
            ),
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            render: (text, record, index) => {
                console.log(text, record, index);
                return <ReactJson displayDataTypes={false} name={'Chi tiết đơn mua'} src={record.detail} />;
            },
        },
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };
    return (
        <div style={{ maxWidth: 1440, margin: 'auto', minHeight: 'calc(100vh - 150px)' }}>
            <div>Lịch sử mua hàng</div>
            <Table
                onChange={onChange}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]} - {range[1]} trên {total} rows
                            </div>
                        );
                    },
                }}
                columns={columns}
                dataSource={listHistory}
            />
            ;
        </div>
    );
};
export default historyPage;
