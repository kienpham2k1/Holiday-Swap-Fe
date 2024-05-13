'use client';

import React, { useEffect, useRef, useState } from 'react';
import Container from '../components/Container';
import Calendar from '../components/input/Calendar';
import SearchBooking from './SearchBooking';
import ListRoom from './ListRoom';
import BookingPriceCard from './BookingPriceCard';
import BookingInformation from './BookingInformation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import useNewDateRange from '../hooks/useNewDateRange';
import useRecharge from '../hooks/useRecharge';
import { useDateRange } from '../apartment/DateRangeContext';
import { useGuest } from '@/app/apartment/GuestContext';

interface BookingProps {
  currentUser?: any;
}

const Booking: React.FC<BookingProps> = ({ currentUser }) => {
  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const recharge = useRecharge();
  const isBackBooking = recharge.isBackBooking;
  const isNewDateRange = recharge.isNewDateRange;
  const isSetNewDate = recharge.isSetNewDate;

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const availableTimeId = searchParams?.get('availableTimeId');
  const userId = searchParams?.get('userId');
  const apartmentImage = searchParams?.get('apartmentImage');
  const apartmentName = searchParams?.get('aparmentName');
  const totalGuest = searchParams?.get('totalGuest');
  const dateRangeBooking = searchParams?.get('dateRangeBooking');
  const dateRange = searchParams?.get('dateRange');
  const apartmentAllowGuest = searchParams?.get('apartmentAllowGuest');
  const totalPrice = searchParams?.get('totalPrice');
  const priceNight = searchParams?.get('priceNight');
  const avatar = searchParams?.get('avatar');
  const fullName = searchParams?.get('fullName');
  const username = searchParams?.get('username');
  const rating = searchParams?.get('rating');
  const resortName = searchParams?.get('resortName');
  const [bookingLink, setBookingLink] = useState<string>('');
  const { dateRangeContext, setDateRangeContext, setDateRangeDefaultContext } = useDateRange();

  const isMounted = useRef(false);

  useEffect(() => {
    setBookingLink(
      `/booking?availableTimeId=${availableTimeId}&apartmentImage=${apartmentImage}&aparmentName=${apartmentName}&priceNight=${priceNight}&userId=${userId}&totalPrice=${totalPrice}&totalGuest=${totalGuest}&dateRangeBooking=${dateRangeBooking}&dateRange=${dateRange}&apartmentAllowGuest=${apartmentAllowGuest}&avatar=${avatar}&fullName=${fullName}&rating=${rating}&resortName=${resortName}&username=${username}`
    );
  }, [
    availableTimeId,
    apartmentImage,
    apartmentName,
    priceNight,
    userId,
    totalPrice,
    totalGuest,
    dateRangeBooking,
    dateRange,
    apartmentAllowGuest,
    avatar,
    fullName,
    rating,
    resortName,
    username,
  ]);

  const {
    setTotalGuestContext
  } = useGuest();

  useEffect(() => {
    if (bookingLink) {
      localStorage.setItem('bookingLink', bookingLink);
    }
  }, [bookingLink]);

  useEffect(() => {
    if (isBackBooking === false) {
      setTotalGuestContext(Number(totalGuest))
      recharge.onNewDateRange();
      recharge.onBackBooking();
    }
  }, [isBackBooking]);

  useEffect(() => {
    if (isNewDateRange === true && dateRange && dateRangeBooking) {
      setDateRangeContext(JSON.parse(dateRange));
      setDateRangeDefaultContext(JSON.parse(dateRangeBooking));
      recharge.onNewDateRangeReset();
    }
  }, [isNewDateRange, dateRange, dateRangeBooking]);

  useEffect(() => {
    if (isSetNewDate === true && dateRange && dateRangeBooking) {
      setDateRangeContext(JSON.parse(dateRange));
      setDateRangeDefaultContext(JSON.parse(dateRangeBooking));
      recharge.onSetNewDateReset();
    }
  }, [dateRange, dateRangeBooking, isSetNewDate]);

  return (
    <Container className="bg-white">
      <div className="flex flex-col py-32 md:flex md:flex-col lg:grid lg:grid-cols-2 lg:gap-28 lg:py-32 lg:px-20">
        <div className="w-full">
          <BookingInformation
            totalGuest={totalGuest}
            apartmentAllowGuest={apartmentAllowGuest}
            dateRangeBooking={dateRangeBooking}
            dateRange={dateRange}
            availableTimeId={availableTimeId}
            userId={userId}
            currentUser={currentUser}
            priceNight={priceNight}
          />
        </div>
        <div className="w-full sticky">
          <BookingPriceCard
            apartmentImage={apartmentImage}
            apartmentName={apartmentName}
            totalPrice={totalPrice}
            priceNight={priceNight}
            dateRangeBooking={dateRangeBooking}
            avatar={avatar}
            fullName={fullName}
            username={username}
            rating={rating}
            resortName={resortName}
          />
        </div>
      </div>
    </Container>
  );
};

export default Booking;
