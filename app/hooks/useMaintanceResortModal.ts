import { create } from 'zustand';

interface MaintanceResortModalStore {
  isOpen: boolean;
  resortId: string;
  resortStatus: string;
  isSuccess: boolean;
  isMaintanceProperty: boolean;
  onMaintanceProperty: () => void;
  onMaintancePropertyReset: () => void;
  onSuccess: () => void;
  onSuccessReset: () => void;
  onOpen: (resortId: string, resortStatus: string) => void;
  onClose: () => void;
}

const useMaintanceResortModal = create<MaintanceResortModalStore>((set) => ({
  isOpen: false,
  resortId: '',
  resortStatus: '',
  isSuccess: false,
  isMaintanceProperty: false,
  onSuccess: () => set({ isSuccess: true }),
  onSuccessReset: () => set({ isSuccess: false }),
  onMaintanceProperty: () => set({ isMaintanceProperty: true }),
  onMaintancePropertyReset: () => set({ isMaintanceProperty: false }),
  onOpen: (resortId: string, resortStatus: string) =>
    set({ isOpen: true, resortId: resortId, resortStatus: resortStatus }),
  onClose: () => set({ isOpen: false }),
}));

export default useMaintanceResortModal;
