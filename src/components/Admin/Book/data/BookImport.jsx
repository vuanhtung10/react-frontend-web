import { message, notification, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Table, Modal, Descriptions } from 'antd';
import { callBulkCreateUser } from '../../../../services/api';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import templateFile from './templateFile.xlsx?url';

const { Dragger } = Upload;

const UserImport = (props) => {
    const { setOpenModalImport, openModalImport } = props;
    const [dataExcel, setDataExcel] = useState([]);
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 1000);
    };
    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        customRequest: dummyRequest,
        onChange(info) {
            console.log('check info', info);
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(e.target.result);
                        let workbook = XLSX.read(data, { type: 'array' });
                        // find the name of your sheet in the workbook first
                        let sheet = workbook.Sheets[workbook.SheetNames[0]];

                        // convert to json format
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1, // skip header row
                        });
                        console.log('json', json);
                        if (json && json.length > 0) {
                            return setDataExcel(json);
                        }
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async () => {
        const data = dataExcel.map((item) => {
            item.password = '123456';
            return item;
        });
        const res = await callBulkCreateUser(data);
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: 'Upload thành công',
            });
            setDataExcel([]);
            setOpenModalImport(false);
            props.fetchUser();
        } else {
            notification.error({
                description: res.message,
                message: 'Đã có lỗi xảy ra',
            });
        }
    };
    return (
        <>
            <Modal
                title="Import data user"
                width={'50vw'}
                open={openModalImport}
                onOk={handleSubmit}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataExcel([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataExcel.length < 1,
                }}
                maskClosable={false}
            >
                <Dragger {...propsUpload}>
                    <div style={{ paddingTop: 20 }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or
                            other banned files.
                        </p>
                        &nbsp;{' '}
                        <a onClick={(e) => e.stopPropagation()} href={templateFile} download id="download">
                            Tải file mẫu
                        </a>
                        <Table
                            rowKey={(record) => record.__rowNum__}
                            dataSource={dataExcel}
                            title={() => <span>Dữ liệu upload:</span>}
                            columns={[
                                { dataIndex: 'fullName', title: 'Tên hiển thị' },
                                { dataIndex: 'email', title: 'Email' },
                                { dataIndex: 'phone', title: 'Số điện thoại' },
                            ]}
                        />
                    </div>
                </Dragger>
            </Modal>
        </>
    );
};

export default UserImport;
