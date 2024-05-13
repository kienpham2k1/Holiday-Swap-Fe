'use client';

import DropDownEditResort from '@/app/components/staff/DropDownEditResort';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import MapResort from '../MapResort';
import { RxRadiobutton } from 'react-icons/rx';
import { FiPhoneCall } from 'react-icons/fi';
import { BiMailSend } from 'react-icons/bi';
import { PiSquaresFourLight } from 'react-icons/pi';
import Link from 'next/link';
import { Drawer, DrawerProps } from 'antd';
import ViewFullImage from '@/app/components/apartment/ViewFullImage';
import useDeactiveResortModal from '@/app/hooks/useDeactiveResortModal';
import GetResortById from '@/app/actions/getResortById';
import useMaintanceResortModal from '@/app/hooks/useMaintanceResortModal';
import { format } from 'date-fns';
import Table, { ColumnsType } from 'antd/es/table';

interface EditResortProps {
  resortDetail: any;
  params: any;
}

interface DataType {
  key: React.Key;
  startDate: string;
  endDate: string;
  type: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    width: 150,
    render: (text, record) => {
      return <span>{format(new Date(text), 'dd/MM/yyyy')}</span>;
    },
  },
  {
    title: 'End date',
    dataIndex: 'endDate',
    width: 150,
    render: (text, record) => {
      return <span>{text === null ? '-' : format(new Date(text), 'dd/MM/yyyy')}</span>;
    },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 150,
    render: (text, record) => {
      const statusColor = record.type === 'DEACTIVATE' ? 'red' : 'orange';
      return <span style={{ color: statusColor }}>{text}</span>;
    },
  },
];

const EditResort: React.FC<EditResortProps> = ({ resortDetail, params }) => {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(resortDetail);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('bottom');
  const deactiveResortModal = useDeactiveResortModal();
  const maintanceResortModal = useMaintanceResortModal();
  const isSuccess = deactiveResortModal.isSuccess;
  const isSuccessMaintance = maintanceResortModal.isSuccess;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (isSuccess === true || isSuccessMaintance === true) {
        const newData = await GetResortById(params);
        console.log('check data', newData);
        if (newData) {
          setDetail(newData);

          if (isSuccess === true) {
            deactiveResortModal.onSuccessReset();
          } else if (isSuccessMaintance === true) {
            maintanceResortModal.onSuccessReset();
          }
        }
      }
    };
    fetchData();
  }, [isSuccess, isSuccessMaintance, params]);

  return (
    <Fragment>
      <div className="">
        <div className="flex-col">
          <div className="pb-6 w-full flex flex-row items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="pt-10  text-[40px]">{detail?.resortName}</div>
              <div className="flex flex-row items-center gap-1">
                <div className="font-bold text-[20px]">Address: </div>
                <div>{detail?.addressLine}</div>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className="font-bold text-[20px]">Property type: </div>
                <div>
                  {detail?.propertyTypes?.map((row: any, index: any) => (
                    <React.Fragment key={index}>
                      <span className="inline-block">{row.propertyTypeName}</span>
                      {index < detail?.propertyTypes?.length - 1 && <span>, </span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex flex-row  gap-1">
                <div className="font-bold text-[20px]">Amenity: </div>
                <div>
                  {detail?.resortAmenityTypes?.map((row: any, index: any) => (
                    <React.Fragment key={index}>
                      {row?.resortAmenities?.map((item: any, index: number) => (
                        <span key={index} className="inline-block">
                          {item.resortAmenityName}
                          {index < row.resortAmenities.length - 1 && <span>, </span>}{' '}
                        </span>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-row gap-1 items-center">
                <div className="font-bold text-[20px]">Status: </div>
                <div
                  className={`font-bold ${detail.status === 'ACTIVE' ? 'text-green-500' : ''} ${
                    detail.status === 'DEACTIVATE' ? 'text-rose-500' : ''
                  } ${detail.status === 'MAINTANCE' ? 'text-orange-500' : ''}`}
                >
                  {detail.status}
                </div>
              </div>
            </div>
            <div>
              <DropDownEditResort resortId={detail.id} resortStatus={detail.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full  gap-2 py-4 md:grid md:grid-cols-2 md:h-[55vh] lg:h-[60vh] md:gap-2 md:py-4  ">
        <div className=" w-full h-80  relative md:w-full md:rounded-l-xl md:h-96 md:relative md:overflow-hidden lg:w-full lg:h-auto lg:rounded-l-xl lg:relative lg:overflow-hidden xl:h-auto xl:w-full xl:rounded-l-xl xl:relative xl:overflow-hidden ">
          <Image
            onClick={showDrawer}
            key={detail.resortImages[0]?.id}
            alt="image"
            fill
            src={detail?.resortImages[0]?.link}
            className="w-[100%] md:object-cover md:h-full md:cursor-pointer lg:object-cover lg:h-full lg:cursor-pointer xl:object-cover xl:h-full xl:cursor-pointer"
          />
          <Link
            href="#"
            className="absolute bottom-2 right-2 flex flex-row  items-center gap-2 px-4 py-1 bg-white border border-black rounded-md cursor-pointer hover:bg-gray-200 md:hidden lg:hidden xl:hidden"
          >
            <PiSquaresFourLight size={25} onClick={showDrawer} />
            <button onClick={showDrawer}>View all image</button>
          </Link>
        </div>

        <div className="relative hidden md:block md:relative lg:block lg:relative xl:block xl:relative">
          <div className="hidden md:grid md:grid-cols-2 md:gap-2 md:rounded-r-xl lg:grid lg:grid-cols-2 lg:gap-2 lg:rounded-r-xl xl:grid xl:grid-cols-2 xl:gap-2 xl:rounded-r-xl">
            {detail.resortImages.slice(1, 5).map((item: any, index: number) => (
              <div
                key={item.id}
                className={`w-full md:h-[189px] lg:h-[220px] relative overflow-hidden  md:block ${
                  index === 1 ? 'rounded-tr-xl' : ''
                } ${index === 3 ? 'rounded-br-xl' : ''}`}
              >
                <Image
                  onClick={showDrawer}
                  key={item.id}
                  alt="image"
                  fill
                  src={item.link}
                  className="object-cover w-full cursor-pointer"
                />
              </div>
            ))}
          </div>
          <Link
            href="#"
            className="hidden xl:absolute xl:bottom-2 xl:right-2 xl:flex xl:flex-row  xl:items-center xl:gap-2 xl:px-4 xl:py-1 xl:bg-white xl:border xl:border-black xl:rounded-md xl:cursor-pointer xl:hover:bg-gray-200"
          >
            <PiSquaresFourLight size={25} onClick={showDrawer} />
            <button onClick={showDrawer}>View all image</button>
          </Link>
        </div>
      </div>

      <div className="pt-20">
        <div className="text-lg font-bold">Maintanance and deactive time</div>
        <Table
          columns={columns}
          dataSource={detail?.resortMaintainces}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 240 }}
        />
      </div>

      <div className="flex flex-col"></div>
      <div className="w-full h-[700px] pt-20 pb-3 rounded-lg ">
        <div className="text-xl font-bold pb-3">Address</div>
        <MapResort
          latitude={detail.latitude}
          id={detail.id}
          resortName={detail.resortName}
          longitude={detail.longitude}
        />
      </div>
      <div className="flex flex-row items-center mt-10">
        <div className=" w-full">
          <div className="text-[25px] py-[30px]">Detail</div>
          <div className="pr-[30px]">
            <div className="pb-[10px]">{detail.resortDescription}</div>
          </div>
          {/* 
          <div className="py-5 ">
            <div className="flex flex-row items-center  mb-[10px]">
              <RxRadiobutton className="mr-[10px]" />
              <div>View the City Walls</div>
            </div>
            <div className="flex flex-row items-center mb-[10px] ">
              <RxRadiobutton className="mr-[10px]" />
              <div>Hiking in the forest</div>
            </div>
            <div className="flex flex-row items-center mb-[10px] ">
              <RxRadiobutton className="mr-[10px]" />
              <div>Discover the famous view point “The Lark”</div>
            </div>
            <div className="flex flex-row items-center mb-[10px] ">
              <RxRadiobutton className="mr-[10px]" />
              <div>Sunset on the cruise</div>
            </div>
          </div> */}
          <div className="h-[0.5px] bg-gray-300 mb-[20px] mr-[430px]"></div>
        </div>
        <div className="flex flex-col">
          <div className="w-[387px] h-auto bg-white border border-black rounded-lg flex flex-col justify-center mb-[40px]">
            <div className="ml-[40px] text-[30px] pt-3 pb-2">Need help?</div>
            <div className="ml-[40px]">
              <div className="flex flex-row items-center py-[20px]">
                <FiPhoneCall size={25} className="mr-[10px]" />
                085659778
              </div>
              <div className="flex flex-row items-center pb-[10px]">
                <BiMailSend size={25} className="mr-[10px]" />
                Holidayswap@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer placement={placement} width={500} onClose={onClose} open={open}>
        <ViewFullImage listImage={detail.resortImages} />
      </Drawer>
    </Fragment>
  );
};

export default EditResort;
