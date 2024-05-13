import axios from 'axios';

export default async function GetListIssue() {
  try {
    const issue = await axios.get(
      `https://holiday-swap.click/api/v1/issues-booking/get-all-issue-booking`
    );

    if (!issue) {
      return null;
    }

    return issue.data;
  } catch (error) {}
}
