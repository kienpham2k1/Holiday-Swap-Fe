"use client";

import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";
import Modal from "./Modal";
import Button from "./input/Button";
import useConversation from "@/app/hooks/useConversation";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  userId?: string;
  username?: string;
};

function ConfirmBlockModal({ isOpen, onClose, userId, username }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/conversations`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Something Went Wrong"))
      .finally(() => setIsLoading(false));
  }, [router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
          >
            Block messages {username && "from"} {username}?
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Are you sure you want to block this user? This action
              cannot be undone. Your account won&apos;t receive
              messages from {username} account.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button disabled={isLoading} danger onClick={onSubmit}>
          Block
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
export default ConfirmBlockModal;