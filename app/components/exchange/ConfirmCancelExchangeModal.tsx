'use client';

import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Modal from '@/app/components/chat/Modal';
import Button from '@/app/components/chat/input/Button';
import ExchangeApis from '@/app/actions/ExchangeApis';
import useExchange from '@/app/hooks/useExchange';

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

function ConfirmCancelExchangeModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { exchangeId } = useExchange();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    ExchangeApis.cancelExchange(exchangeId)
      .then(() => {
        onClose();
        router.refresh();
      })
      .catch(() => toast.error('Something Went Wrong'))
      .finally(() => setIsLoading(false));
  }, [exchangeId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div
          className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
          <FiAlertTriangle
            className='h-6 w-6 text-red-600'
            aria-hidden='true'
          />
        </div>
        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
          <Dialog.Title
            as='h3'
            className='text-base font-semibold leading-6 text-gray-900 dark:text-gray-100'
          >
            Cancel exchange
          </Dialog.Title>
          <div className='mt-2'>
            <p className='text-sm text-gray-500 dark:text-gray-300'>
              Are you sure you want to cancel this exchange? This action
              cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-x-2'>
        <Button disabled={isLoading} danger onClick={onSubmit}>
          Agree
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Disagree
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmCancelExchangeModal;