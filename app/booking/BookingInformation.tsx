'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import InputComponent from '../components/input/Input';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useEditDateBookingModal from '../hooks/useEditDateBookingModal';
import { addDays, addMonths, differenceInDays, format, subDays } from 'date-fns';
import useEditGuestBookingModal from '../hooks/useEditGuestBookingMoadal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDateRange } from '../apartment/DateRangeContext';
import { useGuest } from '../apartment/GuestContext';
import { Button, Modal } from 'flowbite-react';
import useNewDateRange from '../hooks/useNewDateRange';
import InputPhone from '../components/input/InputPhone';
import useRecharge from '../hooks/useRecharge';
import useBooking from '../hooks/useBooking';

interface BookingInformationProps {
  totalGuest?: any;
  dateRangeBooking?: any;
  dateRange?: any;
  apartmentAllowGuest?: any;
  availableTimeId: any;
  userId: any;
  currentUser: any;
  priceNight: any;
}

const BookingInformation: React.FC<BookingInformationProps> = ({
  totalGuest,
  dateRangeBooking,
  dateRange,
  apartmentAllowGuest,
  availableTimeId,
  userId,
  currentUser,
  priceNight,
}) => {
  const router = useRouter();
  const [guests, setGuests] = useState([{ email: '', fullName: '', phoneNumber: '' }]);

  const [totalGuestValue, setTotalGuestValue] = useState(totalGuest);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const valueDateJson = JSON.parse(dateRangeBooking);
  const dateRangeJson = JSON.parse(dateRange);
  const [dateRanges, setDateRanges] = useState({
    startDate: format(new Date(dateRangeJson.startDate), 'yyyy-MM-dd'),
    endDate: format(new Date(dateRangeJson.endDate), 'yyyy-MM-dd'),
    key: 'selection',
  });
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: new Date(valueDateJson.startDate),
    endDate: new Date(valueDateJson.endDate),
    key: 'selection',
  });

  const { dateRangeContext, setDateRangeContext } = useDateRange();
  const { totalGuestContext } = useGuest();

  const storedGuests = localStorage.getItem('guest');

  useEffect(() => {
    if (storedGuests) {
      setGuests(JSON.parse(storedGuests));
      localStorage.removeItem('guest');
    }
  }, [storedGuests]);

  const calculateNightDifference = (startDate: any, endDate: any) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nightDifference = differenceInDays(end, start);
    return nightDifference;
  };

  const editDateBookingModal = useEditDateBookingModal();
  const editGuestBookingModal = useEditGuestBookingModal();
  const newDateRange = useNewDateRange();
  const recharge = useRecharge();
  const isNew = newDateRange.isNew;
  const isSave = editGuestBookingModal.isSave;
  const booking = useBooking();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();

  useEffect(() => {
    if (storedGuests) {
      guests.map((item, index) => ({
        email: setValue(`email${index}`, item.email), // Use the indexed email field
        fullName: setValue(`fullName${index}`, item.fullName), // Use the indexed full name field
        phoneNumber: setValue(`phoneNumber${index}`, item.phoneNumber), // Use the indexed phone number field
      }));
    }
  }, [guests, storedGuests]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const bookingData = {
      availableTimeId: availableTimeId,
      userId: userId,
      checkInDate: format(new Date(dateRangeContext.startDate), 'yyyy-MM-dd'),
      checkOutDate: format(new Date(dateRangeContext.endDate), 'yyyy-MM-dd'),
      numberOfGuest: totalGuestContext,
      userOfBookingRequests: guests.map((item, index) => ({
        email: data[`email${index}`], // Use the indexed email field
        fullName: data[`fullName${index}`], // Use the indexed full name field
        phoneNumber: data[`phoneNumber${index}`], // Use the indexed phone number field
      })),
    };
    const config = {
      headers: { 'Content-type': 'application/json' },
    };
    axios
      .post('https://holiday-swap.click/api/booking/create', bookingData, config)
      .then(() => {
        setOpenModal(false);
        booking.onSuccess();
        router.push('/booking/success');
      })
      .catch((response) => {
        toast.error(response.response.data.message);

        if (response.response.data.message.includes('does not have enough balance')) {
          localStorage.setItem(
            'guest',
            JSON.stringify(
              guests.map((item, index) => ({
                email: data[`email${index}`], // Use the indexed email field
                fullName: data[`fullName${index}`], // Use the indexed full name field
                phoneNumber: data[`phoneNumber${index}`], // Use the indexed phone number field
              }))
            )
          );
          recharge.onAmountPoint(
            Number(
              calculateNightDifference(dateRangeContext?.startDate, dateRangeContext?.endDate) *
                priceNight
            )
          );
          router.push('/recharge');
          recharge.onRecharge();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addGuest = () => {
    const newGuest = { email: '', fullName: '', phoneNumber: '' };
    setGuests([...guests, newGuest]);
  };

  const removeGuest = (index: number) => {
    if (index >= 0 && guests.length > 1) {
      const updatedGuests = [...guests];
      updatedGuests.splice(index, 1);
      setGuests(updatedGuests);
    }
  };

  const handleChangeDateRange = (value: any) => {
    setDateRangeValue(value.selection);
  };

  useEffect(() => {
    // Set default values for the first guest based on currentUser
    if (currentUser) {
      setValue('email0', currentUser.email);
      setValue(
        'fullName0',
        currentUser.fullName ? currentUser.fullName : currentUser.username || ''
      );
      setValue('phoneNumber0', currentUser.phone);
    }
  }, [currentUser]);

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center">
          <div
            onClick={() => {
              newDateRange.setBack();
              router.back();
            }}
            className="p-3 rounded-full bg-transparent hover:bg-gray-300 cursor-pointer"
          >
            <FiChevronLeft size={30} />
          </div>
          <div className="text-3xl font-bold">Confirm and Pay</div>
        </div>

        {/* Date and Guest */}
        <div className="flex flex-col gap-5 pt-12 pb-8 border-b border-gray-400">
          <div className="text-xl font-bold">Your booking</div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="text-base text-black font-semibold">Dates</div>
              <div className="text-gray-600">
                {dateRangeContext && dateRangeContext?.startDate && dateRangeContext?.endDate && (
                  <Fragment>
                    {format(new Date(dateRangeContext?.startDate), 'd MMM')} -{' '}
                    {format(new Date(dateRangeContext?.endDate), 'd MMM yyyy')}
                  </Fragment>
                )}
              </div>
            </div>
            <div
              onClick={() => editDateBookingModal.onOpen(JSON.stringify(dateRange))}
              className="text-black font-semibold underline cursor-pointer"
            >
              Edit
            </div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="text-base text-black font-semibold">Guests</div>
              <div className="text-gray-600">
                {`${
                  totalGuestContext === 1
                    ? `${totalGuestContext} guest`
                    : `${totalGuestContext} guests`
                }`}
              </div>
            </div>
            <div
              onClick={() => editGuestBookingModal.onOpen(totalGuestValue, apartmentAllowGuest)}
              className="text-black font-semibold underline cursor-pointer"
            >
              Edit
            </div>
          </div>
        </div>

        {/* Information guest */}
        <div className="flex flex-col pt-12 pb-8 border-b border-gray-400">
          <div className="text-xl font-bold">Guest Info</div>
          <div className="flex flex-row justify-end gap-2 cursor-pointer">
            {totalGuestContext < 1 || guests.length === Number(totalGuestContext) ? (
              ''
            ) : (
              <div className="flex flex-row items-center gap-1" onClick={addGuest}>
                <PlusCircleOutlined size={20} />
                <div className="text-sm font-base">Add new guest</div>
              </div>
            )}
          </div>
          {guests.map((guest, index) => (
            <div
              key={index}
              className={`flex flex-col pb-4 ${index !== guests.length - 1 ? 'mb-10' : ''}`}
            >
              {index === 0 && <div className="pt-5 text-lg font-bold">{`Guest ${index + 1}`}</div>}
              {index >= 1 && (
                <div className="flex flex-row justify-between">
                  <div className="pt-5 text-lg font-bold">{`Guest ${index + 1}`}</div>
                  <div
                    className="flex flex-row items-center gap-1 hover:cursor-pointer"
                    onClick={() => removeGuest(index)}
                  >
                    <MinusCircleOutlined size={20} />
                    <div className="text-sm font-base">Remove guest</div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-5">
                <InputComponent
                  type="text"
                  label={`Email`}
                  id={`email${index}`}
                  register={register}
                  required
                  errors={errors}
                  setValue={setValue}
                />
                <InputComponent
                  type="text"
                  label={`Full Name`}
                  id={`fullName${index}`}
                  register={register}
                  required
                  errors={errors}
                  setValue={setValue}
                />
              </div>
              <div className="grid grid-cols-1">
                <InputPhone
                  type="text"
                  label={`Phone Number`}
                  id={`phoneNumber${index}`}
                  register={register}
                  required
                  errors={errors}
                  setValue={setValue}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="py-5">
          <div className="text-[20px] font-bold">General standards</div>
          <div className="py-3 text-gray-700">
            We ask all guests to remember a few simple rules to be a great guest.
          </div>
          <div className="text-gray-700">- Comply with house rules</div>
          <div className="text-gray-700">- Maintain the house as if it were your home</div>
        </div>
        {/* Request to book */}
        <div className="py-8">
          <button
            onClick={() => setOpenModal(true)}
            className="px-8 py-5 text-center text-xl text-white bg-common hover:bg-hover rounded-lg"
            type="button"
          >
            Request to book
          </button>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Booking</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              If you really want to book this property, make sure you have checked the information
              carefully.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            disabled={isLoading}
            color="blue"
            className="font-bold text-lg"
            onClick={handleSubmit(onSubmit)}
          >
            Booking
          </Button>
          <Button color="gray" className="text-lg" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingInformation;
