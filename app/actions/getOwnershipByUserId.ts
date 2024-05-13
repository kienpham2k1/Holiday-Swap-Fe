import useAxiosAuth from '../hooks/useAxiosAuth';
import GetCurrentUser from './getCurrentUser';
import axios from 'axios';

export default async function GetOwnershipByUserId(config: any = {}) {
  try {
    const currentUser = await GetCurrentUser();
    const { status } = config;
    let url = `https://holiday-swap.click/api/co-owners?userId=${currentUser?.userId}&pageNo=0&pageSize=10&sortDirection=desc`;

    if (status) {
      url += `&coOwnerStatus=${status}`;
    }
    const ownership = await axios.get(url);

    if (!ownership) {
      return null;
    }

    return ownership.data;
  } catch (error) {}
}
