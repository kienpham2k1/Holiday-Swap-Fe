import axios from "axios";

interface IParams {
  resortId?: string;
}

export default async function GetResortById(params: IParams) {
  try {
    const { resortId } = params;

    const resort = await axios.get(
      `https://holiday-swap.click/api/v1/resorts/${resortId}`
    );

    if (!resort) {
      return null;
    }

    return resort.data;
  } catch (error) {}
}
