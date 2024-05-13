import GetBookingHistoryById from '@/app/actions/getBookingHistoryById';
import BookingDetail from './BookingDetail';
import requireAuth from '@/app/libs/requireAuth';
import GetListUser from '@/app/actions/getListUser';
import GetListResort from '@/app/actions/getListResort';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import GetRatingByBookingId from '../../../actions/getRatingByBookingId';

interface IParams {
  bookingId: any;
}

export const generateMetadata = async ({ params }: { params: IParams }) => {
  const historyBooking = await GetBookingHistoryById(params);

  return {
    title: `${historyBooking?.propertyName} booking`,
  };
};

export default async function BookingDetailPage({ params }: { params: IParams }) {
  const bookingDetail = await GetBookingHistoryById(params);
  const rating = await GetRatingByBookingId(params);
  const currentUser = await GetCurrentUser();
  const ownerUser = await GetListUser({ email: bookingDetail?.ownerEmail });
  const ownerResort = await GetListResort('0', { resortName: bookingDetail?.resortName });

  return requireAuth(
    <div>
      <div className="mt-10">
        Dashboard {'>'} <span>My Booking</span> {'>'}{' '}
        <span className="text-common">Booking Detail</span>
      </div>
      <div>
        <BookingDetail
          bookingDetail={bookingDetail}
          ownerUser={ownerUser}
          ownerResort={ownerResort}
          currentUser={currentUser}
          bookingId={params.bookingId}
          rating={rating}
        />
      </div>
    </div>,
    [2, 4, 3]
  );
}
