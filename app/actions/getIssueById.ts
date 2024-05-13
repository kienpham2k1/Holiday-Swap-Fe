import axios from "axios";

interface IParams {
    issueId: string;
}

export default async function GetIssueById(params: IParams) {
  try {
    const { issueId } = params;
    const issueDetail = await axios.get(`https://holiday-swap.click/api/v1/issues-booking/get-issue-booking-by-id/${issueId}`)

    if (!issueDetail) {
        return null;
    };

    return issueDetail.data;
  } catch (error) {
    
  }
}
