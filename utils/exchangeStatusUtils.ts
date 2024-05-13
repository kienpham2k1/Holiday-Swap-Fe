export default function mapExchangeStatusToNumber(status: string): number {
  switch (status) {
    case 'CONVERSATION':
      return 0;
    case 'PRE_CONFIRMATION':
      return 1;
    case 'CONFIRMATION':
      return 2;
    case 'SUCCESS':
      return 3;
    default:
      return -1;
  }
}