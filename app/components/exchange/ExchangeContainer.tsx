'use client';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Avatar from '@mui/material/Avatar';
import { FilePond } from 'react-filepond';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { Box, Tabs, Typography } from '@mui/material';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Image from 'next/image';
import { Carousel } from 'flowbite-react';
import Badge from '@/shared/Badge';
import StartRating from '@/app/components/map/AnyReactComponent/StartRating';
import { MdModeEdit } from 'react-icons/md';
import Button from '@mui/material/Button';
import MessageBox from '@/app/components/chat/MessageBox';
import { User } from '@/app/actions/UserApis';
import { FullMessageType } from '@/app/components/chat/Body';
import useExchangeDetail from '@/app/hooks/useExchangeDetail';
import { DateRange } from 'react-date-range';
import { differenceInDays, format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import MessageApis from '@/app/actions/MessageApis';
import { Booking } from '@/common/models';
import { AvailableTime } from '@/app/components/map/type';
import dayjs from 'dayjs';
import ApartmentForRentApis from '@/app/components/map/apis/ApartmentForRentApis';
import ConfirmCancelExchangeModal from './ConfirmCancelExchangeModal';
import ExchangeApis, { ExchangeUpdatingRequest } from '@/app/actions/ExchangeApis';
import { toast } from 'react-hot-toast';
import GetApartmentMantainByPropertyIdApartmentId from '@/app/actions/getApartmentMantainByPropertyIdApartmentId';

interface ExchangeContainerProps {
  initialItems: FullMessageType[];
  currentUser?: Object | any | null;
  users: User[] | undefined;
  conversationId: string;
  yourTrip: Booking;
  exchangeTrip: Booking;
  yourAvailableTime: AvailableTime | null;
  exchangeAvailableTime: AvailableTime | null;
  initialActiveStep: number;
}

const steps = ['Conversation', 'Pre-approval', 'Finalization'];

interface Range {
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  color?: string | undefined;
  key?: string | undefined;
  autoFocus?: boolean | undefined;
  disabled?: boolean | undefined;
  showDateDisplay?: boolean | undefined;
}

interface IDate {
  checkIn: string;
  checkOut: string;
}

const calculateTotalPrice = (
  checkOutDate: Date | undefined,
  checkInDate: Date | undefined,
  pricePerNight: number
) => {
  if (checkOutDate === undefined || checkInDate === undefined) {
    return undefined;
  }
  const nights = differenceInDays(checkOutDate, checkInDate);
  return nights * pricePerNight;
};
const isValidDate = (date: any): date is dayjs.Dayjs | string | number[] =>
  dayjs.isDayjs(date) || typeof date === 'string' || (Array.isArray(date) && date.length === 3);

const ExchangeContainer: React.FC<ExchangeContainerProps> = ({
  initialItems,
  currentUser,
  users,
  conversationId,
  yourTrip,
  exchangeTrip,
  yourAvailableTime,
  exchangeAvailableTime,
  initialActiveStep,
}) => {
  const [yourTripStatus, setYourTripStatus] = useState(yourTrip.status);
  const { exchangeId, client, loading, messages, activeStep, exchangeTripData } = useExchangeDetail(
    {
      currentUser: currentUser,
      initialMessages: initialItems,
      conversationId: conversationId,
      exchangerId: exchangeTrip.userId.toString(),
      exchangeTrip: exchangeTrip,
      initialActiveStep: initialActiveStep,
      setYourTripStatus: setYourTripStatus,
    }
  );
  const exchanger = users?.find((u) => u?.userId !== currentUser?.userId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const imageInput = useRef<FilePond>(null);
  const [files, setFiles] = useState<any>([]);
  const [tabValue, setTabValue] = React.useState('1');
  const [openDateRange, setOpenDateRange] = useState(false);
  const refDateRange = useRef(null);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: isValidDate(yourTrip.checkInDate)
        ? dayjs(yourTrip?.checkInDate?.toString())?.toDate()
        : undefined,
      endDate: isValidDate(yourTrip.checkOutDate)
        ? dayjs(yourTrip.checkOutDate?.toString())?.toDate()
        : undefined,
      key: 'selection',
    },
  ]);
  const [confirmCancelExchangeOpen, setConfirmCancelExchangeOpen] = useState(false);
  const [disableTimes, setDisableTimes] = useState<any>(() => {
    let arr: any[] = [];
    const x = yourAvailableTime?.timeHasBooked?.map((element: any) => {
      const startDate = new Date(element.checkIn);
      const endDate = new Date(element.checkOut);
      return { checkIn: startDate, checkOut: endDate };
    });

    const p = yourAvailableTime?.coOwner?.property?.propertyMaintenance
      ?.filter((e: any) => e.type == 'MAINTENANCE')
      .map((e: any) => {
        let start = new Date(e.startDate);
        start.setDate(start.getDate() - 1);
        let end = new Date(e.endDate);
        end.setDate(end.getDate() + 1);
        return { checkIn: start, checkOut: end };
      });
    const r = yourAvailableTime?.coOwner?.property?.resort.resortMaintainces
      ?.filter((e: any) => e.type == 'MAINTENANCE')
      .map((e: any) => {
        let start = new Date(e.startDate);
        start.setDate(start.getDate() - 1);
        let end = new Date(e.endDate);
        end.setDate(end.getDate() + 1);
        return { checkIn: start, checkOut: end };
      });
    arr = arr.concat(x);
    arr = arr.concat(p);
    arr = arr.concat(r);
    return arr;
  });
  const [timesDisableOnClick, setTimesDisableOnClick] = useState<Date[]>([]);
  const [maxDate, setMaxDate] = useState<Date>(() => {
    // new Date();
    let max: any = undefined;
    yourAvailableTime?.coOwner.endTime
      ? (max = new Date(new Date(yourAvailableTime?.coOwner.endTime).getFullYear(), 10, 31))
      : (max = new Date(new Date().getFullYear() + 20, 10, 31));
    let resortDeactive = yourAvailableTime?.coOwner?.property?.resort?.resortMaintainces.filter(
      (e: any) => e.type == 'DEACTIVATE'
    );
    let propertyDeactive = yourAvailableTime?.coOwner?.property?.propertyMaintenance.filter(
      (e: any) => e.type == 'DEACTIVATE'
    );
    resortDeactive = resortDeactive ? resortDeactive : [];
    propertyDeactive = propertyDeactive ? propertyDeactive : [];
    if (resortDeactive.length > 0) {
      if (new Date(max) > new Date(resortDeactive[0].startDate))
        max = new Date(resortDeactive[0].startDate);
    }
    if (propertyDeactive.length > 0) {
      if (new Date(max) > new Date(propertyDeactive[0].startDate))
        max = new Date(propertyDeactive[0].startDate);
    }
    if (max != undefined) max.setDate(max.getDate() - 1);

    return max;
  });
  async function getApartmentDeactiveByPIdAndRoomID() {
    const propertyId: string = yourAvailableTime
      ? String(yourAvailableTime.coOwner.property.id)
      : '';
    const roomId: string = yourAvailableTime ? yourAvailableTime.coOwner.roomId : '';
    const apartmentMantain = await GetApartmentMantainByPropertyIdApartmentId(propertyId, roomId);
    // let arrApartmentMaintain = apartmentMantain
    //   ?.filter((e: any) => e.type == 'MAINTENANCE')
    //   .map((e: any) => {
    //     let start = new Date(e.startDate);
    //     start.setDate(start.getDate() - 1);
    //     let end = new Date(e.endDate);
    //     end.setDate(end.getDate() + 1);
    //     return { checkIn: start, checkOut: end };
    //   });
    let apartmentDeactive = apartmentMantain?.filter((e: any) => e.type == 'DEACTIVATE');
    let max = maxDate;
    if (apartmentDeactive.length > 0) {
      if (new Date(max) > new Date(apartmentDeactive[0].startDate)) {
        max = new Date(apartmentDeactive[0].startDate);
        setMaxDate(max);
      }
    }
  }
  useEffect(() => {
    getApartmentDeactiveByPIdAndRoomID();
  }, []);
  const handleOnChangeDateRangePicker = (value: any) => {
    const result: Date[] = [];
    disableTimes?.forEach(({ checkIn, checkOut }: { checkIn: Date; checkOut: Date }) => {
      if (value?.startDate <= checkIn) result.push(checkOut);
      else if (value?.startDate >= checkIn) result.push(checkIn);
    });
    const x: Date[] = dateDiffIsGreaterTwo(disableTimes);
    result.push(...x.map((e) => new Date(e)));
    setTimesDisableOnClick(result);
  };

  const dateDiffIsGreaterTwo = (array: any[]) => {
    const arr: Date[] = [];
    array.forEach(({ checkIn, checkOut }) => {
      const daysDifference = dayjs(checkOut).diff(dayjs(checkIn), 'day');
      if (daysDifference > 1) {
        let theDateStart = dayjs(checkIn).add(1, 'day');
        while (theDateStart.isBefore(checkOut)) {
          arr.push(theDateStart.toDate());
          theDateStart = theDateStart.add(1, 'day');
        }
      }
    });
    return arr;
  };

  useEffect(() => {
    if (
      range[0]?.startDate &&
      range[0]?.endDate &&
      activeStep === 0 &&
      dayjs(range[0]?.endDate).isAfter(dayjs(range[0]?.startDate))
    ) {
      ExchangeApis.updateExchange(exchangeId, {
        checkInDate: range[0]?.startDate ? format(range[0].startDate, 'yyyy-MM-dd') : null,
        checkOutDate: range[0]?.endDate ? format(range[0].endDate, 'yyyy-MM-dd') : null,
        totalMember: 1,
        guestList: null,
      } as ExchangeUpdatingRequest).catch((response) => {
        if (response && response?.response?.data) {
          toast.error(response?.response?.data?.message);
        } else {
          toast.error('Something went wrong!');
        }
      });
    }
  }, [range]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });
  const [isYourAvailableTimeValid, setIsYourAvailableTimeValid] = useState(true);
  const [isExchangeAvailableTimeValid, setIsExchangeAvailableTimeValid] = useState(true);

  useEffect(() => {
    ApartmentForRentApis.getApartmentForRentByAvailableTimeId(
      (yourTrip?.availableTimeId ?? 0).toString()
    )
      .then((res) => {
        setDisableTimes(
          res?.timeHasBooked?.map((element: any) => {
            const startDate = new Date(element.checkIn);
            const endDate = new Date(element.checkOut);
            return { checkIn: startDate, checkOut: endDate };
          })
        );
        handleOnChangeDateRangePicker(range[0]);
      })
      .catch((err) => {});
  }, [exchangeId]);

  useEffect(() => {
    ApartmentForRentApis.getApartmentForRentByAvailableTimeId(
      (exchangeTripData?.availableTimeId ?? 0).toString()
    ).catch((err) => {
      setIsExchangeAvailableTimeValid(false);
    });
  }, [exchangeId]);

  const hideCallendarOnClickEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpenDateRange(false);
    }
  };

  const hideCallendarOnClickOutside = (e: MouseEvent) => {
    if (refDateRange?.current && !(refDateRange?.current as Node)?.contains(e.target as Node)) {
      setOpenDateRange(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', hideCallendarOnClickEscape, true);
    document.addEventListener('click', hideCallendarOnClickOutside, true);
  }, []);

  useEffect(() => {
    if (activeStep === 0) {
      setYourTripStatus(0);
    }
  }, [activeStep]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [messages]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const memoizedTotal = useMemo(() => {
    const exchangeCheckOutDate = exchangeTripData?.checkOutDate;
    const exchangeCheckInDate = exchangeTripData?.checkInDate;
    const startDate = range[0]?.startDate;
    const endDate = range[0]?.endDate;
    const exchangeTotalPrice =
      isValidDate(exchangeCheckOutDate) && isValidDate(exchangeCheckInDate)
        ? calculateTotalPrice(
            dayjs(exchangeCheckOutDate?.toString())?.toDate(),
            dayjs(exchangeCheckInDate?.toString())?.toDate(),
            exchangeAvailableTime?.pricePerNight ?? 1
          )
        : undefined;
    const rangeTotalPrice = calculateTotalPrice(
      endDate,
      startDate,
      yourAvailableTime?.pricePerNight ?? 1
    );
    return exchangeTotalPrice !== undefined && rangeTotalPrice !== undefined
      ? (exchangeTotalPrice - rangeTotalPrice - exchangeTotalPrice * 0.05).toFixed(2)
      : '----';
  }, [
    exchangeTripData?.checkOutDate,
    exchangeTripData?.checkInDate,
    yourAvailableTime?.pricePerNight,
    range,
  ]);

  const textColor = useMemo(() => {
    if (typeof memoizedTotal === 'number') {
      if (memoizedTotal > 0) {
        return 'text-green-500';
      } else if (memoizedTotal < 0) {
        return 'text-red-500';
      } else {
        return 'text-gray-500';
      }
    } else {
      return 'text-gray-500';
    }
  }, [memoizedTotal]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    const formData = new FormData();
    formData.append('text', data.message);
    formData.append('authorId', currentUser?.userId);
    if (files[0]?.file) {
      formData.append('image', files[0]?.file ?? '');
    }
    MessageApis.sendMessage(conversationId, formData)
      .then((response) => {})
      .catch((err) => {});
    setFiles([]);
  };

  const handleNextStep = () => {
    ExchangeApis.approveExchange(exchangeId)
      .then(() => {
        setYourTripStatus((prev) => (prev ?? -1) + 1);
        toast.success('Exchange approved successfully!');
      })
      .catch((response) => {
        if (response && response.response.data) {
          toast.error(response.response.data.message);
        } else {
          toast.error('Something went wrong!');
        }
      });
  };

  const handlePreviousStep = () => {
    ExchangeApis.updateToPreviousStep(exchangeId)
      .then(() => {
        setYourTripStatus(0);
        toast.success('Exchange updated successfully!');
      })
      .catch((response) => {
        if (response && response.response.data) {
          toast.error(response.response.data.message);
        } else {
          toast.error('Something went wrong!');
        }
      });
  };

  return (
    <>
      <ConfirmCancelExchangeModal
        isOpen={confirmCancelExchangeOpen}
        onClose={() => {
          setConfirmCancelExchangeOpen(false);
        }}
      />
      <Grid className={'w-full h-full'} wrap="nowrap" container spacing={0}>
        <Grid xs={8} className={'border-r-[2px]'}>
          <div className={'w-full h-full overflow-hidden flex flex-col'}>
            <div className="cursor w-full flex border-b-[1px] dark:border-b-gray-600 py-3 px-2 lg:px-4 justify-between items-center shadow-sm bg-white">
              <div className="flex w-full gap-3 items-center">
                {/*<ViewListIcon />*/}
                <div className="relative">
                  <div className="rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
                    <Avatar
                      src={exchanger?.avatar ?? `/images/placeholder.jpg`}
                      alt={`exchanger's img`}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div>{exchanger?.fullName ?? exchanger?.username}</div>
                </div>
                <Stepper className="grow lg:px-32" activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                      error?: boolean;
                    } = {};
                    if (activeStep === -1) {
                      labelProps.optional = (
                        <Typography variant="caption" color="error">
                          Exchange cancelled
                        </Typography>
                      );
                      labelProps.error = true;
                    }
                    // if (label === 'Conversation') {
                    //   labelProps.optional = (
                    //     <Typography variant='caption' color='green'>
                    //       Exchanger approved
                    //     </Typography>
                    //   );
                    // }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStep !== 3 && activeStep !== -1 && (
                  <button
                    type="button"
                    onClick={() => setConfirmCancelExchangeOpen(true)}
                    className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40"
                  >
                    <svg
                      className="w-4 h-4 me-2 -ms-1"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="bitcoin"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 flex-1 overflow-y-auto dark:bg-black">
              {messages?.map((message, index) => (
                <MessageBox
                  isLast={index === messages?.length - 1}
                  key={message.messageId}
                  data={message}
                  users={users}
                  currentUser={currentUser}
                />
              ))}
              <div className="pt-4" ref={bottomRef} />
            </div>

            <div
              className={`bg-transparent w-full chat-image-preview ${
                files && files?.length ? '' : 'hidden'
              }`}
            >
              <FilePond
                allowMultiple={false}
                allowReorder={true}
                allowPaste={false}
                maxFiles={1}
                instantUpload={false}
                credits={false}
                ref={imageInput}
                files={files}
                onupdatefiles={setFiles}
                labelIdle={''}
              />
            </div>
            <div className={'bg-gray-50 lg:px-4'}>
              <div className="px-2 py-2 border bg-white dark:border-t-gray-600 flex items-center gap-1 lg:gap-2 w-full rounded-lg">
                {imageInput && (
                  <button
                    className="filepond--label-action"
                    onClick={() => {
                      if (imageInput) imageInput?.current?.browse();
                    }}
                  >
                    <HiPhoto size={32} className="text-[#F7A800]" />
                  </button>
                )}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex items-center gap-2 lg:gap-4 w-full"
                >
                  <Box className="relative w-full">
                    <input
                      id="message"
                      autoComplete={'message'}
                      {...register('message', { required: true })}
                      placeholder="Write a message"
                      className="text-black dark:text-white text-sm font-light py-1.5 px-4 bg-neutral-100 dark:bg-neutral-900 w-full rounded-full focus:outline-none"
                    />
                  </Box>
                  <button
                    type="submit"
                    className="rounded-full p-2 cursor-pointer bg-[#F7A800] hover:bg-amber-500 transition"
                  >
                    <HiPaperAirplane size={18} className="text-white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Grid>
        <Grid xs={4}>
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <TabContext value={tabValue}>
              <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
                <Tab label="Your trip" value="1" />
                <Tab label={`${exchanger?.fullName ?? exchanger?.username}'s trip`} value="2" />
              </Tabs>
              <TabPanel className={'p-1 lg:p-2'} value="1">
                <div className={'w-full h-full overflow-hidden flex flex-col gap-1'}>
                  {!isYourAvailableTimeValid && activeStep === 0 && (
                    <div
                      className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-1 rounded relative w-fit"
                      role="alert"
                    >
                      <span className="block sm:inline">
                        This apartment might be not available anymore.
                      </span>
                    </div>
                  )}
                  <div>
                    <Carousel slide={false} className="relative w-full h-[300px] z-40">
                      {yourAvailableTime?.coOwner?.property?.propertyImages?.map((image) => (
                        <div key={image.id} className="w-full h-full ">
                          <Image
                            src={
                              image.link ??
                              'https://media-cdn.tripadvisor.com/media/photo-s/28/fd/37/ed/pearl-farm-beach-resort.jpg'
                            }
                            alt="destination"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>

                  <div className="flex-grow p-3 sm:pr-6 flex flex-col items-start">
                    <div className="space-y-4 w-full">
                      <div className="inline-flex space-x-3">
                        <Badge
                          name={
                            <div className="flex items-center">
                              <i className="text-sm las la-share-alt"></i>
                              <span className="ml-1">
                                {yourAvailableTime?.coOwner?.property.propertyView.propertyViewName}
                              </span>
                            </div>
                          }
                        />
                        <Badge
                          name={
                            <div className="flex items-center">
                              <i className="text-sm las la-user-friends"></i>
                              <span className="ml-1">
                                {yourAvailableTime?.coOwner?.property.propertyType.propertyTypeName}
                              </span>
                            </div>
                          }
                          color="yellow"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        {/*{isAds && <Badge name="ADS" color="green" />}*/}
                        <h2 className="text-lg font-medium capitalize">
                          <span className="line-clamp-2">
                            {yourAvailableTime?.coOwner?.property.propertyName}
                          </span>
                        </h2>
                      </div>
                      <div className="inline-grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="hidden sm:inline-block">
                            <i className="las la-bed text-lg"></i>
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {yourAvailableTime?.coOwner?.property.numberBedsRoom} beds
                          </span>
                        </div>

                        {/* ---- */}
                        <div className="flex items-center space-x-2">
                          <span className="hidden sm:inline-block">
                            <i className="las la-bath text-lg"></i>
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {yourAvailableTime?.coOwner?.property.numberBedsRoom} baths
                          </span>
                        </div>

                        {/* ---- */}
                        <div className="flex items-center space-x-2">
                          <span className="hidden sm:inline-block">
                            <i className="las la-expand-arrows-alt text-lg"></i>
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {yourAvailableTime?.coOwner?.property.roomSize} Sq. Fit
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-600 text-sm ml-2">
                          <span className="line-clamp-1">
                            {yourAvailableTime?.coOwner?.property.resort.resortName}
                          </span>
                        </p>
                      </div>
                      <div className="flex w-full justify-between items-end">
                        {yourAvailableTime?.coOwner?.property.rating ? (
                          <StartRating
                            reviewCount={0}
                            point={yourAvailableTime?.coOwner?.property.rating}
                          />
                        ) : (
                          <div></div>
                        )}
                        <span className="flex items-center justify-center px-2.5 py-1.5 border-2 border-yellow-400 rounded-lg leading-none text-sm font-medium text-yellow-400">
                          {yourAvailableTime?.pricePerNight}{' '}
                          <Image width={18} height={18} src="/images/coin.png" alt="" />
                          /night
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-3 w-full h-full border-y border-gray-300`}>
                    <div
                      className={`p-1 border-l border-gray-300`}
                      onClick={() => setOpenDateRange((openDateRange) => !openDateRange)}
                    >
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Arrival
                        {activeStep === 0 && (
                          <MdModeEdit
                            onClick={() => setOpenDateRange((openDateRange) => !openDateRange)}
                            color={'#28ac81'}
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`${
                          range[0]?.startDate
                            ? format(range[0].startDate, 'MM/dd/yyyy')
                            : '-- /-- /----'
                        }`}
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                    <div
                      className={`p-1 border-x border-gray-300`}
                      onClick={() => setOpenDateRange((openDateRange) => !openDateRange)}
                    >
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Departure{' '}
                        {activeStep === 0 && (
                          <MdModeEdit
                            onClick={() => setOpenDateRange((openDateRange) => !openDateRange)}
                            color={'#28ac81'}
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`${
                          range[0]?.endDate
                            ? format(range[0].endDate, 'MM/dd/yyyy')
                            : '-- /-- /----'
                        }`}
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                    <div
                      ref={refDateRange}
                      className={`absolute left-1/2 transform -translate-x-1/2 top-1/2 border border-gray-300 z-50 lg:left-[57%]`}
                    >
                      {openDateRange && (
                        <DateRange
                          onChange={(item) => {
                            if (item) {
                              setRange([item.selection]);
                              handleOnChangeDateRangePicker(item.selection);
                            }
                          }}
                          disabledDates={timesDisableOnClick}
                          maxDate={
                            // yourAvailableTime?.endTime && isValidDate(yourAvailableTime.endTime)
                            //   ? new Date(
                            //       ...(yourAvailableTime.endTime.map((value, index) =>
                            //         index === 1 ? value - 1 : value
                            //       ) as [number, number, number])
                            //     )
                            //   : dayjs().add(2, 'month').toDate()
                            maxDate
                          }
                          minDate={
                            yourAvailableTime?.startTime && isValidDate(yourAvailableTime.startTime)
                              ? new Date(
                                  ...(yourAvailableTime.startTime.map((value, index) =>
                                    index === 1 ? value - 1 : value
                                  ) as [number, number, number])
                                ) > dayjs().toDate()
                                ? new Date(
                                    ...(yourAvailableTime.startTime.map((value, index) =>
                                      index === 1 ? value - 1 : value
                                    ) as [number, number, number])
                                  )
                                : dayjs().toDate()
                              : dayjs().toDate()
                          }
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          months={1}
                          direction="horizontal"
                          className={`absolute left-1/2 transform -translate-x-1/2 top-1/2 border border-gray-300 z-50 lg:left-[57%]`}
                        />
                      )}
                    </div>
                    <div className={`p-1 border-r border-gray-300`}>
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Guests {activeStep === 0}
                      </div>
                      <input
                        type="number"
                        readOnly
                        value={yourTrip?.numberOfGuest > 0 ? yourTrip?.numberOfGuest : 1}
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 w-full h-full border-gray-300`}>
                    <div className={`p-1 border border-gray-300`}>
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Price
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`${
                          yourAvailableTime?.pricePerNight &&
                          range[0]?.startDate &&
                          range[0]?.endDate
                            ? (yourAvailableTime?.pricePerNight ?? 1) *
                              differenceInDays(range[0]?.endDate, range[0]?.startDate)
                            : '----'
                        }`}
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 grow"></div>
                  <div className="flex items-center space-x-1">
                    <h1 className="text-lg font-bold capitalize">
                      <span className="line-clamp-2">Total:</span>
                    </h1>
                    <h1 className={`text-lg font-bold capitalize ${textColor}`}>
                      <span className="line-clamp-2">{memoizedTotal}</span>
                    </h1>
                    <Image width={18} height={18} src="/images/coin.png" alt="" />
                  </div>
                  <div className="flex flex-row justify-between">
                    {activeStep !== 3 &&
                      activeStep !== -1 &&
                      activeStep === (yourTripStatus ?? 0) && (
                        <Button
                          onClick={handleNextStep}
                          variant="outlined"
                          className={'max-w-[150px]'}
                          color="warning"
                        >
                          Approve
                        </Button>
                      )}
                    {activeStep === 1 && (
                      <Button
                        variant="outlined"
                        onClick={handlePreviousStep}
                        className={'max-w-[150px]'}
                        color="error"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </TabPanel>
              <TabPanel className={'p-1 lg:p-2'} value="2">
                <div className={'w-full h-full overflow-hidden flex flex-col gap-1'}>
                  {!isExchangeAvailableTimeValid && activeStep == 0 && (
                    <div
                      className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-1 rounded relative w-fit"
                      role="alert"
                    >
                      <span className="block sm:inline">
                        This apartment might be not available anymore.
                      </span>
                    </div>
                  )}
                  <div>
                    <Carousel slide={false} className="relative w-full h-[300px] z-40">
                      {exchangeAvailableTime?.coOwner?.property?.propertyImages?.map((image) => (
                        <div key={image.id} className="w-full h-full ">
                          <Image
                            src={
                              image.link ??
                              'https://media-cdn.tripadvisor.com/media/photo-s/28/fd/37/ed/pearl-farm-beach-resort.jpg'
                            }
                            alt="destination"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>

                  <div className="flex-grow p-3 sm:pr-6 flex flex-col items-start">
                    <div className="space-y-4 w-full">
                      <div className="inline-flex space-x-3">
                        <Badge
                          name={
                            <div className="flex items-center">
                              <i className="text-sm las la-share-alt"></i>
                              <span className="ml-1">
                                {
                                  exchangeAvailableTime?.coOwner?.property.propertyView
                                    .propertyViewName
                                }
                              </span>
                            </div>
                          }
                        />
                        <Badge
                          name={
                            <div className="flex items-center">
                              <i className="text-sm las la-user-friends"></i>
                              <span className="ml-1">
                                {
                                  exchangeAvailableTime?.coOwner?.property.propertyType
                                    .propertyTypeName
                                }
                              </span>
                            </div>
                          }
                          color="yellow"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        {/*{isAds && <Badge name="ADS" color="green" />}*/}
                        <h2 className="text-lg font-medium capitalize">
                          <span className="line-clamp-2">
                            {exchangeAvailableTime?.coOwner?.property.propertyName}
                          </span>
                        </h2>
                      </div>
                      <div className="inline-grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="hidden sm:inline-block">
                            <i className="las la-bed text-lg"></i>
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {exchangeAvailableTime?.coOwner?.property.numberBedsRoom} beds
                          </span>
                        </div>

                        {/* ---- */}
                        <div className="flex items-center space-x-2">
                          <span className="hidden sm:inline-block">
                            <i className="las la-bath text-lg"></i>
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {exchangeAvailableTime?.coOwner?.property.numberBedsRoom} baths
                          </span>
                        </div>

                        {/* ---- */}
                        <div className="flex items-center space-x-2">
                          <span className="hidden sm:inline-block">
                            <i className="las la-expand-arrows-alt text-lg"></i>
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {exchangeAvailableTime?.coOwner?.property.roomSize} Sq. Fit
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-600 text-sm ml-2">
                          <span className="line-clamp-1">
                            {exchangeAvailableTime?.coOwner?.property.resort.resortName}
                          </span>
                        </p>
                      </div>
                      <div className="flex w-full justify-between items-end">
                        {exchangeAvailableTime?.coOwner?.property.rating ? (
                          <StartRating
                            reviewCount={0}
                            point={exchangeAvailableTime?.coOwner?.property.rating}
                          />
                        ) : (
                          <div></div>
                        )}
                        <span className="flex items-center justify-center px-2.5 py-1.5 border-2 border-yellow-400 rounded-lg leading-none text-sm font-medium text-yellow-400">
                          {exchangeAvailableTime?.pricePerNight}{' '}
                          <Image width={18} height={18} src="/images/coin.png" alt="" />
                          /night
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-3 w-full h-full border-y border-gray-300`}>
                    <div className={`p-1 border-l border-gray-300`}>
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Arrival
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={
                          isValidDate(exchangeTripData.checkInDate)
                            ? dayjs(exchangeTripData?.checkInDate?.toString())?.format('DD/MM/YYYY')
                            : '-- /-- /----'
                        }
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                    <div className={`p-1 border-x border-gray-300`}>
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Departure
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={
                          isValidDate(exchangeTripData.checkOutDate)
                            ? dayjs(exchangeTripData?.checkOutDate?.toString())?.format(
                                'DD/MM/YYYY'
                              )
                            : '-- /-- /----'
                        }
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                    <div className={`p-1 border-r border-gray-300`}>
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Guests
                      </div>
                      <input
                        type="number"
                        readOnly
                        value={
                          exchangeTripData?.numberOfGuest > 0 ? exchangeTripData?.numberOfGuest : 1
                        }
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 w-full h-full border-gray-300`}>
                    <div className={`p-1 border border-gray-300`}>
                      <div className="px-1 text-sm text-gray-500 flex flex-row justify-between">
                        Price
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`${
                          exchangeAvailableTime?.pricePerNight &&
                          isValidDate(exchangeTripData.checkOutDate) &&
                          isValidDate(exchangeTripData.checkInDate)
                            ? (exchangeAvailableTime?.pricePerNight ?? 1) *
                              differenceInDays(
                                dayjs(exchangeTripData?.checkOutDate?.toString()).toDate(),
                                dayjs(exchangeTripData.checkInDate?.toString()).toDate()
                              )
                            : '----'
                        }`}
                        className="border-0 text-sm text-gray-600 focus:outline-0 focus:outline-transparent focus:border-0 focus:border-transparent focus:ring-0 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 grow"></div>
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ExchangeContainer;
