'use client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import InputComponent from '../input/Input';
import UploadImageCreateOwnership from './UploadImageCreateOwnership';
import { Modal, Button, Label, Select } from 'flowbite-react';
import ModalCreate from './ModalCreate';
import useExchangeApartmentModal from '@/app/hooks/useExchangeApartmentModal';
import axios from 'axios';
import { format } from 'date-fns';
import CalendarAparment from '@/app/apartment/CalendarAparment';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import ConversationApis from '@/app/actions/ConversationApis';
import { useDateRange } from '@/app/apartment/DateRangeContext';

export default function ModalExchangeApartment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const exchangeApartmentModal = useExchangeApartmentModal();
  const ownershipUser = exchangeApartmentModal.ownershipUser;
  const ownerAvailableTimeId = exchangeApartmentModal.availableTimeId;
  const currentUser = exchangeApartmentModal.currentUser;
  const contactUserId = exchangeApartmentModal.contactUserId;
  const [ownershipData, setOwnershipData] = useState<any>();
  const [ownershipId, setOwnershipId] = useState<any>();
  const [availableTimeData, setAvailableTimeData] = useState<any>();
  const [availableTimeId, setAvailableTimeId] = useState<any>();
  const [availableTimeById, setAvailableTimeById] = useState<any>();
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: new Date().getTime() + 24 * 60 * 60 * 1000,
    key: 'selection',
  });
  const [dateRangeDefault, setDateRangeDefault] = useState<any>();
  const [userId, setUserId] = useState<any>();
  const [isChangeOwnershipId, setIsChangeOwnershipId] = useState(false);
  const [isChangeAvailableTime, setIsChangeAvailableTime] = useState(false);
  const [isChangeDate, setIsChangeDate] = useState(false);
  const [ownerAvailableTimeIdValue, setOwnerAvailableTimeIdValue] = useState<any>();
  const { data: session } = useSession();
  const isMounted = useRef(false);

  const { dateRangeContext } = useDateRange();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      guests: '',
    },
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      // Component will unmount, set isMounted to false
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setIsChangeOwnershipId(true);
      setIsChangeAvailableTime(true);
    }
  }, [isMounted]);

  const handleContactOwner = (ownerId: string) => {
    ConversationApis.getContactWithOwner(ownerId)
      .then((res) => {
        console.log('Check response', res);
      })
      .catch((err) => {
        ConversationApis.createCurrentUserConversation(ownerId).catch((err) => {
          console.log(err);
        });
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const config = { headers: { Authorization: `Bearer ${session?.user.access_token}` } };

    const exchangeData = {
      requestAvailableTimeId: ownerAvailableTimeId,
      requestCheckInDate: format(new Date(dateRangeContext?.startDate), 'yyyy-MM-dd'),
      requestCheckOutDate: format(new Date(dateRangeContext?.endDate), 'yyyy-MM-dd'),
      requestTotalMember: data.guests,
      userId: contactUserId,
      availableTimeId: availableTimeId,
    };

    await axios
      .post(`https://holiday-swap.click/api/v1/exchange/create`, exchangeData, config)
      .then(() => {
        toast.success('Request exchange success');
        setAvailableTimeId(null);
        reset();
        setOwnerAvailableTimeIdValue(null);
        setOpenModal(false);
        exchangeApartmentModal.onClose();
        handleContactOwner(contactUserId);
        router.push('/dashboard/myExchange');
        router.refresh();
      })
      .catch((response) => {
        toast.error(response.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (ownershipUser && !ownershipData) {
      setOwnershipData(ownershipUser);
    }

    if (ownershipData && !ownershipId) {
      setOwnershipId(ownershipData.content[0]?.id);
    }

    if (availableTimeData && !availableTimeId) {
      setAvailableTimeId(availableTimeData.content[0]?.id);
    }

    if (currentUser && !userId) {
      setUserId(currentUser.userId);
    }

    if (ownerAvailableTimeId && !ownerAvailableTimeIdValue) {
      setOwnerAvailableTimeIdValue(ownerAvailableTimeId);
    }
  }, [
    ownershipData,
    ownershipUser,
    ownershipId,
    availableTimeData,
    availableTimeId,
    currentUser,
    userId,
    ownerAvailableTimeId,
    ownerAvailableTimeIdValue,
  ]);

  useEffect(() => {
    // This effect will run when availableTimeData changes
    if (availableTimeData && availableTimeData.content.length > 0) {
      // Fetch availableTimeById based on the first item in availableTimeData
      const firstAvailableTimeId = availableTimeData.content[0]?.id;
      if (firstAvailableTimeId) {
        setAvailableTimeId(firstAvailableTimeId);
        setIsChangeAvailableTime(true); // Trigger the effect to fetch availableTimeById
      }
    }
  }, [availableTimeData]);

  const handleChangeOwnershipId = (value: any) => {
    setOwnershipId(value);
  };

  const handleChangeAvailableTimeId = (value: any) => {
    setAvailableTimeId(value);
  };

  // const fetchAvailableTimeById = async () => {
  //   const rs = await axios.get(
  //     `https://holiday-swap.click/api/v1/available-times/${availableTimeId}`
  //   );

  //   if (rs) {
  //     setAvailableTimeById(rs.data);
  //   }
  // };

  // const fetchAvailableTimeByCoOwnerId = async () => {
  //   const rs = await axios.get(
  //     `https://holiday-swap.click/api/v1/available-times/co-owner/${ownershipId}?pageNo=0&pageSize=999&sortDirection=asc&sortBy=id`
  //   );

  //   if (rs) {
  //     setAvailableTimeData(rs.data);
  //   }
  // };

  useEffect(() => {
    const fetchAvailableTimeByCoOwnerId = async () => {
      try {
        const response = await axios.get(
          `https://holiday-swap.click/api/v1/available-times/co-owner/${ownershipId}?pageNo=0&pageSize=999&sortDirection=asc&sortBy=id`
        );

        if (response.data) {
          setAvailableTimeData(response.data);

          // Fetch availableTimeById based on the first item in availableTimeData
          const firstAvailableTimeId = response.data?.content[0]?.id;
          if (firstAvailableTimeId) {
            setAvailableTimeId(firstAvailableTimeId);
          }
        }
      } catch (error) {
        console.error('Error fetching availableTimeData:', error);
      }
    };

    const fetchAvailableTimeById = async () => {
      try {
        const response = await axios.get(
          `https://holiday-swap.click/api/v1/available-times/${availableTimeId}`
        );

        if (response.data) {
          setAvailableTimeById(response.data);

          // Set dateRangeDefault based on availableTimeById
          const startDate = new Date(response.data.startTime);
          const endDate = new Date(response.data.endTime);
          setDateRangeDefault({
            startDate,
            endDate,
            key: 'selection',
          });

          // Set dateRange if isChangeDate is false
          if (!isChangeDate) {
            setDateRange({
              startDate,
              endDate,
              key: 'selection',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching availableTimeById:', error);
      }
    };

    // Fetch availableTimeData when ownershipId changes
    if (ownershipId && isChangeOwnershipId) {
      fetchAvailableTimeByCoOwnerId();
      setIsChangeOwnershipId(false);
    }

    // Fetch availableTimeById when availableTimeId changes
    if (availableTimeId && isChangeAvailableTime) {
      fetchAvailableTimeById();
      setIsChangeAvailableTime(false);
    }
  }, [ownershipId, availableTimeId, isChangeOwnershipId, isChangeAvailableTime, isChangeDate]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-center gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label>Select apartment</label>
          <Select
            id="roomId"
            value={ownershipId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              handleChangeOwnershipId(e.target.value);
              setIsChangeOwnershipId(true);
            }}
          >
            {ownershipData?.content.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.property.propertyName} | {item.roomId}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-y-1">
          <label>Select available time</label>
          <Select
            id="availableTimeId"
            value={availableTimeId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              handleChangeAvailableTimeId(e.target.value);
              setIsChangeAvailableTime(true);
            }}
          >
            {availableTimeData?.content.map((item: any) => (
              <option key={item.id} value={item.id}>
                {format(new Date(item.startTime), 'dd/MM/yyyy')} -{' '}
                {format(new Date(item.endTime), 'dd/MM/yyyy')}
              </option>
            ))}
          </Select>
        </div>

        <InputComponent
          id="guests"
          register={register}
          errors={errors}
          label="Guest"
          type="number"
        />
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Exchange apartment</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you want to do this?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button color="blue" className="font-bold text-lg" onClick={handleSubmit(onSubmit)}>
            Continue
          </Button>
          <Button color="gray" className="text-lg" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

  return (
    <ModalCreate
      disabled={isLoading}
      isOpen={exchangeApartmentModal.isOpen}
      title="Exchange Apartment"
      actionLabel={'Exchange'}
      onClose={exchangeApartmentModal.onClose}
      onSubmit={() => setOpenModal(true)}
      body={bodyContent}
    />
  );
}
