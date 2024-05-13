'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import { DateRange } from 'react-date-range';
import axios from 'axios';
import GetAvailableTimesHasCreatedByCoOwnerId from '@/app/actions/getAvailableTimesHasCreatedByCoOwnerId';
import GetTimeHasBookedByCoOwnerId from '@/app/actions/getTimeHasBookedByCoOwnerId';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { forEach } from 'lodash';
import { arrayBuffer } from 'stream/consumers';
import GetApartmentMantainByPropertyIdApartmentId from '@/app/actions/getApartmentMantainByPropertyIdApartmentId';
import AxiosClient from '@/app/libs/AxiosConfig2';
dayjs.extend(isoWeek);

interface IDate {
  checkIn: string;
  checkOut: string;
}
interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
const compareDates = (date1: Date, date2: Date) => {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();
  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();
  const formattedDate1 = new Date(year1, month1, day1);
  const formattedDate2 = new Date(year2, month2, day2);
  return formattedDate1.toDateString() === formattedDate2.toDateString();
};
const isDateInISOWeekNumber = (date: Date, targetWeekNumbers: number[]) => {
  const isoWeekNumber = getISOWeekNumber(date);
  const rangeWeek = getStartAndEndDateOfWeekISO(isoWeekNumber - 1, date.getFullYear());
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const subtractOneDay = new Date(year, month, day);
  subtractOneDay.setDate(subtractOneDay.getDate() - 1);
  const isoWeekNumber2 = getISOWeekNumber(subtractOneDay);
  return targetWeekNumbers.includes(isoWeekNumber2) || targetWeekNumbers.includes(isoWeekNumber);
};

const getISOWeekNumber = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const tempDate = new Date(Date.UTC(year, month, day));
  const dayOfWeek = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayOfWeek);
  const startOfYear: Date = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  let weekNumber = Math.ceil(((+tempDate - +startOfYear) / 86400000 + 1) / 7);
  return weekNumber;
};
const checkDateIsInBoundary = (array: IDate[], weeksTimeFrame: number[]) => {
  let arr: Date[] = [];
  array.forEach((e) => {
    let checkIn = new Date(e.checkIn);
    const currentDate = new Date();

    let checkOut = new Date(e.checkOut);
    currentDate.setHours(0, 0, 0, 0);
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    const yesterdayCheckIn = new Date(checkIn.getTime() - 24 * 60 * 60 * 1000);
    const startDateWeek = getStartAndEndDateOfWeekISO(
      getISOWeekNumber(checkIn),
      checkIn.getFullYear()
    ).startDate;
    const endDateWeek = getStartAndEndDateOfWeekISO(
      getISOWeekNumber(checkOut),
      checkOut.getFullYear()
    ).endDate;
    startDateWeek.setHours(0, 0, 0, 0);
    endDateWeek.setHours(0, 0, 0, 0);
    if (!weeksTimeFrame.includes(getISOWeekNumber(checkOut))) arr.push(checkOut);
    if (!weeksTimeFrame.includes(getISOWeekNumber(yesterdayCheckIn))) arr.push(checkIn);
    if (
      checkIn.toDateString() == currentDate.toDateString() ||
      checkOut.toDateString() == currentDate.toDateString()
    )
      arr.push(new Date());
  });
  return arr;
};
const dateIsConsecutive = (array: IDate[]) => {
  let arr: Date[] = [];
  array.forEach((element) => {
    let checkIn = new Date(element.checkIn);
    let checkOut = new Date(element.checkOut);
    for (let index = 1; index < array.length; index++) {
      const nextCheckIn = new Date(array[index].checkIn);
      const nextCheckOut = new Date(array[index].checkOut);
      if (checkOut.getTime() == nextCheckIn.getTime()) {
        arr.push(nextCheckIn);
      } else if (checkIn.getTime() == nextCheckOut.getTime()) {
        arr.push(nextCheckOut);
      }
    }
  });
  return arr;
};

const func4 = (ranges: any, array: IDate[], weeksTimeFrame: number[]) => {
  const { selection } = ranges;
  const startDate = selection.startDate;

  const endDate = selection.endDate;
  let result: Date[] = [];
  array.forEach((element) => {
    let checkIn = new Date(element.checkIn);
    checkIn.setHours(0, 0, 0, 0);
    let checkOut = new Date(element.checkOut);
    checkOut.setHours(0, 0, 0, 0);

    if (startDate.getTime() <= checkIn.getTime()) {
      if (startDate.getTime() <= checkOut.getTime()) result.push(checkOut);
    } else if (startDate.getTime() >= checkIn.getTime()) {
      if (startDate.getTime() >= checkIn.getTime()) result.push(checkIn);
    }
  });
  let x: Date[] = dateDiffIsGreaterTwo(array);

  x.forEach((e) => {
    result.push(new Date(e));
  });

  let b = checkDateIsInBoundary(array, weeksTimeFrame);

  b.forEach((e) => {
    result.push(new Date(e));
  });

  return result;
};

const dateDiffIsGreaterTwo = (array: IDate[]) => {
  let arr: Date[] = [];
  array.forEach((element) => {
    let checkIn = new Date(element.checkIn);
    let checkOut = new Date(element.checkOut);
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference > 1) {
      let theDateStart = checkIn;
      theDateStart = new Date(theDateStart.getTime() + 24 * 60 * 60 * 1000);
      while (theDateStart.getTime() < checkOut.getTime()) {
        arr.push(theDateStart);
        theDateStart = new Date(theDateStart.getTime() + 24 * 60 * 60 * 1000);
      }
    }
  });
  return arr;
};
function getStartAndEndDateOfWeekISO(week: number, year: number) {
  const startDate = dayjs().year(year).isoWeek(week).startOf('isoWeek').startOf('day');
  const endDate = dayjs().year(year).isoWeek(week).endOf('isoWeek').startOf('day').add(1, 'days');
  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
}
function getWeekNumbers(startDate: Date, endDate: Date) {
  let weekNumbers = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    let weekNumber = getISOWeekNumber(currentDate);
    weekNumbers.push(weekNumber);
    currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
  }

  return weekNumbers;
}
const ModalCoOwnerCalendar = (props: any) => {
  const initialDate = {
    startDate:
      new Date(props.coOwner.startTime) > new Date()
        ? new Date(props.coOwner.startTime)
        : new Date(),
    endDate:
      new Date(props.coOwner.startTime) > new Date()
        ? new Date(props.coOwner.startTime)
        : new Date(),
    key: 'selection',
  };
  const [coOwnerId, setCoOwnerId] = useState<number>(props.coOwnerId);
  const [detailCoOwner, setDetailCoOwner] = useState<any>(props.coOwner);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [pricePerNight, setPricePerNight] = useState<string>();
  const [timesHasCreated, setTimesHasCreated] = useState<IDate[]>([]);
  const [timesHasBooked, setTimesHasBooked] = useState<IDate[]>([]);
  const [timesDisable, setTimesDisable] = useState<any>([]);
  const [timesDisableOnClick, setTimesDisableOnClick] = useState<Date[]>([]);
  const [weeksTimeFrame, setWeeksTimeFrame] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [disableButtonSubmit, setDisableButtonSubmit] = useState(false);
  const [dateRange, setDateRange] = useState(initialDate);
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [apartmentMaintain, setApartmentMaintain] = useState<any[]>();

  useEffect(() => {
    let max: any = undefined;
    props.coOwner.endTime
      ? (max = new Date(new Date(props.coOwner.endTime).getFullYear(), 10, 31))
      : (max = new Date(new Date().getFullYear() + 20, 10, 31));
    let resortDeactive = props.coOwner.property.resort.resortMaintainces.filter(
      (e: any) => e.type == 'DEACTIVATE'
    );
    let propertyDeactive = props.coOwner.property.propertyMaintenance.filter(
      (e: any) => e.type == 'DEACTIVATE'
    );

    if (resortDeactive.length > 0) {
      if (new Date(max) > new Date(resortDeactive[0].startDate))
        max = new Date(resortDeactive[0].startDate);
    }
    if (propertyDeactive.length > 0) {
      if (new Date(max) > new Date(propertyDeactive[0].startDate))
        max = new Date(propertyDeactive[0].startDate);
    }
    if (max != undefined) max.setDate(max.getDate() - 1);
    setMaxDate(max);
  }, []);
  
  const [yearSelectBox, setYearSelectBox] = useState(new Date().getFullYear());
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const createAvailableTime = () => {
    setDisableButtonSubmit(true);
    let body = JSON.stringify({
      startTime: startTime,
      endTime: endTime,
      pricePerNight: pricePerNight,
    });
      AxiosClient.post(`v1/available-times/${coOwnerId}`, body)
      .then((response) => {
        props.fetchAvailableTimeByCoOwnerId();
        setOpen(false);
        message.success('Create success!.');
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response.data.message);
      });
    function disableButton() {
      setDisableButtonSubmit(false);
    }
    setTimeout(disableButton, 1500);
  };

  const handleDateChange = (value: any) => {
    const rs = func4(value, timesDisable, weeksTimeFrame);

    setTimesDisableOnClick(rs);
    setDateRange(value.selection);
  };

  useEffect(() => {
    const offset = new Date().getTimezoneOffset();
    var startDate = new Date(dateRange.startDate.getTime() - offset * 60 * 1000);
    var endDate = new Date(dateRange.endDate.getTime() - offset * 60 * 1000);
    setStartTime(startDate.toISOString().split('T')[0]);
    setEndTime(endDate.toISOString().split('T')[0]);
  }, [dateRange]);
  const fetchTimesDisable = async () => {
    const avCreated = await GetAvailableTimesHasCreatedByCoOwnerId({
      coOwnerId: coOwnerId,
    });
    const rs = avCreated?.map((element: any) => {
      const startDate = new Date(element.startTime);
      const endDate = new Date(element.endTime);
      const obj = { checkIn: startDate, checkOut: endDate };
      return obj;
    });
    const timesHasBooked = await GetTimeHasBookedByCoOwnerId({
      coOwnerId: coOwnerId,
    });
    const rs2 = timesHasBooked?.map((element: any) => {
      const startDate = new Date(element.checkIn);
      const endDate = new Date(element.checkOut);
      const obj = { checkIn: startDate, checkOut: endDate };
      return obj;
    });
    let rs3 = rs?.concat(rs2);
    let arrPropTimeMaintain = detailCoOwner.property?.propertyMaintenance
      ?.filter((e: any) => e.type == 'MAINTENANCE')
      .map((e: any) => {
        let start = new Date(e.startDate);
        start.setDate(start.getDate() - 1);
        let end = new Date(e.endDate);
        end.setDate(end.getDate() + 1);
        return { checkIn: start, checkOut: end };
      });
    let arrResoTimeMaintain = detailCoOwner.property?.resort?.resortMaintainces
      ?.filter((e: any) => e.type == 'MAINTENANCE')
      .map((e: any) => {
        let start = new Date(e.startDate);
        start.setDate(start.getDate() - 1);
        let end = new Date(e.endDate);
        end.setDate(end.getDate() + 1);
        return { checkIn: start, checkOut: end };
      });
    rs3 = rs3.concat(arrPropTimeMaintain);
    rs3 = rs3.concat(arrResoTimeMaintain);
    const apartmentMantain = await GetApartmentMantainByPropertyIdApartmentId(
      detailCoOwner.property.id,
      detailCoOwner.roomId
    );

    setApartmentMaintain(apartmentMantain);
    let arrApartmentMaintain = apartmentMantain
      ?.filter((e: any) => e.type == 'MAINTENANCE')
      .map((e: any) => {
        let start = new Date(e.startDate);
        start.setDate(start.getDate() - 1);
        let end = new Date(e.endDate);
        end.setDate(end.getDate() + 1);
        return { checkIn: start, checkOut: end };
      });
    rs3 = rs3.concat(arrApartmentMaintain);
    setTimesDisable(rs3);
    //====
    let apartmentDeactive = apartmentMantain?.filter((e: any) => e.type == 'DEACTIVATE');

    let max = maxDate;
    if (apartmentDeactive.length > 0) {
      if (new Date(max) > new Date(apartmentDeactive[0].startDate)) {
        max = new Date(apartmentDeactive[0].startDate);
        setMaxDate(max);
      }
    }
  };
  const fetchWeeks = () => {
    let weeks: number[] = [];
    props.coOwner.timeFrames.forEach((element: any) => {
      weeks.push(element.weekNumber);
    });
    weeks.sort(function (a, b) {
      return a - b;
    });
    setWeeksTimeFrame(weeks);
  };

  useEffect(() => {
    fetchTimesDisable();
    fetchWeeks();
    getTheListSelectWeek(yearSelectBox);
    setCheckedList([]);
    setDateRange(initialDate);
  }, [open]);

  useEffect(() => {
    let rs: Date[] = [];
    let p1 = dateDiffIsGreaterTwo(timesDisable);
    let p2 = dateIsConsecutive(timesDisable);
    rs = rs.concat(p1);
    rs = rs.concat(p2);
    let b = checkDateIsInBoundary(timesDisable, weeksTimeFrame);
    rs = rs.concat(b);
    setTimesDisableOnClick(rs);
  }, [JSON.stringify(timesDisable), JSON.stringify(weeksTimeFrame)]);

  function getTheListSelectWeek(year: number) {
    const arr = weeksTimeFrame.map((e: any, i: number) => {
      let disable = false;
      let arrDisable: number[] = [];
      timesDisable.map((e: any, i: number) => {
        const checkIn = new Date(e.checkIn);
        const checkOut = new Date(e.checkOut);

        if (checkIn.getFullYear() === year || checkOut.getFullYear() === year) {
          const x: any = getWeekNumbers(checkIn, checkOut);
          arrDisable = [...arrDisable, ...x];
        }
      });
      disable = arrDisable.includes(e);

      const range = getStartAndEndDateOfWeekISO(e, year);
      if (range.startDate < new Date() || range.endDate < new Date()) {
        disable = true;
      }

      if (range.endDate > maxDate) {
        disable = true;
      }

      let week = {
        label: e < 10 ? `${e}` : `${e}`,
        value: String(e),
        disabled: disable,
      };

      return week;
    });
    setPlainOptions(arr);
  }

  const [plainOptions, setPlainOptions] = useState<Option[]>([]);
  const defaultCheckedList: CheckboxValueType[] = [];
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: CheckboxValueType[]) => {
    function getAdjacentNumbers(min: number, max: number, input: number, options: Option[]) {
      let arrayRs: string[] = [];
      const optionsEnable = options.filter((op) => op.disabled == false);
      const optValue = optionsEnable.map((op) => op.value);
      let isAdjacent = true;
      if (input > min) {
        do {
          if (optValue.includes(min.toString())) {
            arrayRs.push(min.toString());
          } else {
            isAdjacent = false;
            arrayRs = [input.toString()];
          }
          min++;
        } while (isAdjacent && min <= input);
      } else {
        do {
          if (optValue.includes(max.toString())) {
            arrayRs.push(max.toString());
          } else {
            isAdjacent = false;
            arrayRs = [input.toString()];
          }
          max--;
        } while (isAdjacent && max >= input);
      }

      return arrayRs;
    }

    const theNewWeekInput: number = Number(list.filter((x) => !checkedList.includes(x))[0]);
    const arrPre: CheckboxValueType[] = list.filter((x) => x != theNewWeekInput);
    arrPre.sort((a, b) => Number(a) - Number(b));
    if (typeSelectWeek == 2) {
      const minList = arrPre[0] ? (arrPre[0] as number) : -1;
      const maxList = arrPre[arrPre.length - 1] ? (arrPre[arrPre.length - 1] as number) : -1;
      if (list.length > checkedList.length)
        list = getAdjacentNumbers(minList, maxList, theNewWeekInput, plainOptions);
    } else {
      list = list.filter((x) => !checkedList.includes(x));
    }
    setCheckedList(list);
    list.sort((a, b) => Number(a) - Number(b));
    if (list.length > 0) {
      const min: number = list[0] as number;
      const max: number = list[list.length - 1] as number;

      const dateWeek = {
        startDate:
          getStartAndEndDateOfWeekISO(min, yearSelectBox).startDate < new Date()
            ? new Date()
            : getStartAndEndDateOfWeekISO(min, yearSelectBox).startDate,
        endDate: getStartAndEndDateOfWeekISO(max, yearSelectBox).endDate,
        key: 'selection',
      };
      setDateRange(dateWeek);
    }
  };

  useEffect(() => {
    getTheListSelectWeek(yearSelectBox);
    setCheckedList([]);
  }, [yearSelectBox]);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions.map((op) => op.value) : []);
  };
  const [typeSelectWeek, setTypeSelectWeek] = useState<any>(1);
  function onChangeTypeSelect(e: RadioChangeEvent): void {
    setTypeSelectWeek(e.target.value);
  }

  return (
    <>
      <Space>
        <Button type="link" onClick={showModal} icon={<ExportOutlined />}>
          Create new public time
        </Button>
      </Space>
      <Modal
        open={open}
        title="Create new public time"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={1000}
      >
        <div className=" justify-center">
          <div className="flex w-full">
            <div className="pt-2 pl-2 pr-4 w-[300px]">
              <div>
                <DatePicker
                  allowClear={false}
                  onChange={(value: any, dateString: string) => {
                    setYearSelectBox(Number(dateString));
                  }}
                  picker="year"
                  className="rounded h-[35px] w-full"
                  defaultValue={
                    new Date(props.coOwner.startTime) > new Date()
                      ? dayjs(props.coOwner.startTime)
                      : dayjs()
                  }
                  disabledDate={(date: any) => {
                    let start;
                    let end;

                    new Date(props.coOwner.startTime) > new Date()
                      ? (start = new Date(props.coOwner.startTime))
                      : (start = new Date());
                    return (
                      date.toDate().getFullYear() < start.getFullYear() ||
                      date.toDate().getFullYear() > maxDate.getFullYear()
                    );
                  }}
                />
              </div>
              <div className="mt-2">
                <Radio.Group
                  onChange={(e) => {
                    onChangeTypeSelect(e);
                    if (typeSelectWeek == 2) {
                      setCheckedList([]);
                    }
                  }}
                  optionType="button"
                  buttonStyle="solid"
                  size="small"
                  value={typeSelectWeek}
                >
                  <Radio value={1}>Single week</Radio>
                  <Radio value={2}>Multiple weeks</Radio>
                </Radio.Group>
              </div>
              <div className="mt-2">
                <Checkbox.Group className="w-full" onChange={onChange} value={checkedList}>
                  <Row>
                    {plainOptions.map((e, i) => {
                      return (
                        <Col span={6} key={i}>
                          <Checkbox className="" value={e.value} disabled={e.disabled}>
                            {e.label}
                          </Checkbox>
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group>
              </div>
              <div className="mt-2 flex justify-end">
                <Button danger onClick={() => setCheckedList([])}>
                  Clear
                </Button>
              </div>
            </div>
            <div className="w-full">
              <DateRange
                editableDateInputs={true}
                dateDisplayFormat="yyyy-MM-dd"
                disabledDates={timesDisableOnClick}
                rangeColors={['#5C98F2']}
                ranges={[dateRange]}
                date={new Date()}
                onChange={(value: any) => {
                  handleDateChange(value);
                }}
                maxDate={maxDate}
                minDate={
                  new Date(props.coOwner.startTime) > new Date()
                    ? new Date(props.coOwner.startTime)
                    : new Date()
                }
                disabledDay={(date) => {
                  date.setHours(0, 0, 0, 0);
                  let disableDays = true;
                  disableDays = !isDateInISOWeekNumber(date, weeksTimeFrame);
                  return disableDays;
                }}
                weekStartsOn={1}
                weekdayDisplayFormat={'EEEEEE'}
                months={2}
                direction="horizontal"
                className="2px w-full"
              />
            </div>
          </div>
          <div className=" justify-center">
            <div className="flex w-full">
              <div className="pt-2 pl-2 pr-4 w-[300px]">
                <>Input price per night</>
              </div>
              <div className="w-full">
                <Input
                  placeholder="Input price per night"
                  className="rounded-md"
                  type="number"
                  value={pricePerNight}
                  min={1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (Number(e.target.value) < 1) {
                      setPricePerNight('');
                    } else {
                      setPricePerNight(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-3">
            <button
              className="border rounded-lg border-curent h-10 text-white bg-common hover:bg-sky-500 justify-self-center w-full"
              type="button"
              onClick={() => createAvailableTime()}
              disabled={disableButtonSubmit}
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCoOwnerCalendar;
