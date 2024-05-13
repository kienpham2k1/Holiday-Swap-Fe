import AxiosClient from '@/app/libs/AxiosConfig';
import { User } from '@/app/actions/UserApis';
import { Dayjs } from 'dayjs';
import { ApartmentForRent, Pageable, Sort } from '@/app/components/map/type';
import { UserOfBooking } from '@/common/models';

export interface Exchange {
  exchangeId: number;
  requestUserId: number;
  requestAvailableTimeId: number;
  requestCheckInDate: Dayjs | string | null | number[];
  requestCheckOutDate: Dayjs | string | null | number[];
  requestTotalMember: number;
  requestStatus: "CONVERSATION" | "PRE_CONFIRMATION" | "CONFIRMATION" | "SUCCESS" | "CANCEL" | string;
  requestBookingId: number | undefined | null;
  userId: number;
  availableTimeId: number;
  checkInDate: Dayjs | string | null | number[];
  checkOutDate: Dayjs | string | null | number[];
  totalMember: number;
  status: "CONVERSATION" | "PRE_CONFIRMATION" | "CONFIRMATION" | "SUCCESS" | "CANCEL" | string;
  bookingId: number | undefined | null;
  overallStatus: "CONVERSATION" | "PRE_CONFIRMATION" | "CONFIRMATION" | "SUCCESS" | "CANCEL";
  requestAvailableTime?: any;
  availableTime?: any;
  requestUser?: User;
  user?: User;
  createdOn?:string;
  lastModifiedOn?:string;
}


export interface ExchangeModel {
  exchangeId: number;
  requestUserId: number;
  requestAvailableTimeId: number;
  requestCheckInDate: Dayjs | string | null | number[];
  requestCheckOutDate: Dayjs | string | null | number[];
  requestTotalMember: number;
  requestStatus: "CONVERSATION" | "PRE_CONFIRMATION" | "CONFIRMATION" | "SUCCESS" | "CANCEL" | string;
  requestBookingId: number | undefined | null;
  userId: number;
  availableTimeId: number;
  checkInDate: Dayjs | string | null | number[];
  checkOutDate: Dayjs | string | null | number[];
  totalMember: number;
  status: "CONVERSATION" | "PRE_CONFIRMATION" | "CONFIRMATION" | "SUCCESS" | "CANCEL" | string;
  bookingId: number | undefined | null;
  overallStatus: "CONVERSATION" | "PRE_CONFIRMATION" | "CONFIRMATION" | "SUCCESS" | "CANCEL" | string;
}



export interface ExchangeResponse {
  content: Exchange[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ExchangeCreatingRequest {
  requestAvailableTimeId: number;
  requestCheckInDate: string;
  requestCheckOutDate: string;
  requestTotalMember: number;
  userId: number;
  availableTimeId: number;
}

export interface ExchangeUpdatingRequest {
  checkInDate: string;
  checkOutDate: string;
  totalMember: number;
  guestList: UserOfBooking[] | null;
}

const ExchangeApis = {
  getCurrentUserExchanges: (): Promise<ExchangeResponse> => AxiosClient.get('/exchange/current-user?limit=20&offset=0&sortProps=exchangeId&sortDirection=desc'),
  createExchange: (requestBody: ExchangeCreatingRequest): Promise<any> =>
    AxiosClient.post('/exchange/create', requestBody),
  getCurrentUserExchangeById: (exchangeId: string): Promise<ExchangeModel> => AxiosClient.get(`/exchange/${exchangeId}`),
  updateExchange: (exchangeId: string, requestBody: ExchangeUpdatingRequest): Promise<any> =>
    AxiosClient.patch(`/exchange/${exchangeId}`, requestBody),
  approveExchange: (exchangeId: string): Promise<any> => AxiosClient.put(`/exchange/${exchangeId}/next-step`),
  cancelExchange: (exchangeId: string): Promise<any> => AxiosClient.put(`/exchange/${exchangeId}/cancel`),
  updateToPreviousStep: (exchangeId: string): Promise<any> => AxiosClient.put(`/exchange/${exchangeId}/previous-step`),
};

export default ExchangeApis;