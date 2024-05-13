/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import {
  Avatar,
  Card,
  Carousel,
  Image,
  Rate,
  Tag,
  Button,
  Table,
  Space,
  Pagination,
  Popconfirm,
  Empty,
  Row,
  Col,
} from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import useCreatePublicTimeModal from '@/app/hooks/useCreatePublicTimeModal';
import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import GetApproveOwnershipById from '@/app/actions/getApproveOwnershipById';
import toast from 'react-hot-toast';
import { CloseCircleOutlined, ExportOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import ModalCoOwnerCalendar from '../modal/ModalCoOwnerCalendar';
import ModalViewImageContractCoOwner from '../modal/ModalViewImageContractCoOwner';
import getRatingByPropertyIdAndRoomId from '@/app/actions/getRatingByPropertyIdAndRoomId';
import GetAvailableTimeByCoOwnerId from '@/app/actions/getAvailableTimeByCoOwnerId';
import useAparmentReviewModal from '@/app/hooks/useApartmentReviewModal';
import { Tooltip } from 'flowbite-react';
import dayjs from 'dayjs';
import axios from 'axios';
import ModalBookingByCoOwnerId from '../modal/ModalBookingByCoOwnerId';

interface ManageApartmentProps {
  detailCoOwner: any;
  propertyDetail: any;
  slug: any;
}
interface IPagination {
  current: number;
  pageSize: number;
  total: number;
}

const ManageApartment: React.FC<ManageApartmentProps> = ({
  detailCoOwner,
  propertyDetail,
  slug,
}) => {
  const [detail, setDetail] = useState(detailCoOwner);
  const [availableTime, setAvailableTime] = useState<any>();
  const [rating, setRating] = useState({ content: [] });
  const [pageAvailableTime, setPageAvailableTime] = useState<IPagination>({
    current: 0,
    pageSize: 5,
    total: 0,
  });
  const [loadingTableAvailableTime, setLoadingTableAvailableTime] = useState<boolean>(false);
  const [weeksTimeFrame, setWeeksTimeFrame] = useState<number[]>([]);
  const [isOpenTimePublic, setIsOpenTimePublic] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [historyBookingByCoOwnerId, setHistoryBookingByCoOwnerId] = useState<any[]>([]);
  const createModalPublicTime = useCreatePublicTimeModal();
  const isCreated = createModalPublicTime.isCreated;
  const axiosAuthClient = useAxiosAuthClient();
  const apartmentReviewModal = useAparmentReviewModal();
  const fetchAvailableTimeByCoOwnerId = async () => {
    setLoadingTableAvailableTime(true);
    var rs = await GetAvailableTimeByCoOwnerId({
      coOwnerId: slug,
      pageNo: pageAvailableTime.current,
      pageSize: 5,
      sortDirection: 'asc',
      sortBy: 'startTime',
    });
    setLoadingTableAvailableTime(false);
    setAvailableTime(rs.content);
    setPageAvailableTime({ current: rs.number, pageSize: rs.size, total: rs.totalElements });
  };
  const fetchRatingByPropertyIdAndRoomId = async () => {
    var rs = await getRatingByPropertyIdAndRoomId({
      propertyId: detail.property.id,
      roomId: detail.roomId,
      // pageNo: pageAvailableTime.current,
      // pageSize: 5,
      // sortDirection: 'asc',
      // sortBy: 'id',
    });
    setRating(rs);
    // setPageAvailableTime({ current: rs.number, pageSize: rs.size, total: rs.totalElements });
  };
  useEffect(() => {
    let weeks: number[] = [];
    detailCoOwner.timeFrames.forEach((element: any) => {
      weeks.push(element.weekNumber);
    });
    weeks.sort(function (a, b) {
      return a - b;
    });
    setWeeksTimeFrame(weeks);
    fetchHistoryBookingByCoOwnerId();
  }, []);
  useEffect(() => {
    if (isCreated === true) {
      const getData = async () => {
        const detailCoOwner = await GetApproveOwnershipById({ slug });
        if (detailCoOwner) {
          setDetail(detailCoOwner.data);
          setWeeksTimeFrame(detailCoOwner.timeFrames);
          createModalPublicTime.onCreatedReset();
        }
      };
      getData();
    }
  }, [isCreated, createModalPublicTime]);
  useEffect(() => {
    fetchAvailableTimeByCoOwnerId();
    fetchRatingByPropertyIdAndRoomId();
  }, [JSON.stringify(pageAvailableTime.current)]);
  const confirm = (id: any) => {
    console.log(id);

    handleDeleteAvailableTime(id);
  };
  async function fetchHistoryBookingByCoOwnerId() {
    var rs = await axios.get(`https://holiday-swap.click/api/booking/co-owner/${slug}`);
    setHistoryBookingByCoOwnerId(rs.data);
  }
  const handleDeleteAvailableTime = (id: string) => {
    if (id) {
      axiosAuthClient
        .delete(`available-times/${id}`)
        .then(async () => {
          toast.success('Delete public time successfully!');
          fetchAvailableTimeByCoOwnerId();
        })
        .catch((response) => {
          toast.error(response.response.data.message);
        })
        .finally(() => {
          setOpenModal(false);
        });
    }
  };
  const columns = [
    // {
    //   title: 'Id',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: string) => {
        var date = dayjs(startTime);
        return <b>{date.format('YYYY-MM-DD')}</b>;
      },
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: string) => {
        var date = dayjs(endTime);
        return <b>{date.format('YYYY-MM-DD')}</b>;
      },
    },
    {
      title: 'Price/Night',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
    },
    {
      title: 'Status',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: string) => {
        var date = dayjs(endTime);
        return date > dayjs() ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Is active
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Expired
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="Delete public time"
            description="Are you sure to delete this public time?"
            onConfirm={() => confirm(record.id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Image.PreviewGroup>
        <div className="py-3">
          <div className="flex flex-row gap-3 w-full">
            <div className="w-full">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Card
                    title={
                      <Fragment>
                        <Tooltip content={detail.property.propertyName}>
                          <div className="truncate w-20">{detail.property.propertyName}</div>
                        </Tooltip>
                      </Fragment>
                    }
                    extra={
                      <Fragment>
                        <Tag color="success">{detail.status}</Tag>
                        <ModalViewImageContractCoOwner image={detail.contractImages} />
                      </Fragment>
                    }
                  >
                    <Carousel autoplay>
                      {detail.property.propertyImages.map((e: any, i: number) => (
                        <Image key={i} src={e.link} />
                      ))}
                    </Carousel>
                    <div className="">
                      <Card className="" bordered={false}>
                        Resort: {detail.property.resort.resortName}
                      </Card>
                    </div>
                    <div>
                      <Card className="-mt-[26px]" bordered={false}>
                        <div>
                          Type: <Tag>{detail.type}</Tag>
                        </div>
                        <div>
                          Start : <Tag>{new Date(detail.startTime).getFullYear()}</Tag>
                        </div>
                        {detail.type == 'RIGHT_TO_USE' && (
                          <div>
                            End : <Tag>{new Date(detail.endTime).getFullYear()}</Tag>
                          </div>
                        )}
                        <div>
                          Apartment Id:<Tag> {detail.roomId}</Tag>
                        </div>
                        <div>
                          Week Number:
                          <div className="grid grid-cols-7 items-center gap-2 mt-2">
                            {weeksTimeFrame.map((w: number, i: number) => (
                              <Tag className="-mr-[1px]" color="green" key={i}>
                                <div> {w}</div>
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card
                      title={'Review'}
                      bordered={false}
                      extra={
                        rating.content.length > 0 ? (
                          <Button
                            onClick={() => {
                              apartmentReviewModal.onOpen(rating, detailCoOwner.property);
                            }}
                            type="link"
                            icon={<ExportOutlined />}
                          >
                            View More
                          </Button>
                        ) : (
                          <></>
                        )
                      }
                    >
                      <div className="grid grid-cols-1 gap-2">
                        {rating.content.length > 0 ? (
                          rating.content.slice(0, 2).map((e: any, i: number) => {
                            return (
                              <div key={i}>
                                <Card style={{ marginTop: 8 }}>
                                  <Meta
                                    avatar={
                                      e.user.avatar ? (
                                        <Avatar src={e.user.avatar} size={20} />
                                      ) : (
                                        <Avatar icon={<UserOutlined />} size={20} />
                                      )
                                    }
                                    title={(() => {
                                      if (e.user.fullName) {
                                        return e.user.fullName;
                                      } else if (!e.user.fullName && e.user.username) {
                                        return e.user.username;
                                      } else if (!e.user.fullName && !e.user.username) {
                                        return e.user.email.split('@')[0];
                                      }
                                    })()}
                                    description={
                                      <Rate
                                        disabled
                                        defaultValue={e.rating}
                                        className="text-[7px]"
                                      />
                                    }
                                  />
                                  <div className="my-2">Review: {e.comment}</div>
                                </Card>
                              </div>
                            );
                          })
                        ) : (
                          <div>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </div>
                        )}
                      </div>
                    </Card>
                  </Card>
                </div>
                <div className="col-span-2">
                  <Card>
                    <Card
                      style={{ marginTop: 16 }}
                      title="My public"
                      extra={
                        <ModalCoOwnerCalendar
                          coOwnerId={slug}
                          coOwner={detail}
                          fetchAvailableTimeByCoOwnerId={fetchAvailableTimeByCoOwnerId}
                        />
                      }
                    >
                      <div className="grid justify-items-center">
                        <Table
                          dataSource={availableTime}
                          columns={columns}
                          pagination={false}
                          className="w-full"
                          loading={loadingTableAvailableTime}
                        />
                        {pageAvailableTime?.total != 0 && (
                          <Pagination
                            defaultCurrent={1}
                            defaultPageSize={5}
                            total={pageAvailableTime?.total}
                            current={pageAvailableTime?.current + 1}
                            onChange={(number) => {
                              setPageAvailableTime({
                                ...pageAvailableTime,
                                current: number - 1,
                              });
                            }}
                            className="pt-2"
                          />
                        )}
                      </div>
                    </Card>
                    {/* <Card title="Statistic" extra={<b>This year</b>}>
                      <div className="flex justify-between">
                        <Statistic
                          title="Booking"
                          value={11.28}
                          precision={2}
                          valueStyle={{ color: '#3f8600' }}
                          prefix={<ArrowUpOutlined />}
                          suffix="%"
                        />
                        <Statistic
                          title="Profit"
                          value={11.28}
                          precision={2}
                          valueStyle={{ color: '#3f8600' }}
                          prefix={<ArrowUpOutlined />}
                          suffix="%"
                        />
                        <Statistic
                          title="Booking"
                          value={11.28}
                          precision={2}
                          valueStyle={{ color: '#3f8600' }}
                          prefix={<ArrowUpOutlined />}
                          suffix="%"
                        />
                      </div>
                    </Card> */}
                    <Card
                      style={{ marginTop: 16 }}
                      title="Booking"
                      extra={
                        historyBookingByCoOwnerId.length != 0 && (
                          <ModalBookingByCoOwnerId
                            historyBookingByCoOwnerId={historyBookingByCoOwnerId}
                          />
                        )
                      }
                    >
                      {historyBookingByCoOwnerId.length == 0 && (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                      <Row gutter={14}>
                        {historyBookingByCoOwnerId.slice(0, 2).map((e: any, i: number) => {
                          const checkIn = dayjs(e.checkInDate);
                          const checkOut = dayjs(e.checkOutDate);
                          let tag = '';
                          if (e.status == 'PENDING') tag = 'default';
                          else if (e.status == 'ACCEPTED') tag = 'success';
                          else if (e.status == 'REJECTED') tag = 'error';
                          else if (e.status == 'CANCELLED') tag = 'error';
                          else if (e.status == 'EXPIRED') tag = 'error';
                          else if (e.status == 'SUCCESS') tag = 'success';
                          else if (e.status == 'FAILED') tag = 'error';
                          else if (e.status == 'WAITING_EXCHANGE') tag = 'warning';
                          return (
                            <Col span={12} key={i}>
                              <Card>
                                <Meta
                                  style={{ display: 'flex' }}
                                  avatar={
                                    e.user.avatar ? (
                                      <Avatar src={e.user.avatar} />
                                    ) : (
                                      <Avatar></Avatar>
                                    )
                                  }
                                  title={(() => {
                                    if (e.user.fullName) {
                                      return e.user.fullName;
                                    } else if (!e.user.fullName && e.user.username) {
                                      return e.user.username;
                                    } else if (!e.user.fullName && !e.user.username) {
                                      return e.user.email.split('@')[0];
                                    }
                                  })()}
                                />
                                <div className="flex justify-between my-1">
                                  <b>{'Price :' + e.actualPrice}</b>
                                  <Tag color={tag}>{e.status}</Tag>
                                </div>
                                <div className="my-2">
                                  <div className="flex justify-between">
                                    <Tag>Check-in: {checkIn.format('YYYY-MM-DD')}</Tag>
                                    <Tag>Check-out: {checkOut.format('YYYY-MM-DD')}</Tag>
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Card>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Image.PreviewGroup>
    </div>
  );
};

export default ManageApartment;
