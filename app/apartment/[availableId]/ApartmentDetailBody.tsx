'use client';

import useAparmentAmenitiesModal from '@/app/hooks/useApartmentAmenitiesModal';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';
import CalendarAparment from '../CalendarAparment';
import { differenceInDays, format } from 'date-fns';
import GoogleMapReact from 'google-map-react-concurrent';
import { useDateRange } from '../DateRangeContext';
import CalendarAparmentBody from '../CalendarAparmentBody';

import { Avatar, Rate, Typography } from 'antd';
import { AiFillStar } from 'react-icons/ai';
import { BsShieldFillCheck } from 'react-icons/bs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConversationApis from '@/app/actions/ConversationApis';
import useLoginModal from '@/app/hooks/useLoginModal';
import useExchangeApartmentModal from '@/app/hooks/useExchangeApartmentModal';

const { Text } = Typography;

interface ApartmentDetailBodyProps {
  apartment?: any;
  dateRange: any;
  dateOut: any;
  handleChangeDateRange: (value: any) => void;
  dateRangeDefault: any;
  rating: any;
  currentUser: any;
  ownershipUser: any;
}

const ApartmentDetailBody: React.FC<ApartmentDetailBodyProps> = ({
  apartment,
  dateRange,
  dateOut,
  handleChangeDateRange,
  dateRangeDefault,
  rating,
  currentUser,
  ownershipUser,
}) => {
  const apartmentAmenitiesModal = useAparmentAmenitiesModal();
  const exchangeApartmentModal = useExchangeApartmentModal();
  const [totalPrice, setTotalPrice] = useState(0);
  const {
    dateRangeContext,
    setDateRangeContext,
    dateRangeDefaultContext,
    setDateRangeDefaultContext,
  } = useDateRange();

  const calculateNightDifference = (startDate: any, endDate: any) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nightDifference = differenceInDays(end, start);
    return nightDifference;
  };
  const loginModal = useLoginModal();
  const handleContactOwner = (ownerId: string) => {
    ConversationApis.getContactWithOwner(ownerId)
      .then((res) => {
        console.log('Check response', res);
        res?.conversationId && router.push(`/chat/${res.conversationId}`);
      })
      .catch((err) => {
        ConversationApis.createCurrentUserConversation(ownerId)
          .then((res) => {
            router.push(`/chat/${res.conversationId}`);
          })
          .catch((err) => {
            loginModal.onOpen();
            console.log(err);
          });
      });
  };

  const handleExchangeApartment = () => {
    if (currentUser && ownershipUser) {
      exchangeApartmentModal.onOpen(
        ownershipUser,
        apartment?.availableTime.id,
        currentUser,
        apartment?.availableTime?.coOwner?.user?.userId?.toString()
      );
    } else {
      loginModal.onOpen();
    }
  };

  const router = useRouter();

  return (
    <div className="w-full pb-4 flex flex-col">
      {/* Information of host */}
      <div className="flex flex-row  gap-2 border-b border-gray-400 pb-8  items-center">
        <Image
          src={apartment.availableTime.coOwner.user.avatar || '/images/placeholder.jpg'}
          alt="Avatar"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
        <div className="text-bold text-lg text-black">
          Owner by{' '}
          {apartment.availableTime.coOwner.user.fullName
            ? apartment.availableTime.coOwner.user.fullName
            : apartment.availableTime.coOwner.user.username}
        </div>
      </div>
      {/* Room host by */}
      <div className="flex flex-row  gap-5 border-b border-gray-400 pb-8 pt-8 ">
        <div className="px-1 py-3 gap-2 border border-gray-500 rounded-lg flex flex-col items-center justify-center  md:px-3 md:py-5 md:gap-2 md:border md:border-gray-500 md:rounded-lg md:flex md:flex-row md:items-center md:justify-center  lg:p-6 lg:gap-2 lg:border lg:border-gray-500 lg:rounded-lg lg:flex lg:flex-row lg:items-center lg:justify-center  xl:p-6 xl:gap-2 xl:border xl:border-gray-500 xl:rounded-lg xl:flex xl:flex-row xl:items-center xl:justify-center">
          <Image src="/images/icons/bed-room.png" alt="icon" width={25} height={25} />
          <div className="text-center">
            {apartment.availableTime.coOwner.property.numberKingBeds +
              apartment.availableTime.coOwner.property.numberQueenBeds +
              apartment.availableTime.coOwner.property.numberSingleBeds +
              apartment.availableTime.coOwner.property.numberDoubleBeds +
              apartment.availableTime.coOwner.property.numberTwinBeds +
              apartment.availableTime.coOwner.property.numberFullBeds +
              apartment.availableTime.coOwner.property.numberSofaBeds +
              apartment.availableTime.coOwner.property.numberMurphyBeds}{' '}
            beds
          </div>
        </div>

        <div className="px-1 py-3 gap-2 border border-gray-500 rounded-lg flex flex-col items-center justify-center  md:px-3 md:py-5 md:gap-2 md:border md:border-gray-500 md:rounded-lg md:flex md:flex-row md:items-center md:justify-center  lg:p-6 lg:gap-2 lg:border lg:border-gray-500 lg:rounded-lg lg:flex lg:flex-row lg:items-center lg:justify-center  xl:p-6 xl:gap-2 xl:border xl:border-gray-500 xl:rounded-lg xl:flex xl:flex-row xl:items-center xl:justify-center">
          <Image src="/images/icons/bath-room.png" alt="icon" width={25} height={25} />
          <div className="text-center">Private bath room</div>
        </div>
      </div>

      {/* Second section */}

      <div className="flex flex-col py-8 border-b border-gray-500">
        <div className="flex flex-row gap-8 py-5">
          <Image src="/images/icons/bed-room.png" alt="icon" width={40} height={25} />
          <div className="flex flex-col h-[50px] md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col">
            <div className="font-bold text-lg">Room in a rental unit</div>
            <div className="text-gray-600 text-base font-normal">
              Your own room in a home, plus access to shared spaces.
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-8 py-5">
          <Image src="/images/icons/bed-room.png" alt="icon" width={40} height={25} />
          <div className="flex flex-col h-[50px] md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col">
            <div className="font-bold text-lg">Self check-in</div>
            <div className="text-gray-600 text-base font-normal">
              Check yourself in with the lockbox.
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-8 py-5">
          <Image src="/images/icons/bed-room.png" alt="icon" width={40} height={25} />
          <div className="flex flex-col h-[50px] md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col">
            <div className="font-bold text-lg">Edouard is a Superhost</div>
            <div className="text-gray-600 text-base font-normal">
              Superhosts are experienced, highly rated Hosts.
            </div>
          </div>
        </div>
      </div>

      {/* Where your will sleep */}
      <div className="flex flex-col py-8 border-b border-gray-500">
        <div className="text-2xl font-bold py-5">Where you&apos;ll sleep</div>
        <div className="flex flex-col py-3 px-4 items-center justify-start rounded-lg border border-gray-500 w-[20vh] md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col ">
          <Image src="/images/icons/bed-room.png" alt="icon" width={40} height={25} />

          <div className="">
            <div className="font-bold text-center">Bedroom</div>
            <div className="text-center">
              {apartment.availableTime.coOwner.property.numberKingBeds +
                apartment.availableTime.coOwner.property.numberQueenBeds +
                apartment.availableTime.coOwner.property.numberSingleBeds +
                apartment.availableTime.coOwner.property.numberDoubleBeds +
                apartment.availableTime.coOwner.property.numberTwinBeds +
                apartment.availableTime.coOwner.property.numberFullBeds +
                apartment.availableTime.coOwner.property.numberSofaBeds +
                apartment.availableTime.coOwner.property.numberMurphyBeds}{' '}
              beds
            </div>
          </div>
        </div>
      </div>

      {/* What this place offers */}
      <div className="flex flex-col py-8 border-b border-gray-500">
        <div className="text-2xl font-bold py-5">What this place offers</div>
        <div className="grid grid-cols-2 gap-5">
          {apartment.availableTime.coOwner.property.inRoomAmenityType != null ? (
            apartment.availableTime.coOwner.property.inRoomAmenityType[0].inRoomAmenities
              .slice(0, 10)
              .map((item: any) => (
                <div key={item.id} className="flex flex-row gap-4 items-center">
                  <Image src={item.inRoomAmenityLinkIcon} alt="icon" width={30} height={30} />
                  <div>{item.inRoomAmenityName}</div>
                </div>
              ))
          ) : (
            <></>
          )}
        </div>

        <div
          onClick={() => apartmentAmenitiesModal.onOpen(apartment.availableTime.coOwner)}
          className="py-4"
        >
          <button className="py-3 px-4 border border-gray-500 rounded-lg w-48 text-center hover:bg-blue-gray-100 hover:cursor-pointer transition-all duration-300 transform active:scale-95">
            Show all aminities
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex flex-col py-8 border-b border-gray-500">
        <div className="py-8">
          <div className="text-base italic font-bold text-gray-500">
            The date you select on this calendar is used for both booking and apartment exchange
          </div>
          <div className="text-2xl font-bold">
            {' '}
            {dateRangeContext && (
              <Fragment>
                {calculateNightDifference(
                  dateRangeContext?.startDate,
                  dateRangeContext?.endDate
                ) === 0
                  ? 'Select checkout date'
                  : `${
                      calculateNightDifference(
                        dateRangeContext?.startDate,
                        dateRangeContext?.endDate
                      ) === 1
                        ? `${calculateNightDifference(
                            dateRangeContext?.startDate,
                            dateRangeContext?.endDate
                          )} night`
                        : `${calculateNightDifference(
                            dateRangeContext?.startDate,
                            dateRangeContext?.endDate
                          )} nights`
                    }`}
              </Fragment>
            )}
          </div>
          <div className="text-gray-500">
            {dateRangeContext && dateRangeContext?.startDate && dateRangeContext?.endDate && (
              <Fragment>
                {new Date(dateRangeContext?.startDate).getTime() ===
                new Date(dateRangeContext?.endDate).getTime()
                  ? 'Add your travel dates for exact pricing'
                  : `${format(new Date(dateRangeContext?.startDate), 'dd MMM yyyy')} - ${format(
                      new Date(dateRangeContext?.endDate),
                      'dd MMM yyyy'
                    )}`}
              </Fragment>
            )}
          </div>
        </div>
        <div className="hidden md:block lg:block xl:block">
          {dateRangeContext ? (
            <CalendarAparment
              value={dateRangeContext}
              onChange={(value: any) => {
                handleChangeDateRange(value);
                setDateRangeContext(value.selection);
              }}
              className="w-[100%] !text-[1em]"
              minDate={new Date(dateRangeDefaultContext?.startDate)}
              maxDate={new Date(dateRangeDefaultContext?.endDate)}
              disabledDates={dateOut}
            />
          ) : (
            ''
          )}
        </div>
        <div className="md:hidden lg:hidden xl:hidden">
          {dateRangeContext ? (
            <CalendarAparment
              value={dateRangeContext}
              onChange={(value: any) => {
                handleChangeDateRange(value);
                setDateRangeContext(value.selection);
              }}
              className="w-[100%] !text-[1em]"
              minDate={new Date(dateRangeDefaultContext?.startDate)}
              maxDate={new Date(dateRangeDefaultContext?.endDate)}
              disabledDates={dateOut}
            />
          ) : (
            ''
          )}
        </div>
      </div>

      <div className="flex flex-row w-full gap-5 py-8">
        <div className="w-[60%]">
          <div
            onClick={() =>
              router.push(
                `/usersprofile/${
                  apartment.availableTime.coOwner.user.userId
                }?rating=${JSON.stringify(rating)}`
              )
            }
            className="flex flex-row items-center gap-2"
          >
            <div>
              <Image
                className="rounded-full cursor-pointer"
                width={55}
                height={55}
                src={apartment.availableTime.coOwner.user.avatar || '/images/placeholder.jpg'}
                alt="avatar"
              />
            </div>
            <div>
              <div className="text-[20px] font-bold hover:underline cursor-pointer">
                Owner{' '}
                {apartment.availableTime.coOwner.user.fullName
                  ? apartment.availableTime.coOwner.user.fullName
                  : apartment.availableTime.coOwner.user.username}
              </div>
              <div>Joins November 10, 2023</div>
            </div>
          </div>
          <div className="mt-3">
            {rating?.content.length !== 0 && (
              <div className="flex flex-row items-center gap-2">
                <AiFillStar size={20} color="orange" />
                <div className="text-gray-700">
                  {!rating ? (
                    <div>0 Review</div>
                  ) : (
                    <Fragment>
                      {rating?.content?.length === 1
                        ? `${rating?.content?.length} Review`
                        : `${rating?.content?.length} Reviews`}
                    </Fragment>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <BsShieldFillCheck size={20} color="green" />
              <div className="text-gray-700">Email verified</div>
            </div>
          </div>
          {/* <div className="mt-5">
            <div className="font-bold">Hi!</div>
            <div className="text-gray-700">
              I&apos;m {apartment.availableTime.coOwner.user.fullName}, I&apos;m very passionate about traveling
              everywhere, to meet new people, and approach new cultures. Since I have a family and
              young children, we don&apos;t have time to travel much anymore, so I host on
              HolidaySwap to meet people. I hope everyone will support me Sincerely thank
            </div>
          </div> */}

          <div className="mt-5">
            <div className="font-bold">Support:</div>
            <div className="text-gray-700">We support 24/7</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-[40%]">
          <div className="py-2">
            <div
              onClick={handleExchangeApartment}
              className="hover:bg-hover rounded-md cursor-pointer font-semibold px-4 py-2 bg-common text-white text-center"
            >
              Exchange
            </div>
          </div>
          <div className="py-2">
            <div
              onClick={() =>
                handleContactOwner(apartment?.availableTime?.coOwner?.user?.userId?.toString())
              }
              className="hover:bg-hover rounded-md cursor-pointer font-semibold px-4 py-2 bg-common text-white text-center"
            >
              Contact with owner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetailBody;
