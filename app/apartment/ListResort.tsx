'use client';

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import CardListResort from '../components/listResort/CardListResort';
import axios from 'axios';
import { Pagination } from 'flowbite-react';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ListResortProps {
  listApartment?: any;
  resortId: any;
  dateRange: any;
  numberOfGuest: any;
  currentUser: any;
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 100000000),
  key: 'selection',
};

const ListResort: React.FC<ListResortProps> = ({
  listApartment,
  resortId,
  dateRange,
  numberOfGuest,
  currentUser,
}) => {
  const [page, setPage] = useState<number>(1);
  const [listResort, setListResort] = useState<any>();
  const [resortIdValue, setResortIdValue] = useState<any>();
  const [numberOfGuestValue, setNumberOfGuestValue] = useState<number>(0);
  const [initialDate, setInitialDate] = useState(initialDateRange);
  const [dateRangeNew, setDateRangeNew] = useState<any>(initialDateRange);
  const [totalPages, setTotalPages] = useState<any>();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const resortIdParams = searchParams?.get('resortId');
  const dateRangeParamsSearch = searchParams?.get('dateRange');
  const numberOfGuestParams = searchParams?.get('numberOfGuest');
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (dateRangeParamsSearch) {
      const JSONDateRange = JSON.parse(dateRangeParamsSearch);
      const newDate = {
        key: 'selection',
        startDate: new Date(JSONDateRange.startDate),
        endDate: new Date(JSONDateRange.endDate),
      };
      setDateRangeNew(newDate);
    }
    if (resortIdParams) {
      setResortIdValue(resortIdParams as string);
    }

    if (numberOfGuestParams) {
      setNumberOfGuestValue(Number(numberOfGuestParams as string));
    }
  }, [resortIdParams, dateRangeParamsSearch, numberOfGuestParams]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let config = {};

      if (currentUser) {
        config = {
          headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
          },
        };
      }

      const response = await axios
        .get('https://holiday-swap.click/api/v1/apartment-for-rent', {
          ...config,
          params: {
            resortId: resortIdValue,
            checkIn:
              JSON.stringify(dateRangeNew) !== JSON.stringify(initialDateRange)
                ? format(dateRangeNew.startDate, 'yyyy-MM-dd')
                : '',
            checkOut:
              JSON.stringify(dateRangeNew) !== JSON.stringify(initialDateRange)
                ? format(dateRangeNew.endDate, 'yyyy-MM-dd')
                : '',
            guest: numberOfGuestValue,
            pageNo: page - 1, // API uses zero-based indexing
            pageSize: 12, // Adjust as needed
            sortBy: 'id',
            sortDirection: 'desc',
          },
        })
        .finally(() => {
          setIsLoading(false);
        });

      if (isMounted.current) {
        setListResort(response.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error as needed
    }
  };

  const fetchDataOnMount = async () => {
    // Fetch data only on the client side

    // Fetch data using the updated state
    if (typeof window !== 'undefined') {
      await fetchData();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchDataOnMount();
    }
  }, []); // Empty dependency array to ensure it runs only on mount

  useEffect(() => {
    fetchData();
  }, [page, resortIdValue, dateRangeNew, numberOfGuestValue, currentUser]);

  return (
    <Fragment>
      <div className="bg-white px-[20px] flex flex-col items-center justify-center xl:px-[50px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-5 py-[30px] w-full">
          {listResort && listResort.content.length > 0 ? (
            <Fragment>
              {isLoading ? (
                <section className="py-24 min-h-screen max-w-[2520px] flex items-center justify-center">
                  <div
                    className="w-20 h-20 rounded-full animate-spin
                    border-4 border-solid border-common border-t-transparent"
                  ></div>
                </section>
              ) : (
                listResort?.content?.map((item: any, index: number) => (
                  <CardListResort key={index} data={item} />
                ))
              )}
            </Fragment>
          ) : (
            <div className="w-full md:col-span-2 lg:col-span-3 xl:col-span-4 col-span-1 h-[500px] text-3xl font-bold justify-center">
              Not have apartment. You can search more apartment
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mb-7">
        {listResort && listResort.totalElements > listResort.pageable.pageSize ? (
          <Pagination
            currentPage={page}
            onPageChange={(page: number) => {
              setPage(page);
            }}
            showIcons
            totalPages={totalPages}
          />
        ) : (
          ''
        )}
      </div>
    </Fragment>
  );
};

export default ListResort;
