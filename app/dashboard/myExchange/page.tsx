import MyExchangeList from '@/app/components/dashboard/MyExchangeList';
import requireAuth from '@/app/libs/requireAuth';
import React from 'react';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import ExchangeApis, { Exchange } from '@/app/actions/ExchangeApis';
import ExchangeTable from '@/app/components/exchange/ExchangeTable';

function swapData(exchange: Exchange, currentUserUserId: number): Exchange {
  if (exchange.requestUserId === currentUserUserId) {
    return {
      ...exchange,
      userId: exchange.requestUserId,
      availableTimeId: exchange.requestAvailableTimeId,
      checkInDate: exchange.requestCheckInDate,
      checkOutDate: exchange.requestCheckOutDate,
      totalMember: exchange.requestTotalMember,
      status: exchange.requestStatus,
      bookingId: exchange.requestBookingId,
      requestUserId: exchange.userId,
      requestAvailableTimeId: exchange.availableTimeId,
      requestCheckInDate: exchange.checkInDate,
      requestCheckOutDate: exchange.checkOutDate,
      requestTotalMember: exchange.totalMember,
      requestStatus: exchange.status,
      requestBookingId: exchange.bookingId,
      availableTime: exchange.requestAvailableTime,
      requestAvailableTime: exchange.availableTime,
      requestUser: exchange.user,
      user: exchange.requestUser,
    };
  }
  return exchange;
}


export default async function MyExchange() {
  const currentUser = await GetCurrentUser();
  const exchanges = await ExchangeApis.getCurrentUserExchanges();
  return requireAuth(
    <div>
      <div>
        Dashboard {'>'} <span className="text-common">My Exchange</span>
      </div>
      <div className="mt-10">
        <ExchangeTable initialItems={exchanges?.content?.map((exchange) => swapData(exchange, currentUser.userId))}
                       currentUser={currentUser}/>
      </div>
    </div>,
    [2]
  );
}
