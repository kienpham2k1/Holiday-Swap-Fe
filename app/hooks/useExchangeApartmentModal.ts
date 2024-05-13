import { create } from 'zustand';

interface ExchangeApartmentModalStore {
  isOpen: boolean;
  ownershipUser: any;
  availableTimeId: any;
  currentUser: any;
  contactUserId: any;
  onOpen: (ownershipUser: any, availableTimeId: any, currentUser: any, contactUserId: any) => void;
  onClose: () => void;
}

const useExchangeApartmentModal = create<ExchangeApartmentModalStore>((set) => ({
  isOpen: false,
  ownershipUser: null,
  availableTimeId: null,
  currentUser: null,
  contactUserId: null,
  onOpen: (ownershipUser, availableTimeId, currentUser, contactUserId) =>
    set({
      isOpen: true,
      ownershipUser: ownershipUser,
      availableTimeId: availableTimeId,
      currentUser: currentUser,
      contactUserId: contactUserId,
    }),
  onClose: () => set({ isOpen: false }),
}));

export default useExchangeApartmentModal;
