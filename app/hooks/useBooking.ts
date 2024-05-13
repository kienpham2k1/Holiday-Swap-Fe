import { create } from 'zustand';

interface BookingStore {
  isSuccess: boolean;
  onSuccess: () => void;
  onSuccessReset: () => void;
}

const useBooking = create<BookingStore>((set) => ({
  isSuccess: false,
  onSuccess: () => set({ isSuccess: true }),
  onSuccessReset: () => set({ isSuccess: false }),
}));

export default useBooking;
