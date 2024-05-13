import axios from 'axios';

interface IParams {
  propertyId: number;
  roomId: string;
}

export default async function getRatingByPropertyIdAndRoomId(params: IParams) {
  try {
    // Destructure the slug array from params.
    const { propertyId, roomId } = params;

    const ratingPage = await axios.get(
      // `https://holiday-swap.click/api/co-owners/detail?propertyId=${propertyId}&userId=${userId}&roomId=${roomId}`
      `https://holiday-swap.click/api/v1/rating?propertyId=${propertyId}&roomId=${roomId}`
    );

    if (!ratingPage) {
      return null;
    }

    return ratingPage.data;
  } catch (error) {}
}
