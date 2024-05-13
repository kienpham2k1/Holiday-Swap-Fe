import { create } from 'zustand';

interface DeactiveResortModalStore {
  isOpen: boolean;
  resortId: string;
  resortStatus: string;
  isSuccess: boolean;
  isDeactiveProperty: boolean;
  onDeactiveProperty: () => void;
  onDeactivePropertyReset: () => void;
  onSuccess: () => void;
  onSuccessReset: () => void;
  onOpen: (resortId: string, resortStatus: string) => void;
  onClose: () => void;
}

const useDeactiveResortModal = create<DeactiveResortModalStore>((set) => ({
  isOpen: false,
  resortId: '',
  resortStatus: '',
  isSuccess: false,
  isDeactiveProperty: false,
  onSuccess: () => set({ isSuccess: true }),
  onSuccessReset: () => set({ isSuccess: false }),
  onDeactiveProperty: () => set({ isDeactiveProperty: true }),
  onDeactivePropertyReset: () => set({ isDeactiveProperty: false }),
  onOpen: (resortId: string, resortStatus: string) =>
    set({ isOpen: true, resortId: resortId, resortStatus: resortStatus }),
  onClose: () => set({ isOpen: false }),
}));

export default useDeactiveResortModal;
