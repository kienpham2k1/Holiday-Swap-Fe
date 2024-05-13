import { create } from 'zustand';

interface ChangeStatusIssueModalStore {
  isOpen: boolean;
  issueId: string;
  isSuccess: boolean;
  onSuccess: () => void;
  onSuccessReset: () => void;
  onOpen: (issueId: string) => void;
  onClose: () => void;
}

const useChangeStatusIssueModal = create<ChangeStatusIssueModalStore>((set) => ({
  isOpen: false,
  isSuccess: false,
  issueId: '',
  onSuccess: () => set({ isSuccess: true }),
  onSuccessReset: () => set({ isSuccess: false }),
  onOpen: (issueId: string) => set({ isOpen: true, issueId: issueId }),
  onClose: () => set({ isOpen: false }),
}));

export default useChangeStatusIssueModal;
