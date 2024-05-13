import React from "react";
import useExchange from '@/app/hooks/useExchange';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import requireAuth from '@/app/libs/requireAuth';
import { Layout } from 'antd';
import ExchangeTable from '@/app/components/exchange/ExchangeTable';
import ExchangeApis, { Exchange } from '@/app/actions/ExchangeApis';
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

export default async function Exchange() {
  const currentUser = await GetCurrentUser();
  const exchanges = await ExchangeApis.getCurrentUserExchanges();

  // exchanges.content = exchanges?.content?.map((exchange) => swapData(exchange, currentUser.userId));
  return requireAuth(
    <>
      <ExchangeTable initialItems={exchanges?.content?.map((exchange) => swapData(exchange, currentUser.userId))}
                     currentUser={currentUser}/>
    </>,
    [2],
  );

}
