import Container from '@/app/components/Container';
import React from 'react';
import ApartmentDetail from './ApartmentDetail';
import GetApartmentById from '@/app/actions/getAparmetById';
import GetCurrentUser from '@/app/actions/getCurrentUser';
import GetApartmentRating from '@/app/actions/getApartmentRating';
import dynamic from 'next/dynamic';
import GetOwnershipByUserId from '@/app/actions/getOwnershipByUserId';

interface IParams {
  availableId?: string;
}

export const generateMetadata = async ({ params }: { params: IParams }) => {
  const apartment = await GetApartmentById(params);

  return {
    title: apartment?.availableTime.coOwner.property.propertyName,
  };
};

const ResortPage = async ({ params }: { params: IParams }) => {
  const apartment = await GetApartmentById(params);
  const currentUser = await GetCurrentUser();
  const status = 'ACCEPTED';
  const config = { status };
  const ownershipUser = await GetOwnershipByUserId(config);

  return (
    <Container>
      <ApartmentDetail
        apartment={apartment}
        currentUser={currentUser}
        ownershipUser={ownershipUser}
      />
    </Container>
  );
};

export default ResortPage;
