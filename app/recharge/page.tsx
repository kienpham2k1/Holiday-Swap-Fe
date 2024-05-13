import React from 'react';
import RechargeCard from '../components/recharge/RechargeCard';
import requireAuth from '../libs/requireAuth';
import GetPoint from '../actions/getPoint';

export const metadata = {
  title: 'Recharge',
};

export default async function Recharge() {
  const point = await GetPoint();
  return requireAuth(
    <div className="pt-20">
      <RechargeCard point={point} />
    </div>,
    [2, 4]
  );
}
