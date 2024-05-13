'use client';

import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';

import axios from 'axios';
import { format } from 'date-fns';
import { Button, Dropdown, Pagination, Table } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { BiBlock } from 'react-icons/bi';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdOutlinePending } from 'react-icons/md';
import SelectRouterStaff from '@/app/components/staff/SelectRouterStaff';
import HeadingDashboard from '@/app/components/HeadingDashboard';
import useDeactiveApartmentModal from '@/app/hooks/useDeactiveApartmentModal';
import dayjs from 'dayjs';
import { Tag } from 'antd';

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

const ListApartment: React.FC<OwnershipProps> = ({ ownershipStaff }) => {
  const [ownershipUserList, setOwnershipUserList] = useState(ownershipStaff);
  const router = useRouter();

  const onPageChange = (page: number) => setCurrentPage(page);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(ownershipStaff?.totalPages);
  const [loading, setLoading] = useState(false);
  const deactiveApartmentModal = useDeactiveApartmentModal();

  const axiosAuthClient = useAxiosAuthClient();

  const handleSearch = async () => {
    try {
      setLoading(true);
      let apiUrl = `https://holiday-swap.click/api/co-owners/propertyAndRoomId?pageNo=0&pageSize=8&sortDirection=desc&coOwnerStatus=ACCEPTED`;
      setCurrentPage(1);
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
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let apiUrl = `https://holiday-swap.click/api/co-owners/propertyAndRoomId?pageNo=${
        currentPage - 1
      }&pageSize=8&sortDirection=desc&coOwnerStatus=ACCEPTED`;
      if (searchTerm) {
        apiUrl += `&roomId=${searchTerm}`;
      }
      const ownerships = await axios.get(apiUrl);

      setOwnershipUserList(ownerships?.data);
      setTotalPages(ownerships?.data.totalPages);
    };
    fetchData();
  }, [currentPage, deactiveApartmentModal.isSuccess]);

  return (
    <div>
      <div className=" mb-10 mt-2">
        <HeadingDashboard
          routerDashboard="/staff"
          pageCurrentContent="List Apartment"
          pageCurrentRouter="/staff/listApartment"
        />
        <SelectRouterStaff />
      </div>
      <Fragment>
        <div className="flex flex-row items-center gap-2 pb-5">
          <div>Search by Apartment ID</div>
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
              <Table.HeadCell className="w-[300px]">Resort</Table.HeadCell>
              <Table.HeadCell className="w-[300px]">Property</Table.HeadCell>
              <Table.HeadCell className="w-[300px]">Apartment ID</Table.HeadCell>
              <Table.HeadCell className="w-[300px]">Status</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {ownershipUserList?.content.map((item: any, index: number) => {
                let status = 'ACTIVE';
                let type = 'success';
                let deactive: any[] = item.ownerShipMaintenance?.filter(
                  (e: any) => e.type == 'DEACTIVATE'
                );
                if (!deactive) deactive = [];
                if (deactive?.length > 0) {
                  status = `DEACTIVATE in ${dayjs(deactive[0].startDate).format('YYYY-MM-DD')}`;
                  type = 'error';
                }

                return (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-[250px]">
                      {item?.property.resort?.resortName}
                    </Table.Cell>
                    <Table.Cell>{item.property.propertyName}</Table.Cell>
                    <Table.Cell className="w-[140px]">{item.roomId}</Table.Cell>
                    <Table.Cell>
                      <Tag color={type}>{status}</Tag>
                    </Table.Cell>
                    <Table.Cell>
                      {deactive.length <= 0 ? (
                        <Dropdown
                          label=""
                          dismissOnClick={false}
                          renderTrigger={() => (
                            <span className="text-sky-500 hover:underline cursor-pointer">
                              Edit
                            </span>
                          )}
                        >
                          <Dropdown.Item
                            key={index}
                            value="DEACTIVATE"
                            className="flex items-center gap-2"
                            onClick={() =>
                              deactiveApartmentModal.onOpen(item.property.id, item.roomId)
                            }
                          >
                            <BiBlock size={18} color="red" />

                            <span className={`text-rose-500`}>DEACTIVATE</span>
                          </Dropdown.Item>
                        </Dropdown>
                      ) : (
                        <></>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <div className="w-full py-6 text-2xl font-bold flex items-center">Not have ownership</div>
        )}
        {ownershipUserList.totalElements > ownershipUserList.size && (
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

export default ListApartment;
