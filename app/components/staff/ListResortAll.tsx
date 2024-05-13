'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import SelectRouterStaff from './SelectRouterStaff';
import DropdownStatusResort from './DropdownStatusResort';
import GetListResort from '@/app/actions/getListResort';
import { Button, Dropdown, Pagination } from 'flowbite-react';
import HeadingDashboard from '../HeadingDashboard';
import { BsCheck2Circle } from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { MdOutlinePending } from 'react-icons/md';
import useAxiosAuthClient from '@/app/hooks/useAxiosAuthClient';
import toast from 'react-hot-toast';
import axios from 'axios';
import useDeactiveResortModal from '@/app/hooks/useDeactiveResortModal';
import useMaintanceResortModal from '@/app/hooks/useMaintanceResortModal';
import { useRouter } from 'next/navigation';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const statusList = [
  {
    status: 'ACTIVE',
    icon: BsCheck2Circle,
    color: '#2fde26',
  },
  {
    status: 'DEACTIVATE',
    icon: BiBlock,
    color: '#e62538',
  },
  {
    status: 'MAINTANCE',
    icon: MdOutlinePending,
    color: '#F49925',
  },
];

function createData(
  resortname: string,
  address: string,
  meter: string,
  bedroom: string,
  rules: string
) {
  return { resortname, address, meter, bedroom, rules };
}

interface ListResortAllProps {
  resorts?: any;
}
const ListResortAll: React.FC<ListResortAllProps> = ({ resorts: initialResorts }) => {
  const [resorts, setResorts] = React.useState<any>(initialResorts);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(resorts?.totalPages);
  const deactiveResortModal = useDeactiveResortModal();
  const [resortName, setResortName] = React.useState<string>('');
  const isSuccess = deactiveResortModal.isSuccess;
  const router = useRouter();

  const maintanceResortModal = useMaintanceResortModal();
  const [isChangeStatus, setIsChangeStatus] = React.useState(false);
  const pageSize = 10;
  // const totalPages = Math.ceil(resorts?.totalElements / pageSize);
  const [filteredResorts, setFilteredResorts] = React.useState<any>(initialResorts);

  const axiosAuthClient = useAxiosAuthClient();

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResortName(event.target.value);
  };

  const filterResorts = async () => {
    let config = { resortName };
    const newData = await GetListResort('0', config);

    if (newData) {
      setFilteredResorts(newData);
      setTotalPages(newData?.totalPages);
    }
  };

  const onPageChange = async (newPage: any) => {
    try {
      let pageNoParam = newPage - 1;
      let config = { resortName };
      let newResortsData: any;

      if (config) {
        newResortsData = await GetListResort(pageNoParam.toString(), config);
      } else {
        newResortsData = await GetListResort(pageNoParam.toString());
      }

      setFilteredResorts(newResortsData);
      setTotalPages(newResortsData?.totalPages);

      setCurrentPage(newPage);
    } catch (error) {
      console.error('Error fetching list of resorts:', error);
    }
  };

  const handleOnChangeStatus = (id: any, value: any) => {
    const body = value;
    const config = {
      headers: { 'Content-type': 'application/json' },
    };

    axiosAuthClient
      .put(`/resorts/${id}/status`, body, config)
      .then(async () => {
        toast.success('Update status success');
        const newList = await GetListResort((currentPage - 1).toString());
        setResorts({
          content: newList.content,
          totalElements: newList.totalElements,
        });
        setIsChangeStatus(true);
      })
      .catch((response) => {
        toast.error(response);
      })
      .finally(async () => {
        const newList = await GetListResort((currentPage - 1).toString());
        setResorts({
          content: newList.content,
          totalElements: newList.totalElements,
        });
      });
  };

  return (
    <>
      <div className="mt-2">
        <HeadingDashboard
          routerDashboard="/staff"
          pageCurrentContent="List resort"
          pageCurrentRouter="/staff/listresort"
        />
      </div>
      <SelectRouterStaff />
      <div className="text-common text-[20px] font-bold pt-5 ">List Resort</div>
      <div className="flex items-center my-4 gap-2">
        <label htmlFor="search" className="mr-2 text-sm">
          Search by Resort Name:
        </label>
        <input
          type="text"
          id="search"
          value={resortName}
          onChange={handleSearchTermChange}
          className="border p-2 rounded-md"
        />
        <Button onClick={filterResorts}>Search</Button>
      </div>
      {filteredResorts && filteredResorts?.content.length > 0 ? (
        <React.Fragment>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className="!bg-white !text-black !text-[17px] !font-semibold w-[270px]">
                    Resort Name{' '}
                  </StyledTableCell>
                  <StyledTableCell
                    className="!bg-white !text-black !text-[17px] !font-semibold"
                    align="left"
                  >
                    Address
                  </StyledTableCell>
                  <StyledTableCell
                    className="!bg-white !text-black !text-[17px] w-[200px] !font-semibold"
                    align="left"
                  >
                    Property Type
                  </StyledTableCell>
                  <StyledTableCell
                    className="!bg-white !text-black !text-[17px] !font-semibold"
                    align="left"
                  >
                    Status
                  </StyledTableCell>

                  <StyledTableCell
                    className="!bg-white !text-black !text-[17px] !font-semibold"
                    align="right"
                  >
                    Action{' '}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResorts?.content.map((row: any, index: number) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell className="!py-5 !text-common" component="th" scope="row">
                      <Link href={`/staff/staffdetailresort/${row.id}`} className="hover:underline">
                        {row.resortName}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="line-clamp-1">{row.addressLine}</div>
                    </StyledTableCell>
                    <StyledTableCell className="!py-5" align="left">
                      {row.propertyTypes.slice(0, 3).map((item: any, index: number) => (
                        <div key={index}>{item.propertyTypeName}</div>
                      ))}
                    </StyledTableCell>
                    <StyledTableCell className="!py-5 " align="left">
                      {(() => {
                        let statusText = '';
                        if (row.status === 'ACTIVE') {
                          statusText = 'ACTIVE';
                        } else if (row.status === 'DEACTIVATE') {
                          statusText = 'DEACTIVATE';
                        } else if (row.status === 'MAINTANCE') {
                          statusText = 'MAINTANCE';
                        }

                        return (
                          <div
                            className={`py-2 px-1 text-sm text-center  bg-slate-200 font-bold rounded-md ${
                              statusText === 'ACTIVE' ? 'text-green-500' : ''
                            } ${statusText === 'DEACTIVATE' ? 'text-rose-500' : ''} ${
                              statusText === 'MAINTANCE' ? 'text-orange-500' : ''
                            }`}
                          >
                            {statusText}
                          </div>
                        );
                      })()}
                    </StyledTableCell>

                    <StyledTableCell className="!py-5 w-[120px] !text-green-500 " align="right">
                      <Link
                        href={`/staff/staffdetailresort/${row.id}`}
                        target="_blank"
                        className="text-common underline hover:cursor-pointer"
                      >
                        View detail
                      </Link>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredResorts.totalPages > 1 && (
            <div className="flex py-5 overflow-x-auto sm:justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="pt-5 flex flex-row w-full justify-center text-xl font-bold">
          Not have resort
        </div>
      )}
    </>
  );
};

export default ListResortAll;
