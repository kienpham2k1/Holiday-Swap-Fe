import requireAuth from '@/app/libs/requireAuth';
import ListApartment from './ListApartment';
import GetOwnershipStaff from '@/app/actions/getOwnershipStaff';

export default async function ListApartmentPage() {
  const status = 'ACCEPTED';
  const config = { status };
  const apartment = await GetOwnershipStaff(config);
  return requireAuth(<ListApartment ownershipStaff={apartment} />, [3]);
}
