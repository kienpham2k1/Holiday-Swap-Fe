import requireAuth from '@/app/libs/requireAuth';
import React from 'react';
import ListPropertyView from './ListPropertyView';

export const metadata = {
  title: 'List Property View',
};

export default async function ListPropertyViewPage() {
  return requireAuth(<ListPropertyView />, [3]);
}
