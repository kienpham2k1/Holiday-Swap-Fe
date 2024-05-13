'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../input/Input';
import Modal from './Modal';
import { toast } from 'react-hot-toast';
import useCreatePlanModal from '@/app/hooks/useCreatePlanModal';
import { Select, Option, Textarea } from '@material-tailwind/react';
import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import useCreateOwnershipModal from '@/app/hooks/useCreateOwnershipModal';
import { addDays, addMonths, format, subDays } from 'date-fns';
import CalendarAparment from '@/app/apartment/CalendarAparment';
import useEditDateBookingModal from '@/app/hooks/useEditDateBookingModal';
import { useDateRange } from '@/app/apartment/DateRangeContext';
import useNewDateRange from '@/app/hooks/useNewDateRange';

export default function ModalEditDateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    dateRangeContext,
    dateRangeDefaultContext,
    setDateRangeContext,
    setDateRangeDefaultContext,
    dateOut,
    setDateOut,
  } = useDateRange();

  const editDateBookingModal = useEditDateBookingModal();
  const newDateRange = useNewDateRange();
  const isNew = newDateRange.isNew;
  const handleDatePicker = editDateBookingModal.handleDateRangePicker;
  const dateRangeProp = JSON.parse(editDateBookingModal.dateRange);
  const [dateRange, setDateRange] = useState<any>();
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    if (
      dateRangeContext &&
      dateRangeContext?.startDate.toString().includes('T') &&
      dateRangeContext?.endDate.toString().includes('T')
    ) {
      setDateRange({
        startDate: new Date(dateRangeContext?.startDate),
        endDate: new Date(dateRangeContext?.endDate),
        key: 'selection',
      });
    }
  }, [dateRangeContext]);

  const handleChangeDate = (value: any) => {
    setDateRangeContext(value.selection);
  }

  useEffect(() => {
    if (isSave === true) {
    // @ts-ignore
    const current = new URLSearchParams(Array.from(searchParams?.entries()));
      current.set('dateRange', JSON.stringify(dateRangeContext));
      const search = current.toString();
      const query = search ? `?${search}` : '';

      router.replace(`${pathName}${query}`);
      localStorage.setItem('bookingLink', `${pathName}${query}`);
      setIsSave(false)

    }
    
  }, [isSave])

  const bodyContent = (
    <div className="h-full w-full">
      <CalendarAparment
        value={dateRange}
        onChange={(value: any) => {
          handleChangeDate(value);

          if (handleDatePicker) {
            handleDatePicker(value);
          }
        }}
        minDate={
          typeof dateRangeDefaultContext?.startDate === 'string' &&
          dateRangeDefaultContext?.startDate
            ? new Date(
                (dateRangeDefaultContext?.startDate as any)?.toString().split('T', 1)[0] as string
              )
            : dateRangeDefaultContext?.startDate
        }
        maxDate={
          typeof dateRangeDefaultContext?.endDate === 'string' && dateRangeDefaultContext?.endDate
            ? new Date(
                (dateRangeDefaultContext?.endDate as any)?.toString().split('T', 1)[0] as string
              )
            : dateRangeDefaultContext?.endDate
        }
        disabledDates={dateOut}
        className="w-full"
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={editDateBookingModal.isOpen}
      actionLabel="Save"
      title="Edit date booking"
      onClose={editDateBookingModal.onClose}
      body={bodyContent}
      onSubmit={() => {
        editDateBookingModal.onClose();
        setIsSave(true)
      }}
    />
  );
}
