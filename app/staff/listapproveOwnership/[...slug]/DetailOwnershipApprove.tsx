'use client';

import React, { Fragment, useState } from 'react';
import { format } from 'date-fns';
import { BsCheck2Circle } from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { MdOutlinePending } from 'react-icons/md';
import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Image } from 'antd';
import { useRouter } from 'next/navigation';
import { Button, Modal } from 'flowbite-react';
import dayjs from 'dayjs';

interface DetailOwnershipApproveProps {
  approveDetail: any;
}

const statusList = [
  {
    status: 'ACCEPTED',
    icon: BsCheck2Circle,
    color: '#2fde26',
  },
  {
    status: 'REJECTED',
    icon: BiBlock,
    color: '#e62538',
  },
  {
    status: 'PENDING',
    icon: MdOutlinePending,
    color: '#e06d14',
  },
];

const DetailOwnershipApprove: React.FC<DetailOwnershipApproveProps> = ({ approveDetail }) => {
  const [detail, setDetail] = useState(approveDetail);
  const axiosAuthClient = useAxiosAuthClient();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [statusValue, setStatusValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (status: string) => {
    setOpenModal(true);
    setStatusValue(status);
  };

  const handleOnChangeStatus = (propertyId: any, userId: any, roomId: any, value: any) => {
    const body = value;

    axiosAuthClient
      .put(
        `https://holiday-swap.click/api/co-owners/${approveDetail.id}?coOwnerStatus=${value}`,
        body
      )
      .then(async () => {
        toast.success('Update status success');
        // const newDetail = await axios.get(`https://holiday-swap.click/api/co-owners/${approveDetail.id}`);

        // if (newDetail) {
        //   setDetail(newDetail.data);
        // }

        // Redirect to /staff/listapproveOwnership after successful update
        router.push('/staff/listapproveOwnership');
      })
      .catch((response) => {
        toast.error(response.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        setOpenModal(false);
      });
  };
  return (
    <div>
      <div>
        <div>
          Staff {'> '}
          <span>
            List Approve Ownership {'>'} <span className="text-common">Detail</span>
          </span>
        </div>
      </div>
      <Image.PreviewGroup>
        <div className="grid grid-cols-2 mt-10 gap-5">
          <div className="w-full">
            <div className="flex flex-row gap-3">
              {detail.contractImages.length === 1 ? (
                <Fragment>
                  {detail.contractImages.map((item: any, index: number) => (
                    <Image
                      key={item.id}
                      src={item.link}
                      width="100%"
                      height={500}
                      alt="contract image"
                    />
                  ))}
                </Fragment>
              ) : (
                <Fragment>
                  {detail.contractImages.map((item: any, index: number) => (
                    <Image
                      key={item.id}
                      src={item.link}
                      width={200}
                      height={200}
                      alt="contract image"
                    />
                  ))}
                </Fragment>
              )}
              {}
            </div>
          </div>
          <div className="w-full sticky">
            <div className="flex flex-col gap-5 sticky top-36 w-full p-6 rounded-lg bg-gray-300">
              <div className="grid grid-cols-2">
                <div className="text-black mb-5">
                  Resort:{' '}
                  <span className="text-slate-600">
                    {approveDetail?.property.resort?.resortName}
                  </span>
                </div>
                <div className="text-black mb-5">
                  Property:{' '}
                  <span className="text-slate-600">{approveDetail?.property.propertyName}</span>
                </div>
                <div className="text-black">
                  User:{' '}
                  <span className="text-slate-600">
                    {detail?.user.fullName ? detail?.user.fullName : detail?.user.username}
                  </span>
                </div>
                <div className="text-black mb-5">
                  Apartment ID: <span className="text-slate-600">{detail.roomId}</span>
                </div>
                <div className="text-black">
                  Year next use:{' '}
                  <span className="text-slate-600">
                    {dayjs(detail.startTime).format('YYYY-MM-DD')}
                  </span>
                </div>
              </div>

              <div className="">
                <div className="text-black">
                  Type:{' '}
                  <span
                    className={`${
                      detail.type === 'RIGHT_TO_USE' ? ' text-orange-600' : 'text-green-600'
                    }`}
                  >
                    {detail.type === 'RIGHT_TO_USE'
                      ? 'Owner for a period of time'
                      : 'Owner forever'}
                  </span>
                </div>
              </div>

              {detail.type === 'RIGHT_TO_USE' && (
                <div className="grid grid-cols-2">
                  <div className="text-black">
                    Start time:{' '}
                    <span className="text-slate-600">
                      {format(new Date(detail.startTime), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="text-black">
                    End Time:{' '}
                    <span className="text-slate-600">
                      {format(new Date(detail.endTime), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              )}

              <div className="">
                <div className="text-black">
                  Week number:{' '}
                  <span className="text-slate-600">
                    {detail.timeFrames ? (
                      <Fragment>
                        {detail.timeFrames.map((item: any, index: number) => (
                          <Fragment key={index}>
                            {item.weekNumber}
                            {index !== detail.timeFrames.length - 1 && ', '}
                          </Fragment>
                        ))}
                      </Fragment>
                    ) : (
                      <span>Not have week ownership</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="">
                <div className="text-black">
                  Status:{' '}
                  <span
                    className={`${
                      detail.status === 'PENDING' ? ' text-orange-600' : 'text-green-600'
                    } ${detail.status === 'REJECTED' ? ' text-rose-600' : ''}`}
                  >
                    {(() => {
                      if (detail.status === 'ACCEPTED') {
                        return 'ACCEPTED';
                      } else if (detail.status === 'PENDING') {
                        return 'PENDING';
                      } else if (detail.status === 'REJECTED') {
                        return 'REJECTED';
                      }
                    })()}
                  </span>
                </div>
              </div>

              {detail.status !== 'ACCEPTED' && detail.status !== 'REJECTED' && (
                <div className="flex flex-end justify-end items-center gap-5">
                  <button
                    onClick={() => handleOpenModal('ACCEPTED')}
                    className="bg-common hover:bg-hover p-3 text-white text-center font-bold rounded-lg shadow-md"
                  >
                    ACCEPTED
                  </button>
                  <button
                    onClick={() => handleOpenModal('REJECTED')}
                    className="bg-rose-400 hover:bg-rose-500 p-3 text-white text-center font-bold rounded-lg shadow-md"
                  >
                    REJECTED
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Image.PreviewGroup>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Change status</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure want to change status
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            disabled={isLoading}
            color="blue"
            className="font-bold text-lg"
            onClick={() =>
              handleOnChangeStatus(
                detail.id.propertyId,
                detail.id.userId,
                detail.id.roomId,
                statusValue
              )
            }
          >
            Continue
          </Button>
          <Button color="gray" className="text-lg" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailOwnershipApprove;
