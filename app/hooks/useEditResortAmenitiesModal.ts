import { create } from 'zustand';

interface EditResortAmenitiesModalStore {
  isOpen: boolean;
  resortAmenities: any;
  amenitiesType: any;
  isSuccess: boolean;
  onSuccess: () => void;
  onSuccessReset: () => void;
  onOpen: (resortAmenities: any, amenitiesType: any) => void;
  onClose: () => void;
}

const useEditResortAmenitiesModal = create<EditResortAmenitiesModalStore>((set) => ({
  isOpen: false,
  resortAmenities: null,
  amenitiesType: null,
  isSuccess: false,
  onOpen: (resortAmenities: any, amenitiesType: any) =>
    set({ isOpen: true, resortAmenities: resortAmenities, amenitiesType: amenitiesType }),
  onClose: () => set({ isOpen: false }),
  onSuccess: () => set({ isSuccess: true }),
  onSuccessReset: () => set({ isSuccess: false }),
}));

export default useEditResortAmenitiesModal;
