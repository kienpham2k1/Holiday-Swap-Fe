import useAxiosAuth from '../hooks/useAxiosAuth';
import GetCurrentUser from './getCurrentUser';
import axios from 'axios';

export default async function GetOwnershipStaff(config: any = {}) {
  try {
    const { status } = config;

    console.log('Check config', status);

    let url = 'https://holiday-swap.click/api/co-owners?pageNo=0&pageSize=8&sortDirection=desc';

    if (config) {
      url += `&coOwnerStatus=${status}`;
    }

    const ownership = await axios.get(url);

    if (!ownership) {
      return null;
    }

    return ownership.data;
  } catch (error) {}
}
