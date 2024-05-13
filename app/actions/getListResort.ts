import axios from 'axios';

export default async function GetListResort(pageNo: string, config: any = {}) {
  try {
    const { resortName } = config;

    console.log('Check config', config);

    let apiUrl = `https://holiday-swap.click/api/v1/resorts?pageNo=${pageNo}&pageSize=10&sortDirection=desc`;

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
