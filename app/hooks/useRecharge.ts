import { create } from 'zustand';

interface RechargeStore {
  isRecharge: boolean;
  isBackBooking: boolean;
  bookingLink: any;
  isNewDateRange: boolean;
  isClickLink: boolean;
  amountPoint: number;
  isSetNewDate: boolean;
  onAmountPoint: (amountPoint: number) => void;
  onNewDateRange: () => void;
  onNewDateRangeReset: () => void;
  onBookingLink: (bookingLink: any) => void;
  onRecharge: () => void;
  onRechargeReset: () => void;
  onBackBooking: () => void;
  onBackBookingReset: () => void;
  onClickLink: () => void;
  onClickLinkReset: () => void;
  onSetNewDate: () => void;
  onSetNewDateReset: () => void;
}

const useRecharge = create<RechargeStore>((set) => ({
  isRecharge: false,
  isBackBooking: true,
  bookingLink: null,
  isNewDateRange: false,
  isClickLink: false,
  amountPoint: 0,
  isSetNewDate: false,
  onAmountPoint: (amountPoint: number) => set({ amountPoint: amountPoint }),
  onBookingLink: (bookingLink: any) => set({ bookingLink: bookingLink }),
  onNewDateRange: () => set({ isNewDateRange: true }),
  onNewDateRangeReset: () => set({ isNewDateRange: false }),
  onRecharge: () => set({ isRecharge: true }),
  onRechargeReset: () => set({ isRecharge: false }),
  onBackBooking: () => set({ isBackBooking: true }),
  onBackBookingReset: () => set({ isBackBooking: false }),
  onClickLink: () => set({ isClickLink: true }),
  onClickLinkReset: () => set({ isClickLink: false }),
  onSetNewDate: () => set({ isSetNewDate: true }),
  onSetNewDateReset: () => set({ isSetNewDate: false }),
}));

export default useRecharge;
