import { ExportOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tag, Table, Avatar } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';

const columns: ColumnsType<any> = [
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: (user) => (
      <div>
        {user.avatar ? <Avatar src={user.avatar} /> : <Avatar></Avatar>} {" "}

        {user.fullName ? user.fullName : user.username}
      </div>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'actualPrice',
    key: 'actualPrice',
    render: (actualPrice) => <>{actualPrice}</>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let tag = '';
      if (status == 'PENDING') tag = 'default';
      else if (status == 'ACCEPTED') tag = 'success';
      else if (status == 'REJECTED') tag = 'error';
      else if (status == 'CANCELLED') tag = 'error';
      else if (status == 'EXPIRED') tag = 'error';
      else if (status == 'SUCCESS') tag = 'success';
      else if (status == 'FAILED') tag = 'error';
      else if (status == 'WAITING_EXCHANGE') tag = 'warning';
      return <Tag color={tag}>{status}</Tag>;
    },
  },
  {
    title: 'Check In Date',
    dataIndex: 'checkInDate',
    key: 'checkInDate',
    render: (checkInDate) => {
      const checkIn = dayjs(checkInDate);
      return <Tag>{checkIn.format('YYYY-MM-DD')}</Tag>;
    },
  },
  {
    title: 'Check Out Date',
    dataIndex: 'checkOutDate',
    key: 'checkOutDate',
    render: (checkOutDate) => {
      const checkOut = dayjs(checkOutDate);
      return <Tag>{checkOut.format('YYYY-MM-DD')}</Tag>;
    },
  },
];
const ModalBookingByCoOwnerId = (props: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="link" onClick={showModal} icon={<ExportOutlined />}>
        View More
      </Button>
      <Modal
        title="History Booking"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={750}
        footer={false}
      >
        <Table
          columns={columns}
          dataSource={props.historyBookingByCoOwnerId}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </>
  );
};

export default ModalBookingByCoOwnerId;
