'use client';

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import ConversationApis, { Conversation } from '@/app/actions/ConversationApis';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '@/app/redux/slices/pushNotificationSlice';
import { useSocket } from '@/app/hooks/useSocket';
import ChatWidget from '@/app/components/notification/ChatWidget';
import {
  fetchConversations,
  setConversationLoaded,
  setCurrentUserId,
} from '@/app/redux/slices/conversationSlice';
import { usePathname } from 'next/navigation';
import { NotificationResponse } from '@/app/components/notification/types';
import { MdDashboard, MdOutlineSwapHorizontalCircle } from 'react-icons/md';
import { IoIosCreate, IoIosLogOut, IoIosChatboxes } from 'react-icons/io';
import { FaListCheck, FaList } from 'react-icons/fa6';
import { FaMoneyCheckAlt, FaHouseUser } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import MenuItem from './MenuItem';
import Image from 'next/image';
import NotificationWidget from '@/app/components/notification/NotificationWidget';
import NotificationApis from '@/app/actions/NotificationApis';
import useWriteBlogModal from '@/app/hooks/useWriteBlogModal';
import useRecharge from '@/app/hooks/useRecharge';
import UserApis from '@/app/actions/UserApis';
import useLoginModal from '@/app/hooks/useLoginModal';
import Link from 'next/link';

interface UserMenuProps {
  currentUser?: Object | any | null;
  userWallet: any;
}

export const useToggle = (
  setter: React.Dispatch<React.SetStateAction<boolean>>,
  reSetters: React.Dispatch<React.SetStateAction<boolean>>[] = []
) => {
  return useCallback(() => {
    setter((value) => !value);
    reSetters.forEach((item) => item(false));
  }, [setter, reSetters]);
};

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, userWallet }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const notifications = useSelector((state: any) => state.pushNotification.data);
  const conversations = useSelector((state: any) => state.conversation.data);
  const countUnreadMessages = useSelector((state: any) => state.conversation.countUnreadMessages);
  const conversationsLoaded = useSelector((state: any) => state.conversation.loaded);
  const writeBlogModal = useWriteBlogModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const router = useRouter();
  const socket = useSocket();
  const [notificationsList, setNotificationsList] = useState(notifications ?? []);
  const [conversationsList, setConversationsList] = useState(conversations ?? []);
  const recharge = useRecharge();
  const pathName = usePathname();
  const loginModal = useLoginModal();
  const isLogin = loginModal.isLogin;

  useEffect(() => {
    setNotificationsList(notifications);
  }, [notifications, notificationsList]);

  const toggleOpen = useToggle(setIsOpen, [setIsNotificationOpen, setIsMessageOpen]);
  const toggleNotificationOpen = useToggle(setIsNotificationOpen, [setIsOpen, setIsMessageOpen]);
  const toggleMessageOpen = useToggle(setIsMessageOpen, [setIsOpen, setIsNotificationOpen]);

  const handleRouter = (route: string) => {
    router.push(route);
    setIsOpen(false);
  };

  useEffect(() => {
    pathName && pathName.includes('/chat') && setIsMessageOpen(false);
  }, [pathName]);

  useEffect(() => {
    console.log('FETCHING DATA...');
    const fetchData = async () => {
      try {
        const [notifications, userProfile, conversations] = await Promise.all([
          NotificationApis.getAll(),
          UserApis.getCurrentUserProfile(),
          ConversationApis.getCurrentUserConversation(),
        ]);
        dispatch(fetchNotifications(notifications));
        dispatch(setCurrentUserId(userProfile.userId));
        dispatch(setConversationLoaded(false));
        dispatch(fetchConversations(conversations));
        dispatch(setConversationLoaded(true));
        console.log('FETCH SUCCESSFUL');
      } catch (error) {
        console.error('FETCH ERROR:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (conversationsLoaded) {
      const conversationIds =
        conversations?.map((item: Conversation) => item.conversationId.toString()) || [];
      socket.subscribeHandler(currentUser, conversationIds);
    }
  }, [conversations, socket]);

  const handleOpenWriteBlogModal = () => {
    writeBlogModal.onOpen();
    setIsOpen(false);
  };

  useEffect(() => {
    if (isLogin === true) {
      setIsOpen(false);
    }
  }, [isLogin]);

  return (
    <>
      <div className="items-center flex flex-row space-x-9 text-gray-500">
        <div className="cursor-pointer flex items-center" onClick={toggleMessageOpen}>
          <div className="relative">
            <svg
              className="w-8 h-8 text-gray-600 animate-wiggle"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M8 10H16M8 14H16M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
                  stroke="#000000"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            {conversations && countUnreadMessages != null && countUnreadMessages > 0 && (
              <div className="px-1 neutral-100 rounded-full text-center text-gray text-sm absolute -top-3 -end-2">
                {countUnreadMessages}
                <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-gray-200 w-full h-full"></div>
              </div>
            )}
          </div>
        </div>

        <div className="cursor-pointer flex items-center" onClick={toggleNotificationOpen}>
          <div className="relative">
            <svg
              className="w-8 h-8 text-gray-600 animate-wiggle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 21 21"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
              />
            </svg>
            {notificationsList &&
              (() => {
                const readNotificationsCount = notificationsList.filter(
                  (item: NotificationResponse) => !item.isRead
                ).length;
                return readNotificationsCount > 0 ? (
                  <div className="px-1 neutral-100 rounded-full text-center text-gray text-sm absolute -top-3 -end-2">
                    {readNotificationsCount}
                    <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-gray-200 w-full h-full"></div>
                  </div>
                ) : null;
              })()}
          </div>
        </div>
        <div onClick={toggleOpen} className="cursor-pointer flex items-center gap-3">
          <Image
            src={currentUser?.avatar || '/images/placeholder.jpg'}
            alt="Avartar"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="text-gray-400">
            {currentUser?.fullName ? currentUser.fullName : currentUser.username}
            {(currentUser?.role?.roleId === 2 || currentUser?.role?.roleId === 4) && (
              <div className="text-gray-400 flex flex-row gap-1 items-center ">
                <div className="text-black text-[13px]">{userWallet?.totalPoint?.toFixed(1)}</div>
                <img className="w-[18px] h-[18px]" src="/images/coin.png" alt="" />
              </div>
            )}
          </div>
        </div>
      </div>

      {isMessageOpen ? (
        <div className="absolute rounded-xl shadow-md bg-white max-h-96 right-20 top-20 text-sm z-max">
          <div className="flex flex-col cursor-pointer">
            <Fragment>
              <ChatWidget currentUser={currentUser}></ChatWidget>
            </Fragment>
          </div>
        </div>
      ) : (
        ''
      )}

      {isNotificationOpen ? (
        <div className="absolute rounded-xl shadow-md bg-white max-h-96 right-20 top-20 text-sm z-max">
          <div className="flex flex-col cursor-pointer">
            <Fragment>
              <NotificationWidget></NotificationWidget>
            </Fragment>
          </div>
        </div>
      ) : (
        ''
      )}

      {isOpen ? (
        <div
          onBlurCapture={() => setIsOpen(false)}
          className="absolute rounded-xl shadow-md w-[40vw] md:w-52 border border-gray-300 bg-white overflow-hidden right-20 top-[78px] text-sm"
        >
          <div className="flex flex-col cursor-pointer">
            <Fragment>
              {(() => {
                if (currentUser?.role.roleId === 1) {
                  return (
                    <MenuItem
                      icon={MdDashboard}
                      onClick={() => handleRouter('/admin')}
                      label="Dashboard "
                    />
                  );
                } else if (currentUser?.role.roleId === 2 || currentUser?.role.roleId === 4) {
                  return (
                    <Fragment>
                      <MenuItem
                        icon={MdDashboard}
                        onClick={() => handleRouter('/dashboard')}
                        label="Dashboard"
                      />
                      <MenuItem
                        icon={FaHouseUser}
                        onClick={() => handleRouter('/dashboard/ownership')}
                        label="My apartment"
                      />
                      <MenuItem
                        icon={MdOutlineSwapHorizontalCircle}
                        onClick={() => handleRouter('/dashboard/myExchange')}
                        label="My exchange"
                      />

                      <Link
                        href={`/recharge`}
                        onClick={() => {
                          recharge.onClickLink();
                          setIsOpen(false);
                        }}
                      >
                        <MenuItem
                          icon={FaMoneyCheckAlt}
                          // onClick={() => {
                          //   handleRouter('/recharge');
                          //   recharge.onClickLink();
                          // }}
                          label="Recharge"
                        />
                      </Link>

                      <MenuItem
                        icon={IoIosChatboxes}
                        onClick={() => handleRouter('/chat')}
                        label="Chat"
                      />
                      <MenuItem
                        icon={TfiWrite}
                        onClick={handleOpenWriteBlogModal}
                        label="Write blog"
                      />
                      <MenuItem
                        icon={FaList}
                        onClick={() => handleRouter('/dashboard/myBooking')}
                        label="My Booking"
                      />
                    </Fragment>
                  );
                } else if (currentUser?.role.roleId === 3) {
                  return (
                    <Fragment>
                      <div className="flex flex-row gap-1 items-center">
                        <MenuItem
                          icon={MdDashboard}
                          onClick={() => handleRouter('/staff')}
                          label="Dashboard "
                        />
                      </div>
                      <MenuItem
                        icon={IoIosCreate}
                        onClick={() => handleRouter('/staff/createresort')}
                        label="Create resort"
                      />
                      <MenuItem
                        icon={IoIosCreate}
                        onClick={() => handleRouter('/staff/createproperty')}
                        label="Create property"
                      />
                      <MenuItem
                        icon={FaListCheck}
                        onClick={() => handleRouter('/staff/listapproveOwnership')}
                        label="Approve ownership"
                      />
                    </Fragment>
                  );
                }
              })()}
              <hr />
              <MenuItem icon={IoIosLogOut} onClick={() => signOut()} label="Logout" />
            </Fragment>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default UserMenu;
