import axios from 'axios';
import { notFound } from 'next/navigation';

interface IParams {
  coOwnerId: number;
  pageNo: number;
  pageSize: number;
  sortDirection: 'asc' | 'desc';
  sortBy: string;
}

export default async function GetApartmentMantainByPropertyIdApartmentId(
  propertyId: string,
  apartmentId: string
) {
  try {
    const apartmentMantain = await axios.get(
      `https://holiday-swap.click/api/co-owners/getListApartmentMaintain/${propertyId}/${apartmentId}`
    );

    if (!apartmentMantain) {
      return [];
    }
    return apartmentMantain.data;
  } catch (error) {return []}
}
