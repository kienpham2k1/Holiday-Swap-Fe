import ListProperty from '@/app/components/staff/ListProperty';
import requireAuth from '@/app/libs/requireAuth';
import React from 'react';

export const metadata = {
  title: 'List property',
};

export default function page() {
  return requireAuth(
    <ListProperty />,
    [3]
  );
}
