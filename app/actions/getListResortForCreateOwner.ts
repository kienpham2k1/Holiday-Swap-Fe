import axios from 'axios';

export default async function GetListResortForCreateOwner(pageNo: string, config: any = {}) {
  try {
    const { resortName } = config;

    let apiUrl = `https://holiday-swap.click/api/v1/resorts?pageNo=${pageNo}&resortStatus=ACTIVE&pageSize=99999`;

    if (resortName) {
      apiUrl += `&nameResort=${resortName}`;
    }

    const listResort = await axios.get(apiUrl);

    if (!listResort || !listResort.data || !listResort.data.content) {
      return { content: [], totalElements: 0 };
    }

    return listResort.data;
  } catch (error) {
    console.error('Error fetching list of resorts:', error);
    throw error;
  }
}
