'use client';

import { differenceInDays, format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState, useEffect } from 'react';
import HeadingDashboard from '../HeadingDashboard';
import { Pagination } from 'flowbite-react';
import { CiFilter } from 'react-icons/ci';
import Link from 'next/link';

interface OwnerBookingProps {
  historyOwnerBooking: any;
}

const OwnerBooking: React.FC<OwnerBookingProps> = ({ historyOwnerBooking }) => {
  const router = useRouter();

  const calculateNightDifference = (startDate: any, endDate: any) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nightDifference = differenceInDays(end, start);
    return nightDifference;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang
  const [displayedItems, setDisplayItems] = useState<any>();
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');

  // Tính toán số trang dựa trên số lượng mục và số lượng mục trên mỗi trang
  useEffect(() => {
    if (historyOwnerBooking) {
      setPageCount(Math.ceil(historyOwnerBooking?.length / itemsPerPage));
    }
  }, [historyOwnerBooking]);

  // Hàm xử lý sự kiện khi trang thay đổi
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  // Sử dụng `.slice()` để lấy danh sách các mục cần hiển thị trên trang hiện tại

  const onPageChange = (page: number) => setCurrentPage(page);

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(newSortOrder);
  };

  const sortedItems = historyOwnerBooking?.sort((a: any, b: any) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);

    return dateB.valueOf() - dateA.valueOf();
  });

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayItems(sortedItems?.slice(startIndex, endIndex));
  }, [currentPage, sortedItems, itemsPerPage]);

  return (
    <Fragment>
      <div className="mt-7">
        <HeadingDashboard
          routerDashboard="/dashboard"
          pageCurrentContent="Owner booking"
          pageCurrentRouter="/dashboard/ownerBooking"
        />
      </div>
      <div className="pb-6 pt-3">
        {/* <div className="py-6">
          <div
            onClick={handleSortToggle}
            className="p-3 border border-slate-300 hover:cursor-pointer rounded-full 
          justify-center shadow-md flex flex-row items-center gap-1 w-72 transition-all duration-300 transform active:scale-95"
          >
            <div>
              Created date: <span>{sortOrder}</span>
            </div>
            <CiFilter size={20} />
          </div>
        </div> */}
        {displayedItems?.length > 0 ? (
          <Fragment>
            {displayedItems.map((item: any) => (
              <Link
                href={`/dashboard/ownerBooking/${item.bookingId}`}
                target="_blank"
                key={item.bookingId}
                className="grid grid-cols-12 h-[150px] bg-white rounded-lg shadow-lg justify-between hover:cursor-pointer my-5 translate-y-0 duration-300 
                hover:-translate-y-3 hover:duration-300 transition-all transform active:scale-95 hover:border-2 hover:border-common"
              >
                <div className="col-span-9">
                  <div className="grid grid-cols-9 h-full gap-5">
                    <div className="col-span-3 w-full h-full relative rounded-lg">
                      <Image
                        src={item.propertyImage}
                        fill
                        alt="image"
                        className="w-full object-cover rounded-tl-md rounded-bl-md"
                      />
                    </div>
                    <div className="col-span-6 flex flex-col">
                      <div className="py-2">
                        <div className="text-xs text-gray-700">{item.resortName}</div>
                        <div className="text-lg font-bold ">{item.propertyName}</div>
                      </div>
                      <div className="text-base text-gray-700">
                        {format(new Date(item.checkInDate), 'dd, MMM yyyy')} -{' '}
                        {format(new Date(item.checkOutDate), 'dd, MMM yyyy')}
                      </div>
                      <div className="text-base text-gray-700">
                        Number of nights:{' '}
                        {calculateNightDifference(item.checkInDate, item.checkOutDate)}
                      </div>
                      <div className="text-base text-gray-700">
                        Total: <span className="text-black">{item.price} point</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 flex flex-row justify-center items-center">
                  <div
                    className={`text-lg ${
                      item.status === 'SUCCESS' ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {item.status}
                  </div>
                </div>
              </Link>
            ))}
            {historyOwnerBooking?.length > itemsPerPage && (
              <div className="flex justify-center py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pageCount}
                  onPageChange={onPageChange}
                  showIcons
                />
              </div>
            )}
          </Fragment>
        ) : (
          <div>
            <div className="text-[30px]">Owner booking</div>
            <div className="w-full h-[1px] bg-gray-300 my-8"></div>
            <div className="text-[25px] font-bold">No your apartments are booked....Not yet!</div>
            <div className="py-5 text-gray-700">
              It&apos;s time to dust off your bags and start planning for your next adventure
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default OwnerBooking;
