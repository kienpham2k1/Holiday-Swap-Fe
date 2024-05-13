'use client';
import React, { Fragment } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import useDeactiveResortModal from '@/app/hooks/useDeactiveResortModal';
import { BiBlock } from 'react-icons/bi';
import { MdOutlinePending } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import useMaintanceResortModal from '@/app/hooks/useMaintanceResortModal';
import Link from 'next/link';

interface IParams {
  resortId: string;
  resortStatus: string;
}

const DropDownEditResort: React.FC<IParams> = ({ resortId, resortStatus }) => {
  const route = useRouter();
  const deactiveResortModal = useDeactiveResortModal();
  const maintanceResortModal = useMaintanceResortModal();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        className="text-[40px]"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        ...
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem className="text-green-500 hover:underline items-center">
          <Link href={`/staff/staffeditresort/${resortId}`} target="_blank">
            <div className="flex flex-row gap-1">
              <FaRegEdit size={18} color="green" />
            <span>Edit</span>
            </div>
            
          </Link>
        </MenuItem>
        {resortStatus === 'ACTIVE' ? (
          <Fragment>
            <MenuItem
              className="text-red-500 flex flex-row gap-1 hover:underline items-center"
              onClick={() => {
                deactiveResortModal.onOpen(resortId, 'DEACTIVATE');
                handleClose();
              }}
            >
              <BiBlock size={18} color="red" />
              <span>Deactivate</span>
            </MenuItem>
            <MenuItem
              className="text-orange-500 flex flex-row gap-1 hover:underline items-center"
              onClick={() => {
                maintanceResortModal.onOpen(resortId, 'MAINTENANCE');
                handleClose();
              }}
            >
              <MdOutlinePending size={18} color="orange" />
              <span>Maintance</span>
            </MenuItem>
          </Fragment>
        ) : (
          <Fragment></Fragment>
        )}
      </Menu>
    </div>
  );
};
export default DropDownEditResort;
