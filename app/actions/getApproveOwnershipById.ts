import AxiosClient from '../libs/AxiosConfig2';
import * as NextNavigation from 'next/navigation';

interface IParams {
  slug: any[];
}

export default async function GetApproveOwnershipById(params: IParams) {
  const { slug } = params; // Destructure the slug array from params.
  const [coOwnerId] = slug;
  const approveDetail: Promise<any> = AxiosClient.get(`co-owners/${coOwnerId}`).catch(
    (err) => NextNavigation.notFound()
  );
  if (!approveDetail) {
    return null;
  }
  return approveDetail;
}
