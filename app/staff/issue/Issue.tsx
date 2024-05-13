'use client';

import HeadingDashboard from '@/app/components/HeadingDashboard';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect } from 'react';
import { Button, Label, Table, TextInput } from 'flowbite-react';
import useChangeStatusIssueModal from '@/app/hooks/useChangeStatusIssueModal';
import GetListIssue from '@/app/actions/getListIssue';
import Link from 'next/link';

interface IssueProps {
  issue: any;
}

const Issue: React.FC<IssueProps> = ({ issue }) => {
  const router = useRouter();

  const [searchName, setSearchName] = React.useState<string>('');
  const [filteredIssues, setFilteredIssues] = React.useState<any[]>(issue);
  const changeStatusIssueModal = useChangeStatusIssueModal();
  const isSuccess = changeStatusIssueModal.isSuccess;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Filter issues based on the entered bookingId
    const filtered = issue.filter((item: any) => item?.bookingId?.toString().includes(searchName));
    setFilteredIssues(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isSuccess === true) {
        const newDetail = await GetListIssue();
        if (newDetail) {
          setFilteredIssues(newDetail);
          changeStatusIssueModal.onSuccessReset();
        }
      }
    };
    fetchData();
  }, [isSuccess]);

  const sortedItems = filteredIssues?.sort((a: any, b: any) => {
    const dateA = new Date(a.createdOn);
    const dateB = new Date(b.createdOn);

    return dateB.valueOf() - dateA.valueOf();
  });

  return (
    <Fragment>
      <div className="">
        <HeadingDashboard
          routerDashboard="/staff"
          pageCurrentContent="Issue booking"
          pageCurrentRouter="/staff/issue"
        />
      </div>

      <div className="pb-6 pt-4">
        <form onSubmit={handleSearch}>
          <Label
            htmlFor="searchName"
            value="Search Booking ID: "
            className="mx-1 inline-block align-middle"
          />
          <div className="flex">
            <TextInput
              name="searchName"
              type="text"
              className="mx-1"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>

      <div className="py-6">
        {sortedItems && sortedItems.length > 0 ? (
          <Table>
            <Table.Head>
              <Table.HeadCell>Booking ID</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Note</Table.HeadCell>
              <Table.HeadCell>Created on</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {sortedItems.map((item: any, index: any) => (
                <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="">
                  
                      {item.bookingId}
                   
                  </Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell className="w-[200px]">{item.note}</Table.Cell>
                  <Table.Cell>{format(new Date(item?.createdOn), 'dd/MM/yyyy')}</Table.Cell>
                  <Table.Cell
                    className={`${item.status === 'OPEN' ? 'text-green-500' : ''} ${
                      item.status === 'REFUND' ? 'text-orange-500' : ''
                    } ${item.status === 'RESOLVE' ? 'text-sky-500' : ''} font-bold`}
                  >
                    {item.status}
                  </Table.Cell>
                  <Table.Cell>
                    {item.status === 'OPEN' && (
                      <div
                        onClick={() => changeStatusIssueModal.onOpen(item.id)}
                        className=" w-[100px] font-medium text-cyan-600 hover:underline hover:cursor-pointer dark:text-cyan-500"
                      >
                        Edit
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div>
            <div className="text-[25px] font-bold">No issue booking!</div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Issue;
