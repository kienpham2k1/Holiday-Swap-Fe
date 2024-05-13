'use client';
import React, { useState, useEffect } from 'react';
import Container from './Container';
import Logo from './navbar/Logo';
import LinkHeader from './navbar/LinkHeader';
import ButtonLoginHeader from './navbar/ButtonLoginHeader';
import { BiMenu } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import Navbar from './navbar/Navbar';
import clsx from 'clsx';
import useLoginModal from '../hooks/useLoginModal';
import UserMenu from './navbar/UserMenu';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import useBooking from '../hooks/useBooking';

interface HeaderProps {
  currentUser?: any | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const loginModal = useLoginModal();
  const isLogin = loginModal.isLogin;
  const pathName = usePathname();
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const { data: session } = useSession();
  const [userWallet, setUserWallet] = useState<any>();
  const pathname = usePathname();

  // const { data: session } = useSession();
  // console.log("Session: ", { session });

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isLogin === true) {
      if (currentUser && currentUser.role.roleId === 3) {
        router.push('/staff');
        loginModal.onLoginReset();
      } else if (currentUser && currentUser.role.roleId === 1) {
        router.push('/admin');
        loginModal.onLoginReset();
      }
    }
  }, [isLogin, currentUser]);

  const booking = useBooking();
  const isSuccess = booking.isSuccess;

  const accessToken = session?.user?.access_token;
  const config = { headers: { Authorization: `Bearer ${accessToken}` } };

  useEffect(() => {
    const fetchUserWallet = async () => {
      if (currentUser && accessToken) {
        const wallet = await axios.get(
          `https://holiday-swap.click/api/v1/point/user_wallet`,
          config
        );
        if (wallet) {
          setUserWallet(wallet.data);
        }
      }
    };
    fetchUserWallet();

    if (isSuccess === true) {
      fetchUserWallet();
      booking.onSuccessReset();
    }
  }, [currentUser, accessToken, isSuccess]);

  return (
    <div className={clsx(`w-full z-50 fixed`)}>
      <Container
        className={
          scroll
            ? 'bg-white opacity-90 -translate-y-1 duration-300 shadow-md py-4 md:block hidden'
            : 'py-4'
        }
      >
        <div className={clsx(`hidden md:block`)}>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center gap-3">
              <Logo />
              {currentUser === undefined ? (
                <div className="ml-24">
                  <LinkHeader />
                </div>
              ) : (
                ''
              )}
              {currentUser?.role?.name === 'Membership' ? (
                <div className="ml-28">
                  <LinkHeader />
                </div>
              ) : (
                <div className="mr-7">{/* <LinkHeader /> */}</div>
              )}

              {currentUser ? (
                <UserMenu currentUser={currentUser} userWallet={userWallet} />
              ) : (
                <ButtonLoginHeader onClick={loginModal.onOpen} />
              )}
            </div>
          </div>
        </div>
      </Container>
      <div className="hidden md:block md:w-full md:h-[1px] md:bg-gray-200 md:-mt-1"></div>

      {!pathname?.includes('/informationBooking') && (
        <Container
          className={
            scroll
              ? 'bg-white opacity-90 -translate-y-1 duration-300 shadow-md py-4 block md:hidden'
              : ''
          }
        >
          <div className="sm:block md:hidden w-full py-4">
            <div className="flex flex-row justify-between items-center gap-3 md:py-8 px-4">
              <Logo />
              <div onClick={handleMenu} className="mx-4">
                {openMenu ? <IoMdClose size={30} /> : <BiMenu size={30} />}
              </div>
            </div>
          </div>
        </Container>
      )}

      {openMenu ? (
        <div className="md:hidden sm:block min-h-full transition-all overflow-x-hidden overflow-y-auto relative">
          <div
            className={`translate duration-300 h-full ${
              openMenu ? `translate-y-0` : 'translate-y-full'
            }`}
          >
            <Navbar onClick={handleMenu} />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Header;
