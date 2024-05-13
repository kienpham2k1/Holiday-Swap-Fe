import GetCurrentUser from '@/app/actions/getCurrentUser';
import ExchangeApis from '@/app/actions/ExchangeApis';
import ConversationApis from '@/app/actions/ConversationApis';
import MessageApis from '@/app/actions/MessageApis';
import { Booking } from '@/common/models';
import ApartmentForRentApis from '@/app/components/map/apis/ApartmentForRentApis';
import ExchangeContainer from '@/app/components/exchange/ExchangeContainer';
import dayjs, { Dayjs } from 'dayjs';
import mapExchangeStatusToNumber from '@/utils/exchangeStatusUtils';


interface IParams {
  exchangeId: string;
}

const convertDateArrayToString = (dateArray: number[]): string =>
  dateArray?.join('-') ?? '';

const mapDate = (date: string | number[] | Dayjs | null | undefined): string | undefined => {
  if (Array.isArray(date)) {
    return convertDateArrayToString(date);
  } else if (typeof date === 'string') {
    return date;
  } else if (dayjs(date).isValid()) {
    return dayjs(date).toLocaleString();
  } else {
    return undefined;
  }
};


const exchangeId = async ({ params }: { params: IParams }) => {
  const currentUser = await GetCurrentUser();
  const exchange = await ExchangeApis.getCurrentUserExchangeById(params.exchangeId);
  const conversation = await ConversationApis.getContactWithOwner(
    currentUser.userId.toString()===exchange?.requestUserId.toString() ? exchange?.userId?.toString() : exchange?.requestUserId?.toString()
  );

  const participants = await ConversationApis.getParticipantsByConversationId(conversation.conversationId.toString())
    .catch((response) => {
      if (response && response.response.data) {
        console.log(response.response.data.message);
      }
    });
  const messages = await MessageApis.getMessagesByConversationId(conversation.conversationId.toString());


  const yourTrip: Booking = {
    availableTimeId: exchange?.userId === currentUser.userId ? exchange?.availableTimeId : exchange?.requestAvailableTimeId,
    userId: currentUser.userId.toString(),
    checkInDate: mapDate(exchange?.userId === currentUser.userId ? exchange?.checkInDate : exchange?.requestCheckInDate),
    checkOutDate: mapDate(exchange?.userId === currentUser.userId ? exchange?.checkOutDate : exchange?.requestCheckOutDate),
    numberOfGuest: exchange?.userId === currentUser.userId ? exchange?.totalMember : exchange?.requestTotalMember,
    userOfBookingRequests: [],
    status: mapExchangeStatusToNumber(exchange?.userId === currentUser.userId ? exchange?.status : exchange?.requestStatus),
  };

  const exchangeTrip: Booking = {
    availableTimeId: exchange?.userId === currentUser.userId ? exchange?.requestAvailableTimeId : exchange?.availableTimeId,
    userId: currentUser.userId.toString(),
    checkInDate: mapDate(exchange?.userId === currentUser.userId ? exchange?.requestCheckInDate : exchange?.checkInDate),
    checkOutDate: mapDate(exchange?.userId === currentUser.userId ? exchange?.requestCheckOutDate : exchange?.checkOutDate),
    numberOfGuest: exchange?.userId === currentUser.userId ? exchange?.requestTotalMember : exchange?.totalMember,
    userOfBookingRequests: [],
    status: mapExchangeStatusToNumber(exchange?.userId === currentUser.userId ? exchange?.requestStatus : exchange?.status),
  };

  const yourAvailableTime = await ApartmentForRentApis.getByAvailableTimeId(yourTrip.availableTimeId.toString())
    .catch(err => {
      return null;
    });
  const exchangeAvailableTime = await ApartmentForRentApis.getByAvailableTimeId(exchangeTrip.availableTimeId.toString())
    .catch(err => {
      return null;
    });

  const initialActiveStep = mapExchangeStatusToNumber(exchange?.overallStatus);

  MessageApis.markAsReadByConversationId(conversation.conversationId.toString())
    .catch(err => console.log(err));
  return (
    <div className='h-screen custom-max-height lg:py-1 sm:pt-6 sm:pb-2'>
      <div className='h-screen flex flex-col custom-max-height'>
        <ExchangeContainer initialItems={messages?.reverse()} currentUser={currentUser}
                           conversationId={conversation.conversationId.toString()}
                           users={participants?.map((p) => p?.user)}
                           yourTrip={yourTrip} exchangeTrip={exchangeTrip}
                           yourAvailableTime={yourAvailableTime}
                           initialActiveStep={initialActiveStep}
                           exchangeAvailableTime={exchangeAvailableTime} />
      </div>
    </div>
  );
};

export default exchangeId;
