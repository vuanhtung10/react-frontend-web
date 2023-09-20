import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Popconfirm, notification, message } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteUser, callFetchListUser } from '../../../services/api';
import UserViewDetail from './UserViewDetail';
import UserModalCreate from './UserModalCreate';
import UserModalUpdate from './UserModalUpdate';
import * as XLSX from 'xlsx';
import {
    ExportOutlined,
    ImportOutlined,
    ReloadOutlined,
    PlusOutlined,
    EditTwoTone,
    DeleteTwoTone,
} from '@ant-design/icons';
import UserImport from './data/UserImport';

const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('');
    const [dataViewDetail, setDataViewDetail] = useState({});
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    useEffect(() => {
        fetchUser();
    }, [current, pageSize, sortQuery, filter]);

    const fetchUser = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchListUser(query);
        if (res && res.data) {
            if (res.data.result.length === 0 && current > 1) {
                let c = current - 1;
                setCurrent(c);
            }
            setListUser(res.data.result);
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
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                console.log(text, record, index);
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={'Xác nhận xoá User'}
                            description={'Bạn có chắc chắn muốn xoá user này ?'}
                            onConfirm={() => handleDeleteUser(record._id)}
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
        fetchUser(query);
    };

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        if (res && res.data) {
            message.success('xoá user thành công');
            fetchUser();
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
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');
            XLSX.writeFile(workbook, 'Danh sách user.csv');
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
                    <Button icon={<ImportOutlined />} type="primary" onClick={() => handleImportData()}>
                        Import
                    </Button>
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
                        dataSource={listUser}
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
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <UserModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            />
            <UserModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchUser={fetchUser}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <UserImport
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                fetchUser={fetchUser}
            />
        </>
    );
};

export default UserTable;
