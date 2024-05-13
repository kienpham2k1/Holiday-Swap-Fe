'use client';

import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import useCreateOwnershipModal from '@/app/hooks/useCreateOwnershipModal';

import axios from 'axios';
import { format } from 'date-fns';
import { Button, Dropdown, Pagination, Table } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiBlock } from 'react-icons/bi';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdOutlinePending } from 'react-icons/md';
import SelectRouterStaff from './SelectRouterStaff';
import HeadingDashboard from '../HeadingDashboard';
import Link from 'next/link';

const statusList = [
  {
    status: 'ACCEPTED',
    icon: BsCheck2Circle,
    color: '#2fde26',
  },
  {
    status: 'REJECTED',
    icon: BiBlock,
    color: '#e62538',
  },
  {
    status: 'PENDING',
    icon: MdOutlinePending,
    color: '#e06d14',
  },
];

interface OwnershipProps {
  ownershipStaff?: any;
}

const ListApproveOwnership: React.FC<OwnershipProps> = ({ ownershipStaff }) => {
  const [ownershipUserList, setOwnershipUserList] = useState(ownershipStaff);
  const router = useRouter();

  const onPageChange = (page: number) => setCurrentPage(page);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(ownershipStaff?.totalPages);
  const [loading, setLoading] = useState(false);

  const axiosAuthClient = useAxiosAuthClient();

  const handleSearch = async () => {
    try {
      setLoading(true);
      let apiUrl = `https://holiday-swap.click/api/co-owners?pageNo=0&pageSize=8&sortDirection=desc`;

      if (searchTerm) {
        apiUrl += `&roomId=${searchTerm}`;
      }

      const ownerships = await axios.get(apiUrl);

      setOwnershipUserList(ownerships?.data);
      setTotalPages(ownerships?.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsSearch(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let apiUrl = `https://holiday-swap.click/api/co-owners?pageNo=${
        currentPage - 1
      }&pageSize=8&sortDirection=desc`;

      const ownerships = await axios.get(apiUrl);

      setOwnershipUserList(ownerships?.data);
      setTotalPages(ownerships?.data.totalPages);
    };
    fetchData();
  }, [currentPage]);

  return (
    <div>
      <div className=" mb-10 mt-2">
        <HeadingDashboard
          routerDashboard="/staff"
          pageCurrentContent="List approve ownership"
          pageCurrentRouter="/staff/listapproveOwnership"
        />
        <SelectRouterStaff />
      </div>
      <Fragment>
        <div className="flex flex-row items-center gap-2 pb-5">
          <div>Search by room ID</div>
          <input
            className="rounded-md"
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          <Button disabled={loading} onClick={handleSearch}>
            Search
          </Button>
        </div>
        {ownershipUserList && ownershipUserList.content.length > 0 ? (
          <Table>
            <Table.Head>
              <Table.HeadCell className="w-[130px]">Resort</Table.HeadCell>
              <Table.HeadCell className="w-[130px]">Property</Table.HeadCell>
              <Table.HeadCell className="w-[100px]">Apartment ID</Table.HeadCell>
              <Table.HeadCell className="w-[100px]">User</Table.HeadCell>

              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell className="w-[130px]">Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {ownershipUserList?.content.map((item: any, index: number) => {
                return (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-[250px]">
                      {item?.property.resort?.resortName}
                    </Table.Cell>
                    <Table.Cell>{item.property.propertyName}</Table.Cell>
                    <Table.Cell className="w-[140px]">{item.roomId}</Table.Cell>
                    <Table.Cell>
                      {item.user.fullName ? item.user.fullName : item.user.username}
                    </Table.Cell>
                    <Table.Cell>
                      {item.type === 'DEEDED' ? 'Owner forever' : 'Owner a previod time'}
                    </Table.Cell>
                    <Table.Cell>
                      {(() => {
                        if (item.status === 'ACCEPTED') {
                          return (
                            <div className="py-2 px-1 text-sm text-center  bg-slate-200 rounded-md text-green-500">
                              ACCEPTED
                            </div>
                          );
                        } else if (item.status === 'PENDING') {
                          return (
                            <div className="py-2 px-1 text-center text-sm bg-slate-200 rounded-md text-orange-600">
                              PENDING
                            </div>
                          );
                        } else if (item.status === 'REJECTED') {
                          return (
                            <div className="py-2 px-1 text-center text-sm bg-slate-200 rounded-md text-rose-600">
                              REJECTED
                            </div>
                          );
                        }
                      })()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={`/staff/listapproveOwnership/${item.id}`}
                        target="_blank"
                        className="text-sky-500 hover:underline cursor-pointer"
                      >
                        View detail
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <div className="w-full py-6 text-2xl font-bold flex items-center">Not have ownership</div>
        )}
        {ownershipUserList?.totalElements > ownershipUserList?.size && (
          <div className="flex py-5 overflow-x-auto sm:justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        )}
      </Fragment>
    </div>
  );
};

export default ListApproveOwnership;
