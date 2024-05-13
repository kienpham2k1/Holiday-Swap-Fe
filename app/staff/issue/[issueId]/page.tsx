import requireAuth from '@/app/libs/requireAuth';
import React from 'react';
import IssueDetail from './IssueDetail';
import GetIssueById from '@/app/actions/getIssueById';
import GetBookingHistoryById from '@/app/actions/getBookingHistoryById';
import GetRatingByBookingId from '@/app/actions/getRatingByBookingId';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import GetListUser from '@/app/actions/getListUser';
import GetListResort from '@/app/actions/getListResort';

interface IParams {
  bookingId: any;
}

export default async function IssueDetailPage({ params }: { params: IParams }) {
  const bookingDetail = await GetBookingHistoryById(params);
  const rating = await GetRatingByBookingId(params);
  const currentUser = await GetCurrentUser();
  const ownerUser = await GetListUser({ email: bookingDetail?.ownerEmail });
  const ownerResort = await GetListResort('0', { resortName: bookingDetail?.resortName });

  return requireAuth(
    <IssueDetail
      bookingDetail={bookingDetail}
      ownerUser={ownerUser}
      ownerResort={ownerResort}
      currentUser={currentUser}
      bookingId={params.bookingId}
      rating={rating}
    />,
    [3]
  );
}
