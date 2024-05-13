'use client';

import useExchange from '@/app/hooks/useExchange';
import { Avatar, Button, Layout, Table, TableColumnsType, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Exchange } from '@/app/actions/ExchangeApis';
import format from 'date-fns/format';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

const { Header, Content, Footer, Sider } = Layout;
const statusColors = {
  CONVERSATION: 'default',
  PRE_CONFIRMATION: 'processing',
  CONFIRMATION: 'success',
  SUCCESS: 'success',
  CANCEL: 'error',
};

interface ExpandedDataType {
  key: React.Key;
  name: string;
  resortName: string;
  property: string;
  apartmentId: string;
  arrivalDate: string;
  departureDate: string;
}

interface ExchangeListProps {
  initialItems?: Exchange[];
  currentUser?: Object | any | null;
}

const isValidDate = (date: any): date is dayjs.Dayjs | string | number[] =>
  dayjs.isDayjs(date) || typeof date === 'string' || (Array.isArray(date) && date.length === 3);

const ExchangeTable: React.FC<ExchangeListProps> = ({ initialItems, currentUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { exchangeId, isOpen } = useExchange();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    console.log(initialItems);
  }, []);

  const columns: TableColumnsType<Exchange> = [
    {
      width: '3rem',
      render: (_, record: Exchange) => (
        <Avatar src={`${record?.requestUser?.avatar ?? '/images/placeholder.jpg'}`} size="large" />
      ),
    },
    {
      title: 'Exchanger',
      dataIndex: 'exchanger',
      sortDirections: ['descend', 'ascend'],
      render: (_, record: Exchange) => record?.requestUser?.username?.toString() ?? '',
      sorter: (a, b) =>
        (a.requestUser?.username ?? '').localeCompare(b?.requestUser?.username ?? ''),
      onFilter: (value: string | number | boolean, record) =>
        record?.requestUser?.username?.startsWith(value?.toString() ?? '') ?? false,
      filterSearch: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sortDirections: ['descend', 'ascend'],
      render: (_, record: Exchange) => (
        <Tag color={statusColors[record?.overallStatus] || 'default'}>{record?.overallStatus}</Tag>
      ),
      sorter: (a, b) => a.overallStatus.toString().localeCompare(b.overallStatus.toString()),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (_, record: Exchange) => {
        const date = new Date(record?.createdOn as string);
        if (isNaN(date.getTime())) {
          return '--/--/----';
        }
        return date.toISOString().slice(0, 10);
      },
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) =>
        (a.createdOn ? new Date(a.createdOn).getTime() : 0) -
        (b.createdOn ? new Date(b.createdOn).getTime() : 0),
    },
    {
      title: 'Last Modified',
      dataIndex: 'dateModified',
      render: (_, record: Exchange) => {
        const date = new Date(record.lastModifiedOn as string);
        if (isNaN(date.getTime())) {
          return '--/--/----';
        }
        return date.toLocaleString().slice(0, 10);
      },
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) =>
        (a.lastModifiedOn ? new Date(a.lastModifiedOn).getTime() : 0) -
        (b.lastModifiedOn ? new Date(b.lastModifiedOn).getTime() : 0),
    },
    {
      title: 'Action',
      key: 'operation',
      render: (_, record: Exchange) => (
        <Link href={`/exchange/${record?.exchangeId}`} target="_blank">
          <Button type="link">Detail</Button>
        </Link>
      ),
    },
  ];

  const expandedRowRender = (
    record: any,
    expandedIndex: number,
    indent: number,
    expanded: boolean
  ) => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Resort', dataIndex: 'resortName', key: 'resortName' },
      { title: 'Property', dataIndex: 'property', key: 'property' },
      { title: 'Apartment', dataIndex: 'apartmentId', key: 'apartmentId' },
      { title: 'Arrival Date', dataIndex: 'arrivalDate', key: 'arrivalDate' },
      { title: 'Departure Date', dataIndex: 'departureDate', key: 'departureDate' },
    ];

    const data = [];
    for (let i = 0; i < 2; ++i) {
      data.push({
        key: i.toString(), // Add the 'key' property here
        name: i % 2 === 0 ? 'Your trip' : `${record?.requestUser?.username}'s trip`,
        resortName:
          i % 2 === 0
            ? record?.availableTime?.availableTime?.coOwner?.property?.resort?.resortName ?? ''
            : record?.requestAvailableTime?.availableTime?.coOwner?.property?.resort?.resortName ??
              '',
        property:
          i % 2 === 0
            ? record?.availableTime?.availableTime?.coOwner?.property?.propertyName ?? ''
            : record?.requestAvailableTime?.availableTime?.coOwner?.property?.propertyName ?? '',
        apartmentId:
          i % 2 === 0
            ? record?.availableTime?.availableTime?.coOwner?.roomId ?? ''
            : record?.requestAvailableTime?.availableTime?.coOwner?.roomId ?? '',
        arrivalDate:
          i % 2 === 0
            ? isValidDate(record?.checkInDate)
              ? format(dayjs(record?.checkInDate?.toString())?.toDate(), 'eeee, MMMM dd, yyyy')
              : '--/--/----'
            : isValidDate(record?.requestCheckInDate)
            ? format(
                dayjs(record?.requestCheckInDate?.toString())?.toDate() || new Date(),
                'eeee, MMMM dd, yyyy'
              )
            : '--/--/----',
        departureDate:
          i % 2 === 0
            ? isValidDate(record?.checkOutDate)
              ? format(dayjs(record?.checkOutDate?.toString())?.toDate(), 'eeee, MMMM dd, yyyy')
              : '--/--/----'
            : isValidDate(record?.requestCheckOutDate)
            ? format(
                dayjs(record?.requestCheckOutDate?.toString())?.toDate() || new Date(),
                'eeee, MMMM dd, yyyy'
              )
            : '--/--/----',
      });
    }

    return <Table columns={columns} dataSource={data ?? []} pagination={false} />;
  };
  const data = initialItems ?? [];

  return (
    <>
      {!isOpen && (
        <Table
          columns={columns}
          expandable={{ defaultExpandAllRows: true, expandedRowRender }}
          dataSource={data}
          size="middle"
        />
      )}
    </>
  );
};

export default ExchangeTable;
