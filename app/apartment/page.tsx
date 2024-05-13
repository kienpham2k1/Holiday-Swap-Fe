import React from 'react';
import ClientOnly from '../components/ClientOnly';
import ListAparment from './ListAparment';
import GetListApartment from '../actions/getListApartment';
import GetListResort from '../actions/getListResort';
import { AiFillAccountBook } from 'react-icons/ai';
import GetCurrentUser from '../actions/getCurrentUser';
import GetListResortForCreateOwner from '@/app/actions/getListResortForCreateOwner';
import GetListResortActiveHaveProperty from '../actions/getListResortActiveHaveProperty';

export const metadata = {
  title: 'Apartments',
};

export default async function listResortPage() {
  // const listApartment = await GetListApartment();
  const listResort = await GetListResortActiveHaveProperty();
  const currentUser = await GetCurrentUser();
  return (
    <ClientOnly>
      <ListAparment
        // listApartment={listApartment}
        listResort={listResort}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
