import GetOwnerHistoryBooking from '@/app/actions/getOwnerHistoryBooking';
import OwnerBooking from '@/app/components/dashboard/OwnerBooking';
import requireAuth from '@/app/libs/requireAuth';
import React from 'react';

export const metadata = {
  title: 'Owner History Booking',
};

export default async function OwnerBookingPage() {
  const historyOwnerBooking = await GetOwnerHistoryBooking();

  return requireAuth(
    <OwnerBooking historyOwnerBooking={historyOwnerBooking} />,
    [2]
  );
}
