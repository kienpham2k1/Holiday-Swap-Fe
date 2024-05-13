import requireAuth from '@/app/libs/requireAuth';
import React from 'react';
import ListResortAmenities from './ListResortAmenities';
import GetResortAmenityTypeForCreate from '@/app/actions/getResortAmenityTypeForCreate';

export const metadata = {
  title: 'List Resort Amenity',
};

export default async function ListResortAmenitiesPage() {
  const amenitiesType = await GetResortAmenityTypeForCreate();
  return requireAuth(<ListResortAmenities amenitiesType={amenitiesType} />, [3]);
}
