import { create } from 'zustand';

interface DeactiveApartmentModalStore {
  isOpen: boolean;
  propertyId: string;
  roomId: string;
  isSuccess: boolean;
  onSuccess: () => void;
  onSuccessReset: () => void;
  onOpen: (propertyId: string, roomId: string) => void;
  onClose: () => void;
}

const useDeactiveApartmentModal = create<DeactiveApartmentModalStore>((set) => ({
  isOpen: false,
  propertyId: '',
  roomId: '',
  isSuccess: false,
  onSuccess: () => set({ isSuccess: true }),
  onSuccessReset: () => set({ isSuccess: false }),
  onOpen: (propertyId, roomId) =>
    set({ isOpen: true, propertyId: propertyId, roomId: roomId, isSuccess: false }),
  onClose: () => set({ isOpen: false }),
}));

export default useDeactiveApartmentModal;
