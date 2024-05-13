'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import MainMap from '../map/MainMap';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LinkHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-row space-x-9 text-gray-500">
      <div
        onClick={() => router.push('/')}
        className={`hover:text-black cursor-pointer flex flex-col items-center ${
          pathname === '/' ? 'text-black' : ''
        }`}
      >
        Home
        {pathname === '/' ? (
          <span className="bg-gray-300 rounded-full w-2 h-2"></span>
        ) : (
          <span></span>
        )}
      </div>
      <div
        onClick={() => router.push('/apartment')}
        className={`hover:text-black cursor-pointer flex flex-col items-center ${
          pathname === '/apartment' ? 'text-black' : ''
        }`}
      >
        Apartments
        {pathname === '/apartment' ? (
          <span className="bg-gray-300 rounded-full w-2 h-2"></span>
        ) : (
          <span></span>
        )}
      </div>
      <div
        onClick={() => router.push('/blog')}
        className={`hover:text-black cursor-pointer flex flex-col items-center ${
          pathname === '/blog' ? 'text-black' : ''
        }`}
      >
        Blogs
        {pathname === '/blog' ? (
          <span className="bg-gray-300 rounded-full w-2 h-2"></span>
        ) : (
          <span></span>
        )}
      </div>
      <div onClick={handleClickOpen} className="hover:text-black cursor-pointer list-none">
        <li className="rounded-full cursor-pointer">
          <p className="flex font-medium items-center">Map View</p>
        </li>
      </div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <button
          className="bg-black text-white py-2 px-8 rounded my-2 hover:bg-gray-600 transition ease-in duration-100 fixed right-16 bottom-3.5 w-fit z-10"
          // OnClick - Router Routes Back to the last page
          onClick={handleClose}
        >
          <p>Close Map View</p>
        </button>
        <MainMap data={undefined}></MainMap>
      </Dialog>
    </div>
  );
};

export default LinkHeader;
