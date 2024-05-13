'use client';

import clsx from 'clsx';
import { formatRelative } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Conversation } from '@/app/actions/ConversationApis';
import AvatarGroup from '@/app/components/chat/AvatarGroup';
import Badge from '@mui/material/Badge';

interface ConversationBoxProps {
  data: Conversation;
  selected?: boolean;
  currentUser?: Object | any | null;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected, currentUser }) => {
  const router = useRouter();

  const hasSeen = useMemo(() => {
    return false;
  }, []);
  const handleClick = useCallback(() => {
    router.push(`/chat/${data.conversationId}`);
  }, [data.conversationId, router]);
  const participant = data?.participants?.find(user => user.user.userId !== currentUser?.userId);
  const unreadMessages = data?.participants?.find(user => user.user.userId === currentUser?.userId)?.countUnreadMessages ?? 0;
  const hasUnreadMessages = unreadMessages > 0;

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
                mb-2
                w-full
                relative
                flex
                items-center
                space-x-3
                hover:bg-neutral-100
                rounded-lg
                transition
                cursor-pointer
                p-3
                gap-y-3
            `,
        selected ? 'bg-neutral-100' : 'bg-white',
      )}
    >
      <Badge color='error' badgeContent={unreadMessages} invisible={!hasUnreadMessages}>
        <div className='relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
          {data?.participants?.length && data?.participants?.length > 2 ? (
            <AvatarGroup name={data.conversationName} />
          ) : (
            <Image
              alt='Avatar'
              src={`${
                data?.participants?.find((user) => user.user.userId !== currentUser?.userId)?.user
                  ?.avatar ?? '/images/placeholder.jpg'
              }`}
              fill
            />
          )}
        </div>
      </Badge>
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div className='flex flex-row items-center justify-between '>
            <p className='basis-2/3 text-sm font-semibold text-gray-900 dark:text-white'>
              {data?.participants?.length && data?.participants?.length > 2
                ? data.conversationName
                : data?.participants?.find((user) => user.user.userId !== currentUser?.userId)?.user
                  ?.fullName
                  ? data?.participants?.find((user) => user.user.userId !== currentUser?.userId)?.user
                    ?.fullName
                  : data?.participants?.find((user) => user.user.userId !== currentUser?.userId)?.user
                    ?.username}
            </p>
            <div>
              {data?.message?.createdOn && (
                <p className='basis-1/3 text-[10px] text-blue-600 dark:text-blue-500'>
                  {formatRelative(new Date(data?.message?.createdOn), new Date())}
                </p>
              )}
            </div>
          </div>
          <p
            className={clsx(
              'text-sm font-medium',
              'text-sm font-medium line-clamp-2',
              hasSeen ? 'text-gray-800 dark:text-gray-400' : 'text-gray-500 dark:text-white',
            )}
          >
            {data?.message?.authorId && data?.participants?.length
              && data?.participants?.length > 0 &&
              (data?.message?.authorId === currentUser?.userId
                ? 'You: '
                : (data?.participants?.find(
                  (user) => user?.user?.userId === data?.message?.authorId,
                )?.user?.fullName ||
                data?.participants?.find(
                  (user) => user?.user?.userId === data?.message?.authorId,
                )?.user?.username ||
                '') + ': ')}
            {data?.message?.text ?? 'Started a Conversation'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;

