import requireAuth from '@/app/libs/requireAuth';
import React from 'react';
import CreateResortAmenities from './CreateResortAmenities';
import GetResortAmenityTypeForCreate from '@/app/actions/getResortAmenityTypeForCreate';

export const metadata = {
  title: 'Create Resort Amenity',
};

export default async function CreateResortAmenitiesPage() {
  const amenitiesType = await GetResortAmenityTypeForCreate();
  return requireAuth(<CreateResortAmenities amenitiesType={amenitiesType} />, [3]);
}
