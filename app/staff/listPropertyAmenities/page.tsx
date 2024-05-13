import React from 'react';
import ListPropertyAmenities from './ListPropertyAmenities';
import requireAuth from '@/app/libs/requireAuth';
import GetPropertyAmenitiesForCreate from '@/app/actions/getPropertyAmenitiesForCreate';

export const metadata = {
  title: 'List Property Amenity',
};

export default async function ListPropertyAmenitiesPage() {
  const amenitiesType = await GetPropertyAmenitiesForCreate();
  return requireAuth(<ListPropertyAmenities amenitiesType={amenitiesType} />, [3]);
}
