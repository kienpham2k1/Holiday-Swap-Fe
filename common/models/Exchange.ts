import { Dayjs } from "dayjs";
export type UserOfBooking = {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export type Booking = {
  availableTimeId: number;
  userId: number;
  checkInDate: Dayjs | undefined | string;
  checkOutDate: Dayjs |undefined | string;
  numberOfGuest: number;
  status?: number;
  userOfBookingRequests: UserOfBooking[];
}