import React from 'react';
import CreatePropertyView from './CreatePropertyView';
import requireAuth from '@/app/libs/requireAuth';

export const metadata = {
  title: 'Create Property View',
};

export default function CreatePropertyViewPage() {
  return requireAuth(<CreatePropertyView />, [3]);
}
