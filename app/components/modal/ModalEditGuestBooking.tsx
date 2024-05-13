'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from './Modal';
import useEditGuestBookingModal from '@/app/hooks/useEditGuestBookingMoadal';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useGuest } from '@/app/apartment/GuestContext';
import qs from 'query-string';
import useRecharge from '@/app/hooks/useRecharge';

export default function ModalEditGuestBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const editGuestBookingModal = useEditGuestBookingModal();
  const isSave = editGuestBookingModal.isSave;
  const totalGuestProps = editGuestBookingModal.totalGuest;
  const apartmentAllowGuestProps = editGuestBookingModal.apartmentAllowGuest;
  const [totalGuest, setTotalGuest] = useState<number>(0);
  const [apartmentAllowGuest, setApartmentAllowGuest] = useState<number>(0);
  const [adultsGuest, setAdultsGuest] = useState(1);
  const [childrenGuest, setChildrenGuest] = useState(0);
  const recharge = useRecharge();
  const isBackBooking = recharge.isBackBooking;

  const {
    adultGuestContext,
    childrenGuestContext,
    totalGuestContext,
    allowTotalGuestContext,
    setAdultGuestContext,
    setChildrenGuestContext,
    setTotalGuestContext,
    setAllowTotalGuestContext,
  } = useGuest();

  const handleDescreaseAdultGuest = (value: number) => {
    if (value <= 1) {
      return 1;
    }

    setAdultGuestContext(value - 1);
    // setTotalGuestContext(totalGuestContext - 1);
  };

  const handleInscreaseAdultGuest = (value: number) => {
    if (value >= allowTotalGuestContext || value + childrenGuestContext >= allowTotalGuestContext) {
      return value;
    }

    setAdultGuestContext(value + 1);
    // setTotalGuestContext(totalGuestContext + 1);
  };

  const handldeDescreaseChildrenGuest = (value: number) => {
    if (value <= 0) {
      return 0;
    }

    setChildrenGuestContext(value - 1);
    // setTotalGuestContext(totalGuestContext - 1);
  };

  const handleInscreaseChildrenGuest = (value: number) => {
    if (value >= allowTotalGuestContext || value + adultGuestContext >= allowTotalGuestContext) {
      return value;
    }

    setChildrenGuestContext(value + 1);
    // setTotalGuestContext(totalGuestContext + 1);
  };

  const handeSaveValue = () => {
    editGuestBookingModal.onSave();
    editGuestBookingModal.onClose();
  };

  useEffect(() => {
    if (isSave === true) {
      setTotalGuestContext(adultGuestContext + childrenGuestContext);
      // @ts-ignore
      const current = new URLSearchParams(Array.from(searchParams?.entries()));
      current.set('totalGuest', `${adultGuestContext + childrenGuestContext}`);
      const search = current.toString();
      const query = search ? `?${search}` : '';

      router.replace(`${pathName}${query}`);
      localStorage.setItem('bookingLink', `${pathName}${query}`);
      editGuestBookingModal.onSaveReset();
    }
  }, [isSave, adultGuestContext, childrenGuestContext, searchParams, pathName, router]);

  const bodyContent = (
    <div className="h-full w-full">
      <div className="flex flex-row items-center justify-between py-3">
        <div className="flex flex-col">
          <div className="font-bold">Adults</div>
          <div className="text-xs text-gray-700">Age 18+</div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <button onClick={() => handleDescreaseAdultGuest(adultGuestContext)} type="button">
            <MinusCircleOutlined
              style={{
                fontSize: 30,
                color: `${adultGuestContext <= 1 ? 'gray' : ''}`,
              }}
            />
          </button>
          <div className="w-5 text-center">{adultGuestContext}</div>
          <button onClick={() => handleInscreaseAdultGuest(adultGuestContext)} type="button">
            <PlusCircleOutlined
              style={{
                fontSize: 30,
                color: `${totalGuestContext >= allowTotalGuestContext ? 'gray' : ''}`,
              }}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between py-3">
        <div className="flex flex-col">
          <div className="font-bold">Children</div>
          <div className="text-xs text-gray-700">Ages 12 - 17</div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <button onClick={() => handldeDescreaseChildrenGuest(childrenGuestContext)} type="button">
            <MinusCircleOutlined
              style={{
                fontSize: 30,
                color: `${childrenGuestContext <= 0 ? 'gray' : ''}`,
              }}
            />
          </button>
          <div className="w-5 text-center">{childrenGuestContext}</div>
          <button onClick={() => handleInscreaseChildrenGuest(childrenGuestContext)} type="button">
            <PlusCircleOutlined
              style={{
                fontSize: 30,
                color: `${totalGuestContext >= allowTotalGuestContext ? 'gray' : ''}`,
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editGuestBookingModal.isOpen}
      title="Edit guests"
      actionLabel="Save"
      onSubmit={handeSaveValue}
      onClose={editGuestBookingModal.onClose}
      body={bodyContent}
    />
  );
}
