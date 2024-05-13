import axios from 'axios';

interface IParams {
  coOwnerId: number;
}

export default async function GetAvailableTimesHasCreatedByCoOwnerId(params: IParams) {
  try {
    // Destructure the slug array from params.
    const { coOwnerId } = params;

    const availableTimes = await axios.get(
      `https://holiday-swap.click/api/v1/available-times/getAllByCoOwnerId?coOwnerId=${coOwnerId} `
    );

    if (!availableTimes) {
      return null;
    }

    return availableTimes.data;
  } catch (error) {}
}
