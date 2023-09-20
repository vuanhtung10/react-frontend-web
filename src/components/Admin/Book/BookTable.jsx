import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, notification, message } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteBook, callFetchListBook } from '../../../services/api';
import BookViewDetail from './BookViewDetail';
import BookModalCreate from './BookModalCreate';
import BookModalUpdate from './BookModalUpdate';
import * as XLSX from 'xlsx';
import moment from 'moment';
import {
    ExportOutlined,
    ImportOutlined,
    ReloadOutlined,
    PlusOutlined,
    EditTwoTone,
    DeleteTwoTone,
} from '@ant-design/icons';
// import BookImport from './data/BookImport';

const BookTable = () => {
    const [listBook, setlistBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('sort=-updatedAt');
    const [dataViewDetail, setDataViewDetail] = useState({});
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery, filter]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchListBook(query);
        if (res && res.data) {
            if (res.data.result.length === 0 && current > 1) {
                let c = current - 1;
                setCurrent(c);
            }
            res.data.result;
            setlistBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                console.log(text, record, index);
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setDataViewDetail(record);
                            setOpenViewDetail(true);
                        }}
                    >
                        {record._id}
                    </a>
                );
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (text, record, index) => {
                console.log(text, record, index);
                return (
                    <span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}
                    </span>
                );
            },
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: (text, record, index) => {
                console.log(text, record, index);
                return <span>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</span>;
            },
            sorter: true,
        },

        {
            title: 'Action',
            width: '150px',
            render: (text, record, index) => {
                console.log(text, record, index);
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={'Xác nhận xoá Book'}
                            description={'Bạn có chắc chắn muốn xoá book này ?'}
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText={'Xác nhận'}
                            cancelText={'Huỷ'}
                        >
                            <span style={{ cursor: 'pointer', margin: '0 20px' }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f " />
                            </span>
                        </Popconfirm>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cusor: 'pointer' }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(record);
                            }}
                        />
                    </>
                );
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
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (query) => {
        fetchBook(query);
    };

    const handleDeleteBook = async (userId) => {
        const res = await callDeleteBook(userId);
        if (res && res.data) {
            message.success('xoá book thành công');
            fetchBook();
        } else {
            notification.error({
                message: 'có lỗi xảy ra',
                description: res.message,
            });
        }
    };
    const handleImportData = () => {
        setOpenModalImport(true);
    };
    const handleExportData = () => {
        if (listBook.length > 0) {
            let b = listBook.map((item) => {
                return {
                    'Tên sách': item.mainText,
                    'Tác giả': item.author,
                    'Thẻ loại': item.category,
                    Giá: item.price,
                };
            });
            const worksheet = XLSX.utils.json_to_sheet(b);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
            XLSX.writeFile(workbook, 'Danh sách book.csv');
        }
    };
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span> Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button icon={<ExportOutlined />} type="primary" onClick={() => handleExportData()}>
                        Export
                    </Button>
                    {/* <Button icon={<ImportOutlined />} type="primary" onClick={() => handleImportData()}>
                        Import
                    </Button> */}
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalCreate(true)}>
                        Thêm mới
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        type="ghost"
                        onClick={() => {
                            setFilter('');
                            setSortQuery('');
                        }}
                    ></Button>
                </span>
            </div>
        );
    };

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        className="def"
                        isLoading={isLoading}
                        columns={columns}
                        dataSource={listBook}
                        onChange={onChange}
                        rowKey="_id"
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
                    />
                </Col>
            </Row>
            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <BookModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchBook={fetchBook}
            />
            <BookModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchBook={fetchBook}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            {/* <BookImport
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                fetchBook={fetchBook}
            /> */}
        </>
    );
};

export default BookTable;
